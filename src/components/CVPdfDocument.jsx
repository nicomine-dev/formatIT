import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';

const BLUE = '#1d4ed8';
const ZINC_900 = '#18181b';
const ZINC_800 = '#27272a';
const ZINC_300 = '#d4d4d8';

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: '7mm',
    paddingVertical: '7mm',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: ZINC_900,
    lineHeight: 1.4,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: BLUE,
    textTransform: 'uppercase',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: ZINC_800,
    textTransform: 'uppercase',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  contactItem: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 2,
    fontSize: 10,
  },
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  link: {
    color: BLUE,
    textDecoration: 'none',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: BLUE,
    textTransform: 'uppercase',
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
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
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
    fontFamily: 'Helvetica-Bold',
  },
});

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
  if (!value) return null;
  const href = toHref(field, value);
  return (
    <Text style={styles.contactItem}>
      <Text style={styles.contactLabel}>{label}: </Text>
      {href ? (
        <Link src={href} style={styles.link}>
          {value}
        </Link>
      ) : (
        value
      )}
    </Text>
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
            <ContactItem label="Location" field="location" value={cv.contact.location} />
            <ContactItem label="LinkedIn" field="linkedin" value={cv.contact.linkedin} />
            <ContactItem label="Phone" field="phone" value={cv.contact.phone} />
            <ContactItem label="GitHub" field="github" value={cv.contact.github} />
            <ContactItem label="Email" field="email" value={cv.contact.email} />
            <ContactItem label="Portfolio" field="portfolio" value={cv.contact.portfolio} />
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
            const text = Array.isArray(items) ? items.join(', ') : items;
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
