import { useQuery } from "@tanstack/react-query";
import { cardRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import { FileText } from "lucide-react";

const CardRequests = () => {
  const { data, isLoading } = useQuery({ queryKey: ["card-requests"], queryFn: cardRequestsApi.myRequests });

  return (
    <div>
      <PageHeader title="Card requests" subtitle="Status of your card applications" />
      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState icon={<FileText className="h-6 w-6" />} title="No card requests" description="Submit a card request to see its status here." />
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-card">
              <div>
                <p className="font-medium">{r.cardType === 0 ? "Debit" : r.cardType === 1 ? "Credit" : "Card"} card request</p>
                <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
              </div>
              <StatusBadge status={r.status === 0 ? "Pending" : r.status === 1 ? "Approved" : "Rejected"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardRequests;
