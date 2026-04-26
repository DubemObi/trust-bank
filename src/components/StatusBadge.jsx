import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const cls =
    s === "approved"
      ? "bg-success/15 text-success border-success/30"
      : s === "rejected"
        ? "bg-destructive/15 text-destructive border-destructive/30"
        : "bg-primary/15 text-foreground border-primary/30";
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", cls)}>
      {status || "Pending"}
    </Badge>
  );
};
