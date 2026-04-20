import { LayoutDashboard, Wallet, ArrowLeftRight, Receipt, CreditCard, Landmark, User as UserIcon, LogOut } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Accounts", url: "/accounts", icon: Wallet },
  { title: "Transfer", url: "/transfer", icon: ArrowLeftRight },
  { title: "Transactions", url: "/transactions", icon: Receipt },
  { title: "Cards", url: "/cards", icon: CreditCard },
  { title: "Loans", url: "/loans", icon: Landmark },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className={cn("px-4 pt-6 pb-4 flex items-center gap-2", collapsed && "justify-center px-2")}>
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
            S
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold leading-tight">Swift Cash</p>
              <p className="text-xs text-muted-foreground">Online Banking</p>
            </div>
          )}
        </div>

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
        </SidebarGroup>
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
                {user?.fullName || user?.firstName || user?.email || "Account"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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
