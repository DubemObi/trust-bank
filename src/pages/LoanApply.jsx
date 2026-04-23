import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, loanRequestsApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { extractError } from "@/lib/api";
import { maskAccount } from "@/lib/format";

const LoanApply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
    const accountsQ = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.myAccounts });
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [termMonths, setTermMonths] = useState("12");
  const [purpose, setPurpose] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      loanRequestsApi.create({ principalAmount: Number(amount), userId: user.id, bankAccountId: accountId, durationInMonths: Number(termMonths), purpose }),
    onSuccess: () => {
      toast.success("Loan application submitted");
      qc.invalidateQueries({ queryKey: ["loan-requests"] });
      navigate("/loans/requests");
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Apply for a loan" subtitle="Tell us how much you need" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const a = Number(amount);
          const t = Number(termMonths);
          if (!a || a <= 0) return toast.error("Enter a valid amount");
          if (!t || t <= 0) return toast.error("Enter a valid term");
          mutation.mutate();
        }}
        className="space-y-5 bg-card border border-border rounded-3xl p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
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
          <Label htmlFor="term">Term (months)</Label>
          <Input id="term" type="number" min="1" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea id="purpose" rows={4} maxLength={500} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit application"}
        </Button>
      </form>
    </div>
  );
};

export default LoanApply;
