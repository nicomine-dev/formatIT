import Button from "@/components/ui/Button";
import EntryCard from "@/components/editor/EntryCard";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";

export default function ExperienceSection({ cv, setCv }) {
  const updateJob = (i, key, value) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, idx) =>
        idx === i ? { ...e, [key]: value } : e,
      ),
    }));
  const updateBullet = (ji, bi, value) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, idx) =>
        idx === ji
          ? { ...e, bullets: e.bullets.map((b, k) => (k === bi ? value : b)) }
          : e,
      ),
    }));
  const addBullet = (ji) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, idx) =>
        idx === ji ? { ...e, bullets: [...e.bullets, ""] } : e,
      ),
    }));
  const removeBullet = (ji, bi) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e, idx) =>
        idx === ji
          ? { ...e, bullets: e.bullets.filter((_, k) => k !== bi) }
          : e,
      ),
    }));
  const addJob = () =>
    setCv((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", start: "", end: "", bullets: [""] },
      ],
    }));
  const removeJob = (i) =>
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="ghost" onClick={addJob}>
          + Add experience
        </Button>
      </div>
      <div className="space-y-3">
        {cv.experience.map((job, i) => (
          <EntryCard
            key={i}
            kind="Experience"
            index={i + 1}
            onRemove={() => removeJob(i)}
          >
            <Input
              label="Role"
              value={job.role}
              onChange={(v) => updateJob(i, "role", v)}
            />
            <Input
              label="Company"
              value={job.company}
              onChange={(v) => updateJob(i, "company", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start"
                value={job.start}
                onChange={(v) => updateJob(i, "start", v)}
              />
              <Input
                label="End"
                value={job.end}
                onChange={(v) => updateJob(i, "end", v)}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Bullets</Label>
                <Button variant="ghost" onClick={() => addBullet(i)}>
                  + Add bullet
                </Button>
              </div>
              <div className="space-y-3">
                {job.bullets.map((bullet, bi) => (
                  <div key={bi} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Bullet {String(bi + 1).padStart(2, "0")}</Label>
                      {job.bullets.length > 1 && (
                        <Button
                          variant="danger"
                          onClick={() => removeBullet(i, bi)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={bullet}
                      onChange={(v) => updateBullet(i, bi, v)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>
          </EntryCard>
        ))}
      </div>
    </div>
  );
}
