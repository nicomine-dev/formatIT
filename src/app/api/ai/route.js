const MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const cvSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    title: { type: 'string' },
    contact: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        linkedin: { type: 'string' },
        github: { type: 'string' },
        portfolio: { type: 'string' },
      },
      propertyOrdering: [
        'location',
        'phone',
        'email',
        'linkedin',
        'github',
        'portfolio',
      ],
    },
    summary: { type: 'array', items: { type: 'string' } },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          role: { type: 'string' },
          company: { type: 'string' },
          start: { type: 'string' },
          end: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
        propertyOrdering: ['role', 'company', 'start', 'end', 'bullets'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          start: { type: 'string' },
          end: { type: 'string' },
        },
        propertyOrdering: ['degree', 'institution', 'start', 'end'],
      },
    },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          items: { type: 'string' },
        },
        propertyOrdering: ['category', 'items'],
      },
    },
  },
  propertyOrdering: [
    'name',
    'title',
    'contact',
    'summary',
    'experience',
    'education',
    'skills',
  ],
};

const SYSTEM_INSTRUCTION = `You build ATS-friendly CVs. Given a user's free-form description (raw resume text, job description, career notes, etc.), produce a CV in the exact JSON shape provided.

Rules:
- Write in the same language the user used. If unclear, default to English.
- Keep summaries 1-2 paragraphs, factual, no fluff.
- Each experience bullet is one concrete achievement or responsibility (active verb, measurable when possible).
- Dates use natural phrasing like "March 2024" or "Present".
- Skills: group by category (e.g., "Programming Languages", "Frameworks", "Databases"). The items field is a comma-separated string.
- For contact fields you do not have, return an empty string — never invent emails, phones, or URLs.
- Do not include markdown formatting in any field.`;

const SKILLS_SYSTEM_INSTRUCTION = `You extract the technical skills required by a job description for an ATS-friendly CV.

Rules:
- Read the job description and list every concrete technical skill, framework, language, tool, methodology, or platform it asks for or implies.
- Group skills into clear categories. Suggested categories (use only those that apply, add more if needed): "Programming Languages", "Frameworks & Libraries", "Databases", "Cloud & DevOps", "Tools", "Methodologies", "Soft Skills".
- The items field is a comma-separated string in the same language as the job description.
- Only include skills the job description supports — do not invent unrelated skills.
- If an existing CV is provided, keep relevant skills the candidate already has and add the new ones from the job description.
- Do not include markdown formatting.`;

const skillsSchema = {
  type: 'object',
  properties: {
    skills: cvSchema.properties.skills,
  },
  propertyOrdering: ['skills'],
};

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Server missing GEMINI_API_KEY. Add it to .env.local.' },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const userPrompt = (body?.prompt || '').toString().trim();
  if (!userPrompt) {
    return Response.json(
      { error: 'Provide a "prompt" describing the CV to build.' },
      { status: 400 },
    );
  }

  const scope = body?.scope === 'skills' ? 'skills' : 'full';
  const currentCv = body?.current ? JSON.stringify(body.current) : null;
  const userParts = [
    { text: userPrompt },
    currentCv ? { text: `Existing CV (JSON):\n${currentCv}` } : null,
  ].filter(Boolean);

  const payload = {
    systemInstruction: {
      parts: [
        {
          text: scope === 'skills' ? SKILLS_SYSTEM_INSTRUCTION : SYSTEM_INSTRUCTION,
        },
      ],
    },
    contents: [{ role: 'user', parts: userParts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: scope === 'skills' ? skillsSchema : cvSchema,
      temperature: 0.4,
    },
  };

  let res;
  try {
    res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      { error: 'Gemini response missing text', raw: json },
      { status: 502 },
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    return Response.json(
      { error: 'Gemini returned non-JSON text', text },
      { status: 502 },
    );
  }

  const skillsObject = Array.isArray(parsed.skills)
    ? Object.fromEntries(
        parsed.skills
          .filter((s) => s && s.category)
          .map((s) => [s.category, s.items ?? '']),
      )
    : parsed.skills || {};

  if (scope === 'skills') {
    return Response.json({ skills: skillsObject });
  }

  const cv = {
    name: parsed.name ?? '',
    title: parsed.title ?? '',
    contact: {
      location: parsed.contact?.location ?? '',
      phone: parsed.contact?.phone ?? '',
      email: parsed.contact?.email ?? '',
      linkedin: parsed.contact?.linkedin ?? '',
      github: parsed.contact?.github ?? '',
      portfolio: parsed.contact?.portfolio ?? '',
    },
    summary: Array.isArray(parsed.summary) ? parsed.summary : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills: skillsObject,
  };

  return Response.json({ cv });
}
