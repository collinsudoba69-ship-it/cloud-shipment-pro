import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { Infinity as InfIcon, Plus, Minus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

interface UserRow {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  credits: number;
  unlimited_credits: boolean;
  roles: string[];
}

const Users = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjust, setAdjust] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const merged: UserRow[] = (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateCredits = async (row: UserRow, delta: number) => {
    if (row.unlimited_credits) return toast.info("This user has unlimited credits.");
    if (!delta) return;
    const newAmount = Math.max(0, row.credits + delta);
    const { error } = await supabase.from("profiles").update({ credits: newAmount }).eq("user_id", row.user_id);
    if (error) return toast.error(error.message);
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id, actor_email: user.email, action: "adjust_credits",
        entity_type: "profile", entity_id: row.user_id,
        details: { from: row.credits, to: newAmount, delta },
      });
    }
    toast.success(`Credits ${delta > 0 ? "added" : "removed"}: ${Math.abs(delta).toLocaleString()}`);
    load();
  };

  const setRole = async (row: UserRow, role: "admin" | "staff", grant: boolean) => {
    if (grant) {
      await supabase.from("user_roles").insert({ user_id: row.user_id, role });
    } else {
      await supabase.from("user_roles").delete().eq("user_id", row.user_id).eq("role", role);
    }
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id, actor_email: user.email,
        action: grant ? "grant_role" : "revoke_role", entity_type: "user_role",
        entity_id: row.user_id, details: { role },
      });
    }
    load();
  };

  const deleteUser = async (row: UserRow) => {
    setDeletingId(row.user_id);
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { user_id: row.user_id },
    });
    setDeletingId(null);
    if (error || (data && data.error)) {
      return toast.error(error?.message || data?.error || "Failed to delete user");
    }
    toast.success(`Deleted ${row.email}`);
    load();
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold">Users & roles</h1>
        <p className="text-muted-foreground">Manage staff access, credits, and accounts. 1,000 credits = $1 USD · 2,000 credits per shipment.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All users</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3 text-right">Adjust credits</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r) => {
                    const isSuper = r.roles.includes("super_admin");
                    return (
                      <tr key={r.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{r.display_name ?? r.email.split("@")[0]}</p>
                          <p className="text-xs text-muted-foreground">{r.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {r.roles.map((role) => <Badge key={role} variant={role === "super_admin" ? "default" : "secondary"}>{role}</Badge>)}
                          </div>
                          {!isSuper && (
                            <div className="mt-2 flex gap-1">
                              {r.roles.includes("admin") ? (
                                <Button size="sm" variant="outline" onClick={() => setRole(r, "admin", false)}>Revoke admin</Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => setRole(r, "admin", true)}>Make admin</Button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.unlimited_credits ? (
                            <Badge className="gap-1 border-0 bg-primary/10 text-primary"><InfIcon className="h-3 w-3" />Unlimited</Badge>
                          ) : (
                            <span className="font-medium">{r.credits.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!r.unlimited_credits && (
                            <div className="inline-flex items-center gap-1">
                              <Input
                                type="number"
                                min="0"
                                step="100"
                                className="w-24"
                                placeholder="e.g. 2000"
                                value={adjust[r.user_id] ?? ""}
                                onChange={(e) => setAdjust({ ...adjust, [r.user_id]: e.target.value })}
                              />
                              <Button size="icon" variant="outline" title="Add credits" onClick={() => { updateCredits(r, Number(adjust[r.user_id] || 0)); setAdjust({ ...adjust, [r.user_id]: "" }); }}><Plus className="h-4 w-4" /></Button>
                              <Button size="icon" variant="outline" title="Remove credits" onClick={() => { updateCredits(r, -Number(adjust[r.user_id] || 0)); setAdjust({ ...adjust, [r.user_id]: "" }); }}><Minus className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!isSuper && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  disabled={deletingId === r.user_id}
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This permanently deletes <span className="font-semibold">{r.email}</span> from your website, including their account, profile, and roles. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => deleteUser(r)}
                                  >
                                    Delete user
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
