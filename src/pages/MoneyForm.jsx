import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, transactionsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";
import { formatCurrency, maskAccount } from "@/lib/format";

interface Props {
  mode: "deposit" | "withdraw";
}

const MoneyForm = ({ mode }: Props) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const initial = params.get("account") || "";
  const accountsQ = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.list });
  const [accountId, setAccountId] = useState(initial);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const selected = accountsQ.data?.find((a) => a.id === accountId);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { accountId, amount: Number(amount), description };
      return mode === "deposit" ? transactionsApi.deposit(payload) : transactionsApi.withdraw(payload);
    },
    onSuccess: () => {
      toast.success(`${mode === "deposit" ? "Deposit" : "Withdrawal"} successful`);
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["account", accountId] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      navigate(`/accounts/${accountId}`);
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return toast.error("Pick an account");
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter a valid amount");
    if (mode === "withdraw" && selected && n > (selected.balance ?? 0))
      return toast.error("Insufficient funds");
    mutation.mutate();
  };

  const title = mode === "deposit" ? "Deposit" : "Withdraw";

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title={title} subtitle={mode === "deposit" ? "Add funds to your account" : "Take funds from your account"} />
      <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border rounded-3xl p-6 shadow-card">
        <div className="space-y-2">
          <Label>Account</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
            <SelectContent>
              {accountsQ.data?.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {maskAccount(a.accountNumber)} — {formatCurrency(a.balance, a.currency)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {selected && <p className="text-xs text-muted-foreground">Available: {formatCurrency(selected.balance, selected.currency)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input id="description" maxLength={140} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Confirm ${title}`}
        </Button>
      </form>
    </div>
  );
};

export default MoneyForm;
