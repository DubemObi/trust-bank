import { useQuery } from "@tanstack/react-query";
import { loanRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { FileText } from "lucide-react";

const LoanRequests = () => {
  const { data, isLoading } = useQuery({ queryKey: ["loan-requests"], queryFn: loanRequestsApi.list });

  return (
    <div>
      <PageHeader title="Loan applications" subtitle="Track your loan requests" />
      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState icon={<FileText className="h-6 w-6" />} title="No applications yet" description="Apply for a loan to see status here." />
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-card">
              <div>
                <p className="font-medium">{formatCurrency(r.amount)} · {r.termMonths ?? "—"} mo</p>
                <p className="text-xs text-muted-foreground">{r.purpose || "No purpose specified"} · {formatDate(r.createdAt)}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanRequests;
