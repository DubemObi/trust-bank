import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AdminRoles = () => {
  const qc = useQueryClient();
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["admin", "roles"], queryFn: rolesApi.list });

  const create = useMutation({
    mutationFn: () => rolesApi.create(name.trim() ),
    onSuccess: () => {
      toast.success("Role created");
      setName("");
      qc.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const remove = useMutation({
    mutationFn: (id) => rolesApi.remove(id),
    onSuccess: () => {
      toast.success("Role deleted");
      qc.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div>
      <PageHeader title="Roles" subtitle="Create and manage application roles" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate();
        }}
        className="bg-card border border-border rounded-2xl p-4 mb-6 flex gap-2 shadow-card"
      >
        <Input
          placeholder="New role name (e.g. Manager)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={!name.trim() || create.isPending}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </form>

      {isLoading ? (
        <ListSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState icon={<ShieldCheck className="h-6 w-6" />} title="No roles yet" />
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="font-medium">{r.name}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete role "{r.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Users currently assigned to this role may lose access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remove.mutate(r.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRoles;