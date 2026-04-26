import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cardsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, FileText } from "lucide-react";
import { CardSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { maskAccount } from "@/lib/format";
import { useAuth } from "../context/AuthContext";

const Cards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["cards"], queryFn: cardsApi.myCards });

  return (
    <div>
      <PageHeader
        title="Your cards"
        subtitle="Manage debit and credit cards"
        action={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => navigate("/cards/requests")}>
              <FileText className="h-4 w-4" /> My requests
            </Button>
            <Button className="rounded-xl" onClick={() => navigate("/cards/request")}>
              <Plus className="h-4 w-4" /> Request card
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<CreditCard className="h-6 w-6" />}
            title="No cards yet"
            description="Request your first card to start spending."
            action={<Button className="rounded-xl" onClick={() => navigate("/cards/request")}><Plus className="h-4 w-4" /> Request card</Button>}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data.map((c) => (
            <div key={c.id} className="surface-dark rounded-3xl p-6 shadow-elevated aspect-[1.6/1] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider text-white/60">{c.cardType  === 0 ? "Debit" : "Credit"}</span>
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-mono text-lg tracking-widest">{"**** **** " + c.last4Digits}</p>
                <div className="flex justify-between items-end mt-3 text-xs text-white/70">
                  <span>{user.firstName} {user.lastName}</span>
                  <span>{c.expiryDate || "•• / ••"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;


