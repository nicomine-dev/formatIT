import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

export default function EntryCard({ kind, index, onRemove, children }) {
  const indexLabel = String(index).padStart(2, "0");
  return (
    <div className="rounded-2 border border-rule bg-surface-2 p-3">
      <div className="mb-3 flex items-center justify-between">
        <Label>
          {kind} · {indexLabel}
        </Label>
        {onRemove && (
          <Button variant="danger" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
