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

const STROKE = "#1d4ed8";

function IconLocation() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M8 14.5s5-4.7 5-8.8a5 5 0 10-10 0c0 4.1 5 8.8 5 8.8z"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7.7a1.9 1.9 0 100-3.8 1.9 1.9 0 000 3.8z"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M13.5 11.3v1.9a1.3 1.3 0 01-1.4 1.3 12.6 12.6 0 01-5.5-2 12.4 12.4 0 01-3.8-3.8 12.6 12.6 0 01-2-5.5A1.3 1.3 0 012.1 1.8H4a1.3 1.3 0 011.3 1.1c.1.7.2 1.3.4 1.9a1.3 1.3 0 01-.3 1.3l-.8.8a10.2 10.2 0 003.8 3.8l.8-.8a1.3 1.3 0 011.3-.3c.6.2 1.2.3 1.9.4a1.3 1.3 0 011.1 1.3z"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1.8"
        y="3.5"
        width="12.4"
        height="9"
        rx="1"
        ry="1"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M1.8 4.3l6.2 4.7 6.2-4.7"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill={STROKE} />
      <path
        d="M4 6.5h1.6v5H4z M4.8 4a.95.95 0 100 1.9.95.95 0 000-1.9z M7 6.5h1.55v.7c.32-.45.85-.85 1.6-.85 1.55 0 2.05.9 2.05 2.2v2.95h-1.6V9.1c0-.55-.15-1-.75-1s-.95.35-.95 1v2.4H7V6.5z"
        fill="white"
      />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8c0 2.9 1.85 5.35 4.4 6.2.32.06.44-.14.44-.31v-1.1c-1.78.39-2.16-.85-2.16-.85-.29-.74-.71-.94-.71-.94-.58-.4.04-.39.04-.39.64.04.98.66.98.66.57.97 1.49.69 1.86.53.06-.41.22-.69.4-.85-1.42-.16-2.91-.71-2.91-3.16 0-.7.25-1.27.66-1.71-.07-.16-.29-.81.06-1.69 0 0 .54-.17 1.78.66a6.2 6.2 0 013.24 0c1.24-.83 1.78-.66 1.78-.66.35.88.13 1.53.06 1.69.41.44.66 1.01.66 1.71 0 2.46-1.49 3-2.92 3.16.23.2.43.59.43 1.2v1.77c0 .17.12.38.45.31C12.65 13.34 14.5 10.9 14.5 8c0-3.6-2.9-6.5-6.5-6.5z"
        fill={STROKE}
      />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="8"
        cy="8"
        r="6.4"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M1.6 8h12.8 M8 1.6c1.9 2 1.9 10.8 0 12.8 M8 1.6c-1.9 2-1.9 10.8 0 12.8"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  location: IconLocation,
  phone: IconPhone,
  email: IconEmail,
  linkedin: IconLinkedIn,
  github: IconGitHub,
  portfolio: IconPortfolio,
};

function ContactItem({ label, field, value }) {
  const href = toHref(field, value);
  const Icon = ICONS[field];
  return (
    <li className="flex items-center gap-1.5">
      {Icon && <Icon />}
      <span>
        <span className="font-semibold">{label}:</span>{" "}
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
      </span>
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
        <p className="mt-2.5 text-base font-semibold uppercase tracking-wide text-zinc-800">
          {cv.title}
        </p>

        <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-[12px]">
          <ContactItem
            label="Location"
            field="location"
            value={cv.contact.location}
          />
          <ContactItem
            label="LinkedIn"
            field="linkedin"
            value={cv.contact.linkedin}
          />
          <ContactItem label="Phone" field="phone" value={cv.contact.phone} />
          <ContactItem
            label="GitHub"
            field="github"
            value={cv.contact.github}
          />
          <ContactItem label="Email" field="email" value={cv.contact.email} />
          <ContactItem
            label="Portfolio"
            field="portfolio"
            value={cv.contact.portfolio}
          />
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
              <dt className="inline font-bold">{category}:</dt>{" "}
              <dd className="inline">
                {Array.isArray(items) ? items.join(", ") : items}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </article>
  );
}
