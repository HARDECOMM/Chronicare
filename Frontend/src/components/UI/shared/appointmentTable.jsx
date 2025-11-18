import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppointmentTable({ appointments, columns, actions }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => <TableHead key={idx}>{col.label}</TableHead>)}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appt, idx) => (
          <TableRow key={idx}>
            {columns.map((col, cIdx) => (
              <TableCell key={cIdx}>
                {col.type === "status" ? (
                  <Badge
                    variant={
                      appt[col.key] === "Confirmed"
                        ? "default"
                        : appt[col.key] === "Pending"
                        ? "outline"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {appt[col.key]}
                  </Badge>
                ) : appt[col.key]}
              </TableCell>
            ))}
            {actions && (
              <TableCell>
                <div className="flex space-x-2">
                  {actions.map((action, aIdx) => (
                    <Button
                      key={aIdx}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => action.onClick(appt)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
