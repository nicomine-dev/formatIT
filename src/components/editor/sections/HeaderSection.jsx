import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import SectionTranslate from "@/components/editor/SectionTranslate";

const CONTACT_FIELDS = [
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

export default function HeaderSection({ cv, setCv, translate }) {
  const updateField = (key, value) =>
    setCv((prev) => ({ ...prev, [key]: value }));
  const updateContact = (key, value) =>
    setCv((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <SectionTranslate section="header" translate={translate} />
      </div>
      <div className="grid gap-3">
        <Input
          label="Name"
          value={cv.name}
          onChange={(v) => updateField("name", v)}
        />
        <Input
          label="Subtitle"
          value={cv.title}
          onChange={(v) => updateField("title", v)}
        />
      </div>
      <div className="pt-1">
        <Label className="mb-2 block">Contact</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CONTACT_FIELDS.map(({ key, label }) => (
            <Input
              key={key}
              label={label}
              value={cv.contact?.[key] ?? ""}
              onChange={(v) => updateContact(key, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
