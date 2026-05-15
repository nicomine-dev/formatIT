function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-zinc-300 pb-1 text-sm font-bold uppercase tracking-wider text-blue-700">
        {title}
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

export default function CV({ cv }) {
  return (
    <article
      className="mx-auto my-8 max-w-3xl bg-white px-10 py-10 text-[13px] leading-relaxed text-zinc-900 shadow-sm print:my-0 print:shadow-none"
      aria-label="Curriculum Vitae"
    >
      <header>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-blue-700">
          {cv.name}
        </h1>
        <p className="mt-1 text-lg font-semibold uppercase tracking-wide text-zinc-800">
          {cv.title}
        </p>

        <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          <li>
            <span className="font-semibold">Location:</span> {cv.contact.location}
          </li>
          <li>
            <span className="font-semibold">LinkedIn:</span> {cv.contact.linkedin}
          </li>
          <li>
            <span className="font-semibold">Phone:</span> {cv.contact.phone}
          </li>
          <li>
            <span className="font-semibold">GitHub:</span> {cv.contact.github}
          </li>
          <li>
            <span className="font-semibold">Email:</span> {cv.contact.email}
          </li>
          <li>
            <span className="font-semibold">Portfolio:</span> {cv.contact.portfolio}
          </li>
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
              <dd className="inline">{items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </article>
  );
}
