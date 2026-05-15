import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Svg,
  Path,
  Rect,
  G,
} from "@react-pdf/renderer";

const BLUE = "#1d4ed8";
const ZINC_900 = "#18181b";
const ZINC_800 = "#27272a";
const ZINC_300 = "#d4d4d8";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: "7mm",
    paddingVertical: "7mm",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: ZINC_900,
    lineHeight: 1.4,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: BLUE,
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: ZINC_800,
    textTransform: "uppercase",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  contactItem: {
    width: "50%",
    paddingRight: 8,
    marginBottom: 2,
    fontSize: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    marginRight: 4,
  },
  contactLabel: {
    fontFamily: "Helvetica-Bold",
  },
  contactText: {
    fontSize: 10,
  },
  link: {
    color: BLUE,
    textDecoration: "none",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: BLUE,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottomWidth: 1,
    borderBottomColor: ZINC_300,
    paddingBottom: 2,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 4,
  },
  entry: {
    marginBottom: 6,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
  },
  bullet: {
    width: 8,
  },
  bulletText: {
    flex: 1,
  },
  skillRow: {
    marginBottom: 2,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
  },
});

const ICON_PROPS = {
  stroke: BLUE,
  strokeWidth: 1.4,
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconLocation({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M8 14.5s5-4.7 5-8.8a5 5 0 10-10 0c0 4.1 5 8.8 5 8.8z"
        {...ICON_PROPS}
      />
      <Path d="M8 7.7a1.9 1.9 0 100-3.8 1.9 1.9 0 000 3.8z" {...ICON_PROPS} />
    </Svg>
  );
}

function IconPhone({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M13.5 11.3v1.9a1.3 1.3 0 01-1.4 1.3 12.6 12.6 0 01-5.5-2 12.4 12.4 0 01-3.8-3.8 12.6 12.6 0 01-2-5.5A1.3 1.3 0 012.1 1.8H4a1.3 1.3 0 011.3 1.1c.1.7.2 1.3.4 1.9a1.3 1.3 0 01-.3 1.3l-.8.8a10.2 10.2 0 003.8 3.8l.8-.8a1.3 1.3 0 011.3-.3c.6.2 1.2.3 1.9.4a1.3 1.3 0 011.1 1.3z"
        {...ICON_PROPS}
      />
    </Svg>
  );
}

function IconEmail({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect
        x="1.8"
        y="3.5"
        width="12.4"
        height="9"
        rx="1"
        ry="1"
        {...ICON_PROPS}
      />
      <Path d="M1.8 4.3l6.2 4.7 6.2-4.7" {...ICON_PROPS} />
    </Svg>
  );
}

function IconLinkedIn({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill={BLUE} />
      <Path
        d="M4 6.5h1.6v5H4z M4.8 4a.95.95 0 100 1.9.95.95 0 000-1.9z M7 6.5h1.55v.7c.32-.45.85-.85 1.6-.85 1.55 0 2.05.9 2.05 2.2v2.95h-1.6V9.1c0-.55-.15-1-.75-1s-.95.35-.95 1v2.4H7V6.5z"
        fill="white"
      />
    </Svg>
  );
}

function IconGitHub({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8c0 2.9 1.85 5.35 4.4 6.2.32.06.44-.14.44-.31v-1.1c-1.78.39-2.16-.85-2.16-.85-.29-.74-.71-.94-.71-.94-.58-.4.04-.39.04-.39.64.04.98.66.98.66.57.97 1.49.69 1.86.53.06-.41.22-.69.4-.85-1.42-.16-2.91-.71-2.91-3.16 0-.7.25-1.27.66-1.71-.07-.16-.29-.81.06-1.69 0 0 .54-.17 1.78.66a6.2 6.2 0 013.24 0c1.24-.83 1.78-.66 1.78-.66.35.88.13 1.53.06 1.69.41.44.66 1.01.66 1.71 0 2.46-1.49 3-2.92 3.16.23.2.43.59.43 1.2v1.77c0 .17.12.38.45.31C12.65 13.34 14.5 10.9 14.5 8c0-3.6-2.9-6.5-6.5-6.5z"
        fill={BLUE}
      />
    </Svg>
  );
}

function IconPortfolio({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <G>
        <Path
          d="M8 1.6a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8z"
          {...ICON_PROPS}
        />
        <Path d="M1.6 8h12.8" {...ICON_PROPS} />
        <Path
          d="M8 1.6c1.9 2 1.9 10.8 0 12.8 M8 1.6c-1.9 2-1.9 10.8 0 12.8"
          {...ICON_PROPS}
        />
      </G>
    </Svg>
  );
}

const SOCIAL_ICONS = {
  location: IconLocation,
  phone: IconPhone,
  email: IconEmail,
  linkedin: IconLinkedIn,
  github: IconGitHub,
  portfolio: IconPortfolio,
};

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

function ContactItem({ label, field, value }) {
  if (!value) return null;
  const href = toHref(field, value);
  const Icon = SOCIAL_ICONS[field];
  return (
    <View style={styles.contactItem}>
      {Icon ? (
        <View style={styles.contactIcon}>
          <Icon />
        </View>
      ) : null}
      <Text style={styles.contactText}>
        <Text style={styles.contactLabel}>{label}: </Text>
        {href ? (
          <Link src={href} style={styles.link}>
            {value}
          </Link>
        ) : (
          value
        )}
      </Text>
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function CVPdfDocument({ cv }) {
  return (
    <Document
      title={`${cv.name} - CV`}
      author={cv.name}
      subject="Curriculum Vitae"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{cv.name}</Text>
          <Text style={styles.subtitle}>{cv.title}</Text>

          <View style={styles.contactGrid}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          {cv.summary.map((p, i) => (
            <Text key={i} style={styles.paragraph}>
              {p}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {cv.experience.map((job, i) => (
            <View key={i} style={styles.entry}>
              <Text style={styles.entryTitle}>
                {job.role} | {job.start} - {job.end} | {job.company}
              </Text>
              {job.bullets.map((b, j) => (
                <Bullet key={j}>{b}</Bullet>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((ed, i) => (
            <View key={i} style={styles.entry}>
              <Text style={styles.entryTitle}>
                {ed.degree} | {ed.start} – {ed.end}
              </Text>
              <Bullet>{ed.institution}</Bullet>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {Object.entries(cv.skills).map(([category, items]) => {
            const text = Array.isArray(items) ? items.join(", ") : items;
            return (
              <Text key={category} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{category}:</Text> {text}
              </Text>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
