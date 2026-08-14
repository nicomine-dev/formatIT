import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";

export default function EntryCard({
  kind,
  index,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}) {
  const indexLabel = String(index).padStart(2, "0");
  const movable = onMoveUp !== undefined || onMoveDown !== undefined;
  return (
    <div className="rounded-2 border border-rule bg-surface-2 p-3">
      <div className="mb-3 flex items-center justify-between">
        <Label>
          {kind} · {indexLabel}
        </Label>
        <div className="flex items-center gap-1">
          {movable && (
            <>
              <Button
                variant="ghost"
                aria-label="Move up"
                disabled={!onMoveUp}
                onClick={onMoveUp}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                aria-label="Move down"
                disabled={!onMoveDown}
                onClick={onMoveDown}
              >
                ↓
              </Button>
            </>
          )}
          {onRemove && (
            <Button variant="danger" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
