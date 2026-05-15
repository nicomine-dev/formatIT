import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

// Editorial typography — Helvetica family is built into @react-pdf and is the
// safest ATS-friendly choice. Sizes, spacing and casing mirror the HTML
// CVPaper so the on-screen preview and the exported PDF read as the same
// document at a glance.

const INK = "#111111";
const INK_2 = "#444444";
const INK_3 = "#666666";
const RULE = "#1a1a1a";

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 56,
    paddingHorizontal: 72,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: INK,
    lineHeight: 1.5,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: INK_2,
    marginTop: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    gap: 4,
  },
  contactItem: {
    fontSize: 9,
    color: INK_2,
    marginRight: 12,
  },
  link: {
    color: INK_2,
    textDecoration: "none",
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    marginTop: 22,
    marginBottom: 18,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: INK,
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 6,
    fontSize: 10.5,
    color: INK,
  },
  entry: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  entryRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: INK,
    flex: 1,
    paddingRight: 12,
  },
  entryCompany: {
    fontFamily: "Helvetica",
    color: INK_2,
  },
  entryDates: {
    fontSize: 9,
    color: INK_3,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 12,
  },
  bullet: {
    width: 8,
    color: INK_3,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: INK,
  },
  eduHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  eduMain: {
    flex: 1,
    paddingRight: 12,
  },
  eduDegree: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: INK,
  },
  eduInstitution: {
    fontSize: 9.5,
    color: INK_2,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
  },
  skillCategory: {
    width: 150,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  skillItems: {
    flex: 1,
    color: "#333333",
  },
});

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

function ContactItem({ field, value, last }) {
  if (!value) return null;
  const href = toHref(field, value);
  return (
    <Text style={styles.contactItem}>
      {href ? (
        <Link src={href} style={styles.link}>
          {value}
        </Link>
      ) : (
        value
      )}
      {!last ? "  ·" : ""}
    </Text>
  );
}

export default function CVPdfDocument({ cv }) {
  const sectionTitle = (text) => text.toUpperCase();
  const contacts = [
    { field: "location", value: cv.contact?.location },
    { field: "phone", value: cv.contact?.phone },
    { field: "email", value: cv.contact?.email },
    { field: "linkedin", value: cv.contact?.linkedin },
    { field: "github", value: cv.contact?.github },
    { field: "portfolio", value: cv.contact?.portfolio },
  ].filter((c) => c.value);

  return (
    <Document
      title={`${cv.name} - CV`}
      author={cv.name}
      subject="Curriculum Vitae"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{cv.name}</Text>
          {cv.title ? <Text style={styles.subtitle}>{cv.title}</Text> : null}

          {contacts.length > 0 && (
            <View style={styles.contactRow}>
              {contacts.map((c, i) => (
                <ContactItem
                  key={c.field}
                  field={c.field}
                  value={c.value}
                  last={i === contacts.length - 1}
                />
              ))}
            </View>
          )}

          <View style={styles.rule} />
        </View>

        {cv.summary?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {sectionTitle("Professional Summary")}
            </Text>
            {cv.summary.map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>
        )}

        {cv.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {sectionTitle("Professional Experience")}
            </Text>
            {cv.experience.map((job, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryRole}>
                    {job.role}
                    {job.company ? (
                      <Text style={styles.entryCompany}> · {job.company}</Text>
                    ) : null}
                  </Text>
                  <Text style={styles.entryDates}>
                    {job.start}
                    {job.start || job.end ? " – " : ""}
                    {job.end}
                  </Text>
                </View>
                {job.bullets?.map((b, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {cv.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitle("Education")}</Text>
            {cv.education.map((ed, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.eduHeader}>
                  <View style={styles.eduMain}>
                    <Text style={styles.eduDegree}>{ed.degree}</Text>
                    {ed.institution ? (
                      <Text style={styles.eduInstitution}>
                        {ed.institution}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.entryDates}>
                    {ed.start}
                    {ed.start || ed.end ? " – " : ""}
                    {ed.end}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {cv.skills && Object.keys(cv.skills).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {sectionTitle("Technical Skills")}
            </Text>
            {Object.entries(cv.skills).map(([category, items]) => (
              <View key={category} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{category}</Text>
                <Text style={styles.skillItems}>
                  {Array.isArray(items) ? items.join(", ") : items}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
