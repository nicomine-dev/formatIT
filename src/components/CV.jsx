function Section({ title, children }) {
  return (
    <section className="mt-4">
      <h2 className="border-b border-zinc-300 pb-1 text-[13px] font-bold uppercase tracking-wider text-blue-700">
        {title}
      </h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

function toHref(field, value) {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;

  switch (field) {
    case 'email':
      return v.startsWith('mailto:') ? v : `mailto:${v}`;
    case 'linkedin':
    case 'github':
    case 'portfolio': {
      if (/^https?:\/\//i.test(v)) return v;
      if (/^[\w.-]+\.[a-z]{2,}/i.test(v)) return `https://${v}`;
      return null;
    }
    default:
      return null;
  }
}

function ContactItem({ label, field, value }) {
  const href = toHref(field, value);
  return (
    <li>
      <span className="font-semibold">{label}:</span>{' '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline-offset-2 hover:underline"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </li>
  );
}

export default function CV({ cv }) {
  return (
    <article
      className="bg-white px-[7mm] py-[7mm] text-[12px] leading-normal text-zinc-900"
      aria-label="Curriculum Vitae"
    >
      <header>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-700">
          {cv.name}
        </h1>
        <p className="mt-1 text-base font-semibold uppercase tracking-wide text-zinc-800">
          {cv.title}
        </p>

        <ul className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-[12px]">
          <ContactItem label="Location" field="location" value={cv.contact.location} />
          <ContactItem label="LinkedIn" field="linkedin" value={cv.contact.linkedin} />
          <ContactItem label="Phone" field="phone" value={cv.contact.phone} />
          <ContactItem label="GitHub" field="github" value={cv.contact.github} />
          <ContactItem label="Email" field="email" value={cv.contact.email} />
          <ContactItem label="Portfolio" field="portfolio" value={cv.contact.portfolio} />
        </ul>
      </header>

      <Section title="Professional Summary">
        {cv.summary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Section>

      <Section title="Professional Experience">
        {cv.experience.map((job, i) => (
          <div key={i}>
            <h3 className="font-bold">
              {job.role} | {job.start} - {job.end} | {job.company}
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education">
        {cv.education.map((ed, i) => (
          <div key={i}>
            <h3 className="font-bold">
              {ed.degree} | {ed.start} – {ed.end}
            </h3>
            <ul className="mt-1 list-disc pl-5">
              <li>{ed.institution}</li>
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Technical Skills">
        <dl className="space-y-1">
          {Object.entries(cv.skills).map(([category, items]) => (
            <div key={category}>
              <dt className="inline font-bold">{category}:</dt>{' '}
              <dd className="inline">
                {Array.isArray(items) ? items.join(', ') : items}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </article>
  );
}
