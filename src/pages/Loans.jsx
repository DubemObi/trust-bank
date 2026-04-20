import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { loansApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Landmark } from "lucide-react";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const Loans = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["loans"], queryFn: loansApi.list });

  return (
    <div>
      <PageHeader
        title="Loans"
        subtitle="Your active loans"
        action={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => navigate("/loans/requests")}>
              <FileText className="h-4 w-4" /> Applications
            </Button>
            <Button className="rounded-xl" onClick={() => navigate("/loans/apply")}>
              <Plus className="h-4 w-4" /> Apply
            </Button>
          </>
        }
      />

      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<Landmark className="h-6 w-6" />}
            title="No active loans"
            description="Apply for a loan to fund your goals."
            action={<Button className="rounded-xl" onClick={() => navigate("/loans/apply")}><Plus className="h-4 w-4" /> Apply for loan</Button>}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((l) => (
            <div key={l.id} className="bg-card border border-border rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Loan</span>
                <StatusBadge status={l.status} />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(l.amount)}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {l.interestRate != null && <Detail label="Rate" value={`${l.interestRate}%`} />}
                {l.termMonths != null && <Detail label="Term" value={`${l.termMonths} mo`} />}
                {l.remainingBalance != null && <Detail label="Remaining" value={formatCurrency(l.remainingBalance)} />}
                {l.startDate && <Detail label="Started" value={formatDate(l.startDate)} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Loans;
