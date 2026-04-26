import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { Check, FileCheck2, X } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AdminCardRequests = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "card-requests"],
    queryFn: cardRequestsApi.list,
  });

  const approve = useMutation({
    mutationFn: (id) => cardRequestsApi.approve({cardRequestId: Number(id), isApproved: 1}),
    onSuccess: () => {
      toast.success("Card request approved");
      qc.invalidateQueries({ queryKey: ["admin", "card-requests"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const reject = useMutation({
    mutationFn: (id) => cardRequestsApi.reject({cardRequestId: Number(id), isApproved: 2}),
    onSuccess: () => {
      toast.success("Card request rejected");
      qc.invalidateQueries({ queryKey: ["admin", "card-requests"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div>
      <PageHeader
        title="Card requests"
        subtitle="Review and approve card applications"
      />
      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<FileCheck2 className="h-6 w-6" />}
            title="No card requests"
            description="New customer card requests will appear here."
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
                  <p className="font-medium truncate">{r.cardType === 0 ? "Debit" : r.cardType === 1 ? "Credit" : "Card"} card request</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(r.createdAt)} · #{String(r.id).slice(0, 8)}
                  </p>
                  {r.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{r.reason}</p>
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

export default AdminCardRequests;