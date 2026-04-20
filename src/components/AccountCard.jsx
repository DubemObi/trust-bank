import { formatCurrency, maskAccount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";


export const AccountCard = ({ account, variant = "default", onClick }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-3xl p-5 sm:p-6 transition-all hover:scale-[1.01] shadow-card",
        isPrimary
          ? "surface-dark"
          : "bg-card border border-border hover:border-primary/40",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            isPrimary ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
          )}
        >
          <Wallet className="h-5 w-5" />
        </div>
        <span className={cn("text-xs uppercase tracking-wider", isPrimary ? "text-white/60" : "text-muted-foreground")}>
          {account.accountType || "Checking"}
        </span>
      </div>
      <p className={cn("text-xs mb-1", isPrimary ? "text-white/60" : "text-muted-foreground")}>
        Available balance
      </p>
      <p className={cn("text-3xl font-bold mb-3", isPrimary ? "text-white" : "text-foreground")}>
        {formatCurrency(account.balance, account.currency)}
      </p>
      <p className={cn("text-sm font-mono", isPrimary ? "text-white/70" : "text-muted-foreground")}>
        {maskAccount(account.accountNumber)}
      </p>
    </button>
  );
};
