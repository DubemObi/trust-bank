import { Home, FileCheck2, Users, User as UserIcon, ArrowLeftRight, CreditCard } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useIsAdmin } from "@/components/AdminRoute";

const customerTabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight, end: false },
  { to: "/cards", label: "Cards", icon: CreditCard, end: false },
  { to: "/profile", label: "Profile", icon: UserIcon, end: false },
];

const adminTabs = [
  { to: "/admin", label: "Home", icon: Home, end: true },
  { to: "/admin/card-requests", label: "Cards", icon: FileCheck2, end: false },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
  { to: "/profile", label: "Profile", icon: UserIcon, end: false },
];

export const BottomNav = () => {
  const isAdmin = useIsAdmin();
  const tabs = isAdmin ? adminTabs : customerTabs;
  return (
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
};