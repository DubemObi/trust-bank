import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency, maskAccount } from "@/lib/format";
import { Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AdminAccounts = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: accountsApi.list,
  });

  const remove = useMutation({
    mutationFn: (id) => accountsApi.remove(id),
    onSuccess: () => {
      toast.success("Account deleted");
      qc.invalidateQueries({ queryKey: ["admin", "accounts"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div>
      <PageHeader title="All accounts" subtitle="Every bank account in the system" />
      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="No accounts" />
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((a) => (
            <div
              key={a.accountId}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4 shadow-card"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {a.accountType || "Account"} · {maskAccount(a.accountNumber)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Owner: {a.accountName ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{formatCurrency(a.accountBalance, a.currency)}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete account {maskAccount(a.accountNumber)}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(a.accountId)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;