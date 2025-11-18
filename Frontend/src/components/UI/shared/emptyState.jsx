// components/ui/shared/EmptyState.jsx
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      {description && <p className="text-gray-500 max-w-md">{description}</p>}
      {action && (
        <Button
          variant={action.variant || "default"}
          onClick={action.onClick}
          className={action.className}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
