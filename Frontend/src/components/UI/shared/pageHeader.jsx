import { Button } from "@/components/ui/doctor/button";

export function PageHeader({ title, actions }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-purple-700">{title}</h1>
      {actions && (
        <div className="flex space-x-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
