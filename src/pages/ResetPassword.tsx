import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { z } from "zod";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // When the user clicks the recovery link, Supabase establishes a recovery session.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    // Also check existing session in case the event already fired.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pv = passwordSchema.safeParse(password);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pv.data });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-md">
            <Package2 className="h-5 w-5" />
          </span>
          <span className="text-xl">Cloud Shipment</span>
        </Link>
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Set a new password</CardTitle>
            <CardDescription>
              {ready
                ? "Choose a new password for your account."
                : "Verifying your reset link..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ready ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="rp-password">New password</Label>
                  <Input
                    id="rp-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
                <div>
                  <Label htmlFor="rp-confirm">Confirm new password</Label>
                  <Input
                    id="rp-confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
