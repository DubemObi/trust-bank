import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { accountsApi, transactionsApi } from "@/lib/endpoints";
import { useAuth } from "@/context/AuthContext";
import { AccountCard } from "@/components/AccountCard";
import { TransactionRow } from "@/components/TransactionRow";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Plus, ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react";
import { CardSkeleton, ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency } from "@/lib/format";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const accountsQ = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.list });
  const txQ = useQuery({ queryKey: ["transactions"], queryFn: transactionsApi.list });

  const accounts = accountsQ.data ?? [];
  const primary = accounts[0];
  const recent = (txQ.data ?? []).slice(0, 6);
  const totalBalance = accounts.reduce((s, a) => s + (a.balance ?? 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground">
          Hi, {user?.firstName || user?.fullName?.split(" ")[0] || "there"} 👋
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column: balance + actions */}
        <div className="lg:col-span-1 space-y-4">
          {accountsQ.isLoading ? (
            <CardSkeleton />
          ) : primary ? (
            <AccountCard account={primary} variant="primary" onClick={() => navigate(`/accounts/${primary.id}`)} />
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-6 bg-card">
              <EmptyState
                title="No accounts yet"
                description="Open your first bank account to get started."
                action={
                  <Button onClick={() => navigate("/accounts")} className="rounded-xl">
                    <Plus className="h-4 w-4" /> Create account
                  </Button>
                }
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate("/transfer")}>
              <ArrowLeftRight className="h-4 w-4 mb-1" />
              <span className="text-xs">Transfer</span>
            </Button>
            <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate("/deposit")}>
              <ArrowDownLeft className="h-4 w-4 mb-1" />
              <span className="text-xs">Deposit</span>
            </Button>
            <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate("/withdraw")}>
              <ArrowUpRight className="h-4 w-4 mb-1" />
              <span className="text-xs">Withdraw</span>
            </Button>
          </div>

          <div className="rounded-3xl bg-card p-5 shadow-card border border-border">
            <p className="text-xs text-muted-foreground">Total balance (all accounts)</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">{accounts.length} account{accounts.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {/* Right column: recent transactions (dark panel like Trust Cash) */}
        <div className="lg:col-span-2 surface-dark rounded-3xl p-5 sm:p-6 shadow-elevated min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <p className="text-xs text-white/60">Latest transactions across your accounts</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={() => navigate("/transactions")}
            >
              See all
            </Button>
          </div>

          {txQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onClick={() => navigate(`/transactions/${tx.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {accounts.length > 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Your accounts</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.slice(1).map((a) => (
              <AccountCard key={a.id} account={a} onClick={() => navigate(`/accounts/${a.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
