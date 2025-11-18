import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({ title, profile, fields }) {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.map((field, idx) => (
          <p key={idx}>
            <strong>{field.label}:</strong>{" "}
            {field.type === "badge" ? (
              <Badge variant="outline" className="capitalize">{profile[field.key]}</Badge>
            ) : profile[field.key]}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
