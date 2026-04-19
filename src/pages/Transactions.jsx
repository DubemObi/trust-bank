import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { TransactionRow } from "@/components/TransactionRow";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { Receipt } from "lucide-react";

const Transactions = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["transactions"], queryFn: transactionsApi.list });

  return (
    <div>
      <PageHeader title="Transactions" subtitle="Your full transaction history" />
      <div className="surface-dark rounded-3xl p-5 sm:p-6 shadow-elevated">
        {isLoading ? (
          <ListSkeleton rows={6} />
        ) : error ? (
          <p className="text-center text-white/70 py-8">
            Failed to load. <button onClick={() => refetch()} className="underline">Retry</button>
          </p>
        ) : !data || data.length === 0 ? (
          <div className="py-8">
            <EmptyState icon={<Receipt className="h-6 w-6" />} title="No transactions yet" description="Once you start transacting, history shows up here." />
          </div>
        ) : (
          <div className="space-y-1">
            {data.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onClick={() => navigate(`/transactions/${tx.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
