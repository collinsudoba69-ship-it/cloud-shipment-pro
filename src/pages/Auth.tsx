import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Package2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { z } from "zod";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/admin";
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ev = emailSchema.safeParse(loginEmail);
    const pv = passwordSchema.safeParse(loginPassword);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ev.data, password: pv.data });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate(from, { replace: true });
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
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>Sign in to manage shipments and tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="li-email">Email</Label>
                <Input id="li-email" type="email" autoComplete="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="li-password">Password</Label>
                <Input id="li-password" type="password" autoComplete="current-password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <Button className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                New accounts are temporarily disabled. Contact the administrator for access.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
