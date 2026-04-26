import { cn } from "@/lib/utils";
import { ReactNode } from "react";


export const PageHeader = ({ title, subtitle, action, className }) => (
  <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6 animate-fade-in", className)}>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex gap-2">{action}</div>}
  </div>
);
