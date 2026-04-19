import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi, usersApi } from "@/lib/endpoints";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { extractError } from "@/lib/api";
import { initials } from "@/lib/format";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhoneNumber(user?.phoneNumber ?? "");
  }, [user]);

  const update = useMutation({
    mutationFn: () => usersApi.update(user!.id, { firstName, lastName, phoneNumber }),
    onSuccess: async () => {
      toast.success("Profile updated");
      await refreshUser();
    },
    onError: (e) => toast.error(extractError(e)),
  });

  const remove = useMutation({
    mutationFn: () => authApi.deleteUser(user!.id),
    onSuccess: () => {
      toast.success("Account deleted");
      logout();
      navigate("/login", { replace: true });
    },
    onError: (e) => toast.error(extractError(e)),
  });

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your account" />

      <div className="bg-card border border-border rounded-3xl p-6 shadow-card flex items-center gap-4 mb-5">
        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
          {initials(`${firstName} ${lastName}`.trim() || user?.fullName, user?.email)}
        </div>
        <div>
          <p className="font-semibold">{`${firstName} ${lastName}`.trim() || user?.email}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (user?.id) update.mutate(); }}
        className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-card"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <Button type="submit" className="rounded-xl" disabled={update.isPending}>
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
        </Button>
      </form>

      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="rounded-xl" onClick={() => { logout(); navigate("/login"); }}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" /> Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>This permanently removes your account and data. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => user?.id && remove.mutate()}
                className="rounded-xl bg-destructive hover:bg-destructive/90"
              >
                {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Profile;
