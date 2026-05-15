const MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const cvSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    title: { type: "string" },
    contact: {
      type: "object",
      properties: {
        location: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        portfolio: { type: "string" },
      },
      propertyOrdering: [
        "location",
        "phone",
        "email",
        "linkedin",
        "github",
        "portfolio",
      ],
    },
    summary: { type: "array", items: { type: "string" } },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        propertyOrdering: ["role", "company", "start", "end", "bullets"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
        },
        propertyOrdering: ["degree", "institution", "start", "end"],
      },
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: { type: "string" },
        },
        propertyOrdering: ["category", "items"],
      },
    },
  },
  propertyOrdering: [
    "name",
    "title",
    "contact",
    "summary",
    "experience",
    "education",
    "skills",
  ],
};

const SYSTEM_INSTRUCTION = `You build ATS-friendly CVs. The user's input can be a raw resume, a job description, career notes, or any combination, and may also include the candidate's current CV.

Rules:
- ALWAYS fill the summary, experience, education, and skills sections. Never return an empty array for them unless the candidate has zero data — when a current CV is provided, the candidate has data and you must rewrite, never erase.
- When the user input is a job description, tailor the summary, experience bullets, and skills to align the candidate (from their current CV) with that role. Stay truthful to the candidate's actual history.
- Summary: 1-2 short paragraphs, factual, role-focused, no filler. Always rewrite for the target role when a job description is involved.
- Each experience bullet is one concrete achievement or responsibility, active verb, measurable when possible.
- Dates use natural phrasing like "March 2024" or "Present".
- Skills: group by category (e.g., "Programming Languages", "Frameworks", "Databases"). Items field is a comma-separated string.
- Write in the same language the user used; default to English if unclear.
- For contact fields you do not have, return an empty string — never invent emails, phones, or URLs.
- No markdown formatting in any field.`;

const SKILLS_SYSTEM_INSTRUCTION = `You extract the technical skills required by a job description for an ATS-friendly CV.

Rules:
- Read the job description and list every concrete technical skill, framework, language, tool, methodology, or platform it asks for or implies.
- Group skills into clear categories. Suggested categories (use only those that apply, add more if needed): "Programming Languages", "Frameworks & Libraries", "Databases", "Cloud & DevOps", "Tools", "Methodologies", "Soft Skills".
- The items field is a comma-separated string in the same language as the job description.
- Only include skills the job description supports — do not invent unrelated skills.
- If an existing CV is provided, keep relevant skills the candidate already has and add the new ones from the job description.
- Do not include markdown formatting.`;

const skillsSchema = {
  type: "object",
  properties: {
    skills: cvSchema.properties.skills,
  },
  propertyOrdering: ["skills"],
};

const TRANSLATE_SYSTEM_INSTRUCTION = `You translate CV section content into the requested target language while preserving its JSON structure exactly.

Rules:
- Translate prose only: titles, summaries, role descriptions, bullets, degree names, skill items and category names.
- Do NOT translate proper names (people, companies, institutions, products), email addresses, URLs, or phone numbers — keep them verbatim.
- Translate natural-language dates ("Present", month names) into the target language. Keep numeric year/month digits as-is.
- Do not add, remove, or reorder array items. Preserve the same number of paragraphs, experiences, bullets, education entries, and skill categories.
- No markdown.`;

const TRANSLATE_SECTIONS = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
];
const TRANSLATE_LANGUAGES = ["English", "Spanish"];

const sectionSchemas = {
  header: {
    type: "object",
    properties: {
      name: { type: "string" },
      title: { type: "string" },
      contact: cvSchema.properties.contact,
    },
    propertyOrdering: ["name", "title", "contact"],
  },
  summary: {
    type: "object",
    properties: { summary: cvSchema.properties.summary },
    propertyOrdering: ["summary"],
  },
  experience: {
    type: "object",
    properties: { experience: cvSchema.properties.experience },
    propertyOrdering: ["experience"],
  },
  education: {
    type: "object",
    properties: { education: cvSchema.properties.education },
    propertyOrdering: ["education"],
  },
  skills: {
    type: "object",
    properties: { skills: cvSchema.properties.skills },
    propertyOrdering: ["skills"],
  },
};

function extractSection(section, current) {
  if (section === "header") {
    return {
      name: current.name ?? "",
      title: current.title ?? "",
      contact: current.contact ?? {},
    };
  }
  if (section === "skills") {
    return {
      skills: Object.entries(current.skills ?? {}).map(([category, items]) => ({
        category,
        items: Array.isArray(items) ? items.join(", ") : (items ?? ""),
      })),
    };
  }
  return { [section]: current[section] ?? [] };
}

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server missing GEMINI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const scope =
    body?.scope === "skills"
      ? "skills"
      : body?.scope === "translate"
        ? "translate"
        : "full";

  let payload;
  let translateSection;

  if (scope === "translate") {
    translateSection = body?.section;
    const targetLanguage = body?.targetLanguage;
    if (!TRANSLATE_SECTIONS.includes(translateSection)) {
      return Response.json(
        {
          error: `Invalid section. Expected one of: ${TRANSLATE_SECTIONS.join(", ")}`,
        },
        { status: 400 },
      );
    }
    if (!TRANSLATE_LANGUAGES.includes(targetLanguage)) {
      return Response.json(
        {
          error: `Invalid targetLanguage. Expected one of: ${TRANSLATE_LANGUAGES.join(", ")}`,
        },
        { status: 400 },
      );
    }
    const sectionData = extractSection(translateSection, body?.current ?? {});
    payload = {
      systemInstruction: {
        parts: [{ text: TRANSLATE_SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate the following CV "${translateSection}" section into ${targetLanguage}. Return the same JSON structure with translated text.\n${JSON.stringify(sectionData)}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: sectionSchemas[translateSection],
        temperature: 0.2,
      },
    };
  } else {
    const userPrompt = (body?.prompt || "").toString().trim();
    if (!userPrompt) {
      return Response.json(
        { error: 'Provide a "prompt" describing the CV to build.' },
        { status: 400 },
      );
    }
    const currentCv = body?.current ? JSON.stringify(body.current) : null;
    const userParts = [
      { text: userPrompt },
      currentCv ? { text: `Existing CV (JSON):\n${currentCv}` } : null,
    ].filter(Boolean);
    payload = {
      systemInstruction: {
        parts: [
          {
            text:
              scope === "skills"
                ? SKILLS_SYSTEM_INSTRUCTION
                : SYSTEM_INSTRUCTION,
          },
        ],
      },
      contents: [{ role: "user", parts: userParts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: scope === "skills" ? skillsSchema : cvSchema,
        temperature: 0.4,
      },
    };
  }

  let res;
  try {
    res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return Response.json(
      { error: `Gemini request failed: ${err.message}` },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `Gemini returned ${res.status}`, detail },
      { status: 502 },
    );
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return Response.json(
      { error: "Gemini response missing text", raw: json },
      { status: 502 },
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    return Response.json(
      { error: "Gemini returned non-JSON text", text },
      { status: 502 },
    );
  }

  if (scope === "translate") {
    if (translateSection === "header") {
      return Response.json({
        section: "header",
        data: {
          name: parsed.name ?? "",
          title: parsed.title ?? "",
          contact: {
            location: parsed.contact?.location ?? "",
            phone: parsed.contact?.phone ?? "",
            email: parsed.contact?.email ?? "",
            linkedin: parsed.contact?.linkedin ?? "",
            github: parsed.contact?.github ?? "",
            portfolio: parsed.contact?.portfolio ?? "",
          },
        },
      });
    }
    if (translateSection === "skills") {
      const obj = Array.isArray(parsed.skills)
        ? Object.fromEntries(
            parsed.skills
              .filter((s) => s && s.category)
              .map((s) => [s.category, s.items ?? ""]),
          )
        : parsed.skills || {};
      return Response.json({ section: "skills", data: obj });
    }
    return Response.json({
      section: translateSection,
      data: Array.isArray(parsed[translateSection])
        ? parsed[translateSection]
        : [],
    });
  }

  const skillsObject = Array.isArray(parsed.skills)
    ? Object.fromEntries(
        parsed.skills
          .filter((s) => s && s.category)
          .map((s) => [s.category, s.items ?? ""]),
      )
    : parsed.skills || {};

  if (scope === "skills") {
    return Response.json({ skills: skillsObject });
  }

  const cv = {
    name: parsed.name ?? "",
    title: parsed.title ?? "",
    contact: {
      location: parsed.contact?.location ?? "",
      phone: parsed.contact?.phone ?? "",
      email: parsed.contact?.email ?? "",
      linkedin: parsed.contact?.linkedin ?? "",
      github: parsed.contact?.github ?? "",
      portfolio: parsed.contact?.portfolio ?? "",
    },
    summary: Array.isArray(parsed.summary) ? parsed.summary : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: skillsObject,
  };

  return Response.json({ cv });
}
