import { ArrowDownLeft, ArrowUpRight, Repeat } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";



export const TransactionRow = ({ tx, currentAccountId, onClick }) => {
  const typeStr = String(tx.type || "").toLowerCase();
  const isCredit =
    typeStr.includes("deposit") ||
    typeStr === "credit" ||
    (tx.toAccountId && currentAccountId && tx.toAccountId === currentAccountId);

  const isTransfer = typeStr.includes("transfer");
  const Icon = isTransfer ? Repeat : isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors text-left"
    >
      <div
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
          isCredit ? "bg-success/20 text-success" : "bg-white/10 text-surface-dark-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{tx.description || tx.type}</p>
        <p className="text-xs text-white/60">{formatDate(tx.createdAt)}</p>
      </div>
      <div
        className={cn(
          "text-sm font-semibold whitespace-nowrap",
          isCredit ? "text-success" : "text-surface-dark-foreground",
        )}
      >
        {isCredit ? "+" : "-"}
        {formatCurrency(Math.abs(tx.amount))}
      </div>
    </button>
  );
};
