import { Home, ArrowLeftRight, CreditCard, User as UserIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight, end: false },
  { to: "/cards", label: "Cards", icon: CreditCard, end: false },
  { to: "/profile", label: "Profile", icon: UserIcon, end: false },
];

export const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
    <div className="grid grid-cols-4">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
          activeClassName="text-foreground"
        >
          <t.icon className="h-5 w-5" />
          <span>{t.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
