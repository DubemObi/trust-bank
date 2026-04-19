import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CardSkeleton } from "@/components/Skeletons";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const TransactionDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["transaction", id], queryFn: () => transactionsApi.get(id), enabled: !!id });

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 rounded-xl">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      {isLoading ? (
        <CardSkeleton />
      ) : !data ? (
        <p className="text-muted-foreground">Transaction not found.</p>
      ) : (
        <div className="surface-dark rounded-3xl p-6 shadow-elevated">
          <p className="text-white/60 text-xs uppercase">{data.type}</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(data.amount)}</p>
          <p className="text-white/70 text-sm mt-1">{formatDate(data.createdAt)}</p>
          <div className="mt-6 space-y-3 text-sm">
            {data.description && (
              <Row label="Description" value={data.description} />
            )}
            {data.fromAccountId && <Row label="From" value={data.fromAccountId} mono />}
            {data.toAccountId && <Row label="To" value={data.toAccountId} mono />}
            {data.accountId && !data.fromAccountId && !data.toAccountId && (
              <Row label="Account" value={data.accountId} mono />
            )}
            <Row label="Reference" value={data.id} mono />
            {data.status && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Status</span>
                <StatusBadge status={data.status} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex justify-between gap-4">
    <span className="text-white/60">{label}</span>
    <span className={mono ? "font-mono text-xs truncate" : "text-right"}>{value}</span>
  </div>
);

export default TransactionDetail;
