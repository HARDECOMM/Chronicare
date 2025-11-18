import { Button } from "@/components/ui/button";

export function ActionButton({ label, onClick, variant = "default", className }) {
  return (
    <Button
      variant={variant}
      className={className || "w-full bg-purple-600 text-white hover:bg-purple-700"}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
