import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, transactionsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";
import { formatCurrency, maskAccount } from "@/lib/format";

const Transfer = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const accountsQ = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.list });
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const fromAcc = accountsQ.data?.find((a) => a.id === from);

  const mutation = useMutation({
    mutationFn: () =>
      transactionsApi.transfer({
        fromAccountId: from,
        toAccountId: to,
        amount: Number(amount),
        description,
      }),
    onSuccess: () => {
      toast.success("Transfer complete");
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      navigate("/transactions");
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) return toast.error("Pick both accounts");
    if (from === to) return toast.error("Accounts must be different");
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter a valid amount");
    if (fromAcc && n > (fromAcc.balance ?? 0)) return toast.error("Insufficient funds");
    mutation.mutate();
  };

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Transfer" subtitle="Move money between accounts" />
      <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border rounded-3xl p-6 shadow-card">
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue placeholder="Source account" /></SelectTrigger>
            <SelectContent>
              {accountsQ.data?.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {maskAccount(a.accountNumber)} — {formatCurrency(a.balance, a.currency)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center -my-2">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>To (account ID or number)</Label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter destination account ID" />
          <p className="text-xs text-muted-foreground">
            Or pick one of yours:
          </p>
          <div className="flex flex-wrap gap-2">
            {accountsQ.data?.filter((a) => a.id !== from).map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => setTo(a.id)}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
              >
                {maskAccount(a.accountNumber)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {fromAcc && <p className="text-xs text-muted-foreground">Available: {formatCurrency(fromAcc.balance, fromAcc.currency)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Note (optional)</Label>
          <Input id="desc" maxLength={140} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send transfer"}
        </Button>
      </form>
    </div>
  );
};

export default Transfer;
