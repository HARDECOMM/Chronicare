// components/ui/shared/UserTable.jsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UserTable({ users, columns, actions }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={idx}>{col.label}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, idx) => (
          <TableRow key={idx}>
            {columns.map((col, cIdx) => (
              <TableCell key={cIdx}>
                {col.type === "status" ? (
                  <Badge
                    variant={
                      user[col.key] === "Active"
                        ? "default"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {user[col.key]}
                  </Badge>
                ) : col.type === "role" ? (
                  <Badge variant="outline" className="capitalize">
                    {user[col.key]}
                  </Badge>
                ) : (
                  user[col.key]
                )}
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
                      onClick={() => action.onClick(user)}
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
