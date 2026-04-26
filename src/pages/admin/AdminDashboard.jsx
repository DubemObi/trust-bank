import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  accountsApi,
  cardRequestsApi,
  loanRequestsApi,
  rolesApi,
  usersApi,
} from "@/lib/endpoints";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Users,
  Wallet,
  FileCheck2,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { CardSkeleton } from "@/components/Skeletons";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const usersQ = useQuery({ queryKey: ["admin", "users"], queryFn: usersApi.list });
  const accountsQ = useQuery({ queryKey: ["admin", "accounts"], queryFn: accountsApi.list });
  const cardReqQ = useQuery({ queryKey: ["admin", "card-requests"], queryFn: cardRequestsApi.list });
  const loanReqQ = useQuery({ queryKey: ["admin", "loan-requests"], queryFn: loanRequestsApi.list });
  const rolesQ = useQuery({ queryKey: ["admin", "roles"], queryFn: rolesApi.list });


  const pendingCards = (cardReqQ.data ?? []).filter((r) => (r.status ==0 || !r.status));
  const pendingLoans = (loanReqQ.data ?? []).filter((r) => (r.status ==0 || !r.status));

  const stats = [
    {
      label: "Total users",
      value: usersQ.data?.length ?? 0,
      icon: Users,
      onClick: () => navigate("/admin/users"),
      loading: usersQ.isLoading,
    },
    {
      label: "Bank accounts",
      value: accountsQ.data?.length ?? 0,
      icon: Wallet,
      onClick: () => navigate("/admin/accounts"),
      loading: accountsQ.isLoading,
    },
    {
      label: "Pending card requests",
      value: pendingCards.length,
      icon: FileCheck2,
      onClick: () => navigate("/admin/card-requests"),
      loading: cardReqQ.isLoading,
      highlight: pendingCards.length > 0,
    },
    {
      label: "Pending loan requests",
      value: pendingLoans.length,
      icon: BadgeCheck,
      onClick: () => navigate("/admin/loan-requests"),
      loading: loanReqQ.isLoading,
      highlight: pendingLoans.length > 0,
    },
    {
      label: "Roles",
      value: rolesQ.data?.length ?? 0,
      icon: ShieldCheck,
      onClick: () => navigate("/admin/roles"),
      loading: rolesQ.isLoading,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.firstName || user?.fullName?.split(" ")[0] || "admin"} 👋
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of the Swift Cash platform.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className={`text-left rounded-2xl border bg-card p-4 sm:p-5 shadow-card transition hover:shadow-elevated hover:-translate-y-0.5 ${
              s.highlight ? "border-primary/50" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  s.highlight
                    ? "bg-primary/15 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-3">
              {s.loading ? "—" : s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Pending requests panels */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="surface-dark rounded-3xl p-5 sm:p-6 shadow-elevated min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Pending card requests</h2>
              <p className="text-xs text-white/60">Awaiting your approval</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={() => navigate("/admin/card-requests")}
            >
              See all
            </Button>
          </div>
          {cardReqQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : pendingCards.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <FileCheck2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No pending card requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingCards.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate("/admin/card-requests")}
                  className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {r.cardType || "Card"} request
                    </p>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status || "Pending"} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="surface-dark rounded-3xl p-5 sm:p-6 shadow-elevated min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Pending loan requests</h2>
              <p className="text-xs text-white/60">Awaiting your approval</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={() => navigate("/admin/loan-requests")}
            >
              See all
            </Button>
          </div>
          {loanReqQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : pendingLoans.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <BadgeCheck className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No pending loan requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingLoans.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate("/admin/loan-requests")}
                  className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      Loan · {r.purpose || "No purpose specified"}
                    </p>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(r.createdAt)} · {r.termMonths ?? "—"} mo
                    </p>
                  </div>
                  <StatusBadge status={r.status || "Pending"} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            variant="secondary"
            className="h-auto justify-start py-4 rounded-2xl"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="h-4 w-4 mr-2" /> Manage users
          </Button>
          <Button
            variant="secondary"
            className="h-auto justify-start py-4 rounded-2xl"
            onClick={() => navigate("/admin/accounts")}
          >
            <Wallet className="h-4 w-4 mr-2" /> Manage accounts
          </Button>
          <Button
            variant="secondary"
            className="h-auto justify-start py-4 rounded-2xl"
            onClick={() => navigate("/admin/roles")}
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> Manage roles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;