import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, transactionsApi } from "@/lib/endpoints";
import { AccountCard } from "@/components/AccountCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Trash2, Loader2 } from "lucide-react";
import { TransactionRow } from "@/components/TransactionRow";
import { ListSkeleton, CardSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AccountDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const accountQ = useQuery({ queryKey: ["account", id], queryFn: () => accountsApi.get(id), enabled: !!id });
  const txQ = useQuery({ queryKey: ["transactions"], queryFn: transactionsApi.myTransactions });

  const remove = useMutation({
    mutationFn: () => accountsApi.remove(id),
    onSuccess: () => {
      toast.success("Account deleted");
      qc.invalidateQueries({ queryKey: ["accounts"] });
      navigate("/accounts");
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const txs = (txQ.data ?? []).filter(
  (t) => t.accountId === Number(id) || t.recipientAccountId === Number(id)
);

  return (
    <div className="space-y-5 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {accountQ.isLoading ? (
        <CardSkeleton />
      ) : accountQ.data ? (
        <AccountCard account={accountQ.data} variant="primary" />
      ) : (
        <p className="text-muted-foreground">Account not found.</p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate(`/deposit?account=${id}`)}>
          <ArrowDownLeft className="h-4 w-4 mb-1" /><span className="text-xs">Deposit</span>
        </Button>
        <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate(`/withdraw?account=${id}`)}>
          <ArrowUpRight className="h-4 w-4 mb-1" /><span className="text-xs">Withdraw</span>
        </Button>
        <Button variant="secondary" className="h-auto flex-col py-4 rounded-2xl" onClick={() => navigate(`/transfer?from=${id}`)}>
          <ArrowLeftRight className="h-4 w-4 mb-1" /><span className="text-xs">Transfer</span>
        </Button>
      </div>

      <div className="surface-dark rounded-3xl p-5 sm:p-6 shadow-elevated">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        {txQ.isLoading ? (
          <ListSkeleton />
        ) : txs.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-8">No transactions on this account yet.</p>
        ) : (
          <div className="space-y-1">
            {txs.map((t) => (
              <TransactionRow key={t.transactionId} tx={t} currentAccountId={id} onClick={() => navigate(`/transactions/${t.transactionId}`)} />
            ))}
          </div>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
            <Trash2 className="h-4 w-4" /> Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this account?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove.mutate()} className="rounded-xl bg-destructive hover:bg-destructive/90">
              {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountDetail;
