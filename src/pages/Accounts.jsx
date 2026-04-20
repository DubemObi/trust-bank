import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/lib/endpoints";
import { AccountCard } from "@/components/AccountCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const Accounts = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: accounts, isLoading } = useQuery({ queryKey: ["accounts"], queryFn: accountsApi.list });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Checking");
  const [currency, setCurrency] = useState("USD");

  const create = useMutation({
    mutationFn: () => accountsApi.create({ accountType: type, currency }),
    onSuccess: () => {
      toast.success("Account created");
      qc.invalidateQueries({ queryKey: ["accounts"] });
      setOpen(false);
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div>
      <PageHeader
        title="Your accounts"
        subtitle="Manage all your bank accounts"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="h-4 w-4" /> New account</Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader><DialogTitle>Open a new account</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Account type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Checking">Checking</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => create.mutate()} disabled={create.isPending} className="w-full rounded-xl">
                  {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState
            icon={<Wallet className="h-6 w-6" />}
            title="No accounts yet"
            description="Open your first account to start banking with Trust Cash."
            action={<Button onClick={() => setOpen(true)} className="rounded-xl"><Plus className="h-4 w-4" /> Create account</Button>}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a, i) => (
            <AccountCard key={a.id} account={a} variant={i === 0 ? "primary" : "default"} onClick={() => navigate(`/accounts/${a.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
