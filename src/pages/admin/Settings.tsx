import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageCircle, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const Settings = () => {
  const { user } = useAuth();
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "whatsapp_support_number")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setWhatsapp(data.value);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    const trimmed = whatsapp.trim();
    if (!/^\+?[\d\s-]{7,}$/.test(trimmed)) {
      return toast.error("Enter a valid phone number (e.g. +16833182000)");
    }
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "whatsapp_support_number", value: trimmed, updated_by: user?.id ?? null }, { onConflict: "key" });
    if (error) {
      setSaving(false);
      return toast.error(error.message);
    }
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id,
        actor_email: user.email,
        action: "update_setting",
        entity_type: "app_setting",
        entity_id: "whatsapp_support_number",
        details: { value: trimmed },
      });
    }
    toast.success("WhatsApp support number updated");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage global app settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            WhatsApp Customer Support
          </CardTitle>
          <CardDescription>
            This number is shown in the footer. Clicking it opens WhatsApp with a prefilled message.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wa">Phone number (include country code)</Label>
            <Input
              id="wa"
              placeholder="+16833182000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button onClick={save} disabled={saving || loading} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
