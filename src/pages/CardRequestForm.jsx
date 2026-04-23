import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, cardRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";
import { maskAccount } from "@/lib/format";

const CardRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const accountsQ = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.myAccounts });
  const [accountId, setAccountId] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: () => cardRequestsApi.create({ userId: user.id, cardType: cardType === "Debit" ? 0 : 1, cardBrand: cardBrand === "Visa" ? 0 : 1, accountId }),
    onSuccess: () => {
      toast.success("Card request submitted");
      qc.invalidateQueries({ queryKey: ["card-requests"] });
      navigate("/cards/requests");
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Request a card" subtitle="Pick an account and card type" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!accountId) return toast.error("Pick an account");
          if (!cardType) return toast.error("Pick a card type");
          if (!cardBrand) return toast.error("Pick a card brand");
          mutation.mutate();
        }}
        className="space-y-5 bg-card border border-border rounded-3xl p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label>Account</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger><SelectValue placeholder="Linked account" /></SelectTrigger>
            <SelectContent>
              {accountsQ.data?.map((a) => (
                <SelectItem key={a.accountId} value={a.accountId}>{maskAccount(a.accountNumber)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Card type</Label>
          <Select value={cardType} onValueChange={setCardType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Debit">Debit</SelectItem>
              <SelectItem value="Credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Card Brand</Label>
          <Select value={cardBrand} onValueChange={setCardBrand}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Visa">Visa</SelectItem>
              <SelectItem value="Mastercard">Mastercard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Reason (optional)</Label>
          <Input maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit request"}
        </Button>
      </form>
    </div>
  );
};

export default CardRequestForm;
