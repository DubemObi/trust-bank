import { LayoutDashboard, Wallet, ArrowLeftRight, Receipt, CreditCard, Landmark, User as UserIcon, LogOut, ShieldCheck, Users, FileCheck2, BadgeCheck } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/components/AdminRoute";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Accounts", url: "/accounts", icon: Wallet },
  { title: "Transfer", url: "/transfer", icon: ArrowLeftRight },
  { title: "Transactions", url: "/transactions", icon: Receipt },
  { title: "Cards", url: "/cards", icon: CreditCard },
  { title: "Loans", url: "/loans", icon: Landmark },
];

const adminItems = [
  { title: "Card Requests", url: "/admin/card-requests", icon: FileCheck2 },
  { title: "Loan Requests", url: "/admin/loan-requests", icon: BadgeCheck },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Accounts", url: "/admin/accounts", icon: Wallet },
  { title: "Roles", url: "/admin/roles", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className={cn("px-4 pt-6 pb-4 flex items-center gap-2", collapsed && "justify-center px-2")}>
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
            T
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold leading-tight">Trust Cash</p>
              <p className="text-xs text-muted-foreground">Online Banking</p>
            </div>
          )}
        </div>

        {!isAdmin && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent rounded-xl"
                      activeClassName="bg-primary/15 text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>)}

        {isAdmin && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Admin</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className="hover:bg-sidebar-accent rounded-xl"
                        activeClassName="bg-primary/15 text-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 bg-sidebar">
        <NavLink
          to="/profile"
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent",
            collapsed && "justify-center",
          )}
          activeClassName="bg-primary/15"
        >
          <div className="h-9 w-9 rounded-full bg-primary/20 text-foreground flex items-center justify-center text-xs font-semibold">
            {initials(user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(), user?.email)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {(user?.fullName || user?.firstName || user?.email || "Account").slice(0, 8) + "..."}
              </p>
              <p className="text-xs text-muted-foreground truncate">{(user?.email).slice(0, 8) + "..."}</p>
            </div>
          )}
        </NavLink>
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}