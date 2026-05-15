function toHref(field, value) {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  switch (field) {
    case "email":
      return v.startsWith("mailto:") ? v : `mailto:${v}`;
    case "linkedin":
    case "github":
    case "portfolio": {
      if (/^https?:\/\//i.test(v)) return v;
      if (/^[\w.-]+\.[a-z]{2,}/i.test(v)) return `https://${v}`;
      return null;
    }
    default:
      return null;
  }
}

function Contact({ field, value }) {
  if (!value) return null;
  const href = toHref(field, value);
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#333] underline-offset-2 hover:underline"
    >
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );
}

function SectionHeader({ children }) {
  return (
    <h2 className="mb-[10px] mt-[14px] text-[10pt] font-semibold uppercase tracking-[0.16em] text-[#111]">
      {children}
    </h2>
  );
}

export default function CVPaper({ cv, pageNumber, pageCount, innerRef }) {
  const contacts = [
    { field: "location", value: cv.contact?.location },
    { field: "phone", value: cv.contact?.phone },
    { field: "email", value: cv.contact?.email },
    { field: "linkedin", value: cv.contact?.linkedin },
    { field: "github", value: cv.contact?.github },
    { field: "portfolio", value: cv.contact?.portfolio },
  ].filter((c) => c.value);

  const isContinuation = (pageNumber ?? 1) > 1;
  const hasFooter = (pageCount ?? 1) > 1;

  return (
    <article
      className="cv-paper relative bg-paper text-[#111]"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "64px 72px",
        fontFamily: "var(--font-sans)",
        fontSize: "10.5pt",
        lineHeight: 1.5,
        boxShadow: "var(--shadow-paper)",
      }}
      aria-label="Curriculum Vitae"
    >
      {isContinuation && (
        <div className="absolute left-[72px] top-[28px] font-mono text-[9pt] uppercase tracking-[0.12em] text-[#666]">
          {cv.name} · cont.
        </div>
      )}
      <div ref={innerRef}>
        {!isContinuation && (
          <header>
            <h1
              className="text-[#111]"
              style={{
                fontSize: "26pt",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {cv.name}
            </h1>
            {cv.title && (
              <p
                className="mt-[6px] text-[11pt] text-[#444]"
                style={{ letterSpacing: "-0.005em" }}
              >
                {cv.title}
              </p>
            )}
            {contacts.length > 0 && (
              <p className="mt-[14px] flex flex-wrap gap-x-[16px] gap-y-1 text-[9pt] text-[#444]">
                {contacts.map((c, i) => (
                  <span
                    key={c.field}
                    className="inline-flex items-center gap-[8px]"
                  >
                    <Contact field={c.field} value={c.value} />
                    {i < contacts.length - 1 && (
                      <span aria-hidden="true" className="text-[#bbb]">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </p>
            )}
            <hr
              className="border-0 border-t border-[#1a1a1a]"
              style={{ margin: "22px 0 18px" }}
            />
          </header>
        )}

        {cv.summary?.length > 0 && (
          <section>
            <SectionHeader>Professional Summary</SectionHeader>
            <div className="space-y-[8px] text-[10.5pt]">
              {cv.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {cv.experience?.length > 0 && (
          <section>
            <SectionHeader>Professional Experience</SectionHeader>
            <div className="space-y-[12px]">
              {cv.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-[12px]">
                    <h3 className="text-[10.5pt] font-semibold text-[#111]">
                      {job.role}
                      {job.company ? (
                        <span className="font-normal text-[#444]">
                          {" "}
                          · {job.company}
                        </span>
                      ) : null}
                    </h3>
                    <span
                      className="whitespace-nowrap text-[9pt] text-[#666]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {job.start}
                      {job.start || job.end ? " – " : ""}
                      {job.end}
                    </span>
                  </div>
                  {job.bullets?.length > 0 && (
                    <ul className="mt-[4px] list-disc pl-[18px] text-[10pt] marker:text-[#888]">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="mt-[2px]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.education?.length > 0 && (
          <section>
            <SectionHeader>Education</SectionHeader>
            <div className="space-y-[8px]">
              {cv.education.map((ed, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-[12px]"
                >
                  <div>
                    <div className="text-[10.5pt] font-semibold text-[#111]">
                      {ed.degree}
                    </div>
                    {ed.institution && (
                      <div className="text-[9.5pt] text-[#444]">
                        {ed.institution}
                      </div>
                    )}
                  </div>
                  <span
                    className="whitespace-nowrap text-[9pt] text-[#666]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {ed.start}
                    {ed.start || ed.end ? " – " : ""}
                    {ed.end}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills && Object.keys(cv.skills).length > 0 && (
          <section>
            <SectionHeader>Technical Skills</SectionHeader>
            <div className="space-y-[6px]">
              {Object.entries(cv.skills).map(([category, items]) => (
                <div
                  key={category}
                  className="grid items-baseline gap-x-[12px] text-[10pt]"
                  style={{ gridTemplateColumns: "200px 1fr" }}
                >
                  <span className="font-semibold">{category}</span>
                  <span className="text-[#333]">
                    {Array.isArray(items) ? items.join(", ") : items}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {hasFooter && (
        <div
          className="absolute left-[72px] right-[72px] flex justify-between font-mono text-[8pt] uppercase tracking-[0.12em] text-[#888]"
          style={{ bottom: "32px" }}
        >
          <span>{cv.name}</span>
          <span>
            {pageNumber} / {pageCount}
          </span>
        </div>
      )}
    </article>
  );
}
