import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { BadgeCheck, Check, X } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AdminLoanRequests = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "loan-requests"],
    queryFn: loanRequestsApi.list,
  });

  const approve = useMutation({
    mutationFn: (id) => loanRequestsApi.approve({ loanRequestId: Number(id), isApproved: 1 }),
    onSuccess: () => {
      toast.success("Loan request approved");
      qc.invalidateQueries({ queryKey: ["admin", "loan-requests"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const reject = useMutation({
    mutationFn: (id) => loanRequestsApi.reject({ loanRequestId: Number(id), isApproved: 2 }),
    onSuccess: () => {
      toast.success("Loan request rejected");
      qc.invalidateQueries({ queryKey: ["admin", "loan-requests"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div>
      <PageHeader title="Loan requests" subtitle="Review and approve loan applications" />
      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<BadgeCheck className="h-6 w-6" />}
            title="No loan requests"
            description="New loan applications will appear here."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => {
            const pending = (r.status || "") === 0 || !r.status;
            return (
              <div
                key={r.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-card"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {formatCurrency(r.principalAmount)} · {r.durationInMonths ?? "—"} months
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(r.createdAt)} · #{String(r.id).slice(0, 8)}
                  </p>
                  {r.purpose && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">{r.purpose}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status === 0 ? "Pending" : r.status === 1 ? "Approved" : "Rejected"} />
                  {pending && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reject.mutate(r.id)}
                        disabled={reject.isPending || approve.isPending}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approve.mutate(r.id)}
                        disabled={reject.isPending || approve.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminLoanRequests;