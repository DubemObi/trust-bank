import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, rolesApi, usersApi } from "@/lib/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { initials } from "@/lib/format";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { extractError } from "@/lib/api";

const AdminUsers = () => {
  const qc = useQueryClient();
  const [assignFor, setAssignFor] = useState({});

  const usersQ = useQuery({ queryKey: ["admin", "users"], queryFn: usersApi.list });
  const rolesQ = useQuery({ queryKey: ["admin", "roles"], queryFn: rolesApi.list });

  const remove = useMutation({
    mutationFn: (email) => authApi.deleteUser(email), 
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const assign = useMutation({
    mutationFn: ({ userId, roleName }) =>
      rolesApi.assign({ userId, roleName }),
    onSuccess: () => {
      toast.success("Role assigned");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const users = usersQ.data ?? [];
  const roles = rolesQ.data ?? [];

  return (
    <div>
      <PageHeader title="Users" subtitle="All registered users" />
      {usersQ.isLoading ? (
        <ListSkeleton />
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card">
          <EmptyState icon={<Users className="h-6 w-6" />} title="No users yet" />
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-card"
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold shrink-0">
                {initials(u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(), u.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                {u.roles && u.roles.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Roles: {u.roles.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={assignFor[u.id] ?? ""}
                  onValueChange={(v) => setAssignFor((s) => ({ ...s, [u.id]: v }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assign role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!assignFor[u.id] || assign.isPending}
                  onClick={() =>
                    assign.mutate({ userId: u.id, roleName: assignFor[u.id] })
                  }
                >
                  Assign
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes {u.email} and their data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(u.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;