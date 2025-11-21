import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/doctor/card";

export function StatsCard({ title, value, color = "text-purple-700" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={color}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
