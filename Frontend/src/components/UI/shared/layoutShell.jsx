import { Card } from "@/components/ui/card";

export function LayoutShell({ sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebar}
      <main className="flex-1 p-6">
        <Card className="p-4 shadow-sm bg-white">{children}</Card>
      </main>
    </div>
  );
}
