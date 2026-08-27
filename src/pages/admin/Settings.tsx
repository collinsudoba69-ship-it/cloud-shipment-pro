import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MessageCircle, Save, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const NOTIFICATION_KEYS = [
  { key: "notify_new_shipment_enabled", label: "New shipment created", description: "Email the receiver automatically when a shipment is created." },
  { key: "notify_status_update_enabled", label: "Shipment status changes", description: "Email the receiver automatically when a shipment's status is updated." },
  { key: "notify_payment_update_enabled", label: "Payment recorded", description: "Email the receiver automatically when a payment is added for their shipment." },
] as const;

const Settings = () => {
  const { user } = useAuth();
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({});
  const [notifLoading, setNotifLoading] = useState<Record<string, boolean>>({});

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

    supabase
      .from("app_settings")
      .select("key, value")
      .in("key", NOTIFICATION_KEYS.map((n) => n.key))
      .then(({ data }) => {
        const map: Record<string, boolean> = {};
        NOTIFICATION_KEYS.forEach((n) => { map[n.key] = true; }); // default ON if no row yet
        (data ?? []).forEach((row) => { map[row.key] = row.value === "true"; });
        setNotifSettings(map);
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

  const toggleNotification = async (key: string, next: boolean) => {
    setNotifLoading((prev) => ({ ...prev, [key]: true }));
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key, value: String(next), updated_by: user?.id ?? null }, { onConflict: "key" });
    setNotifLoading((prev) => ({ ...prev, [key]: false }));
    if (error) {
      return toast.error(error.message);
    }
    setNotifSettings((prev) => ({ ...prev, [key]: next }));
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id,
        actor_email: user.email,
        action: "update_setting",
        entity_type: "app_setting",
        entity_id: key,
        details: { value: next },
      });
    }
    toast.success(`${next ? "Enabled" : "Disabled"} notification`);
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Automatic Email Notifications
          </CardTitle>
          <CardDescription>
            Control which events automatically email your customers. Manually sending updates from the Shipments or Users page is unaffected by these toggles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {NOTIFICATION_KEYS.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{n.label}</p>
                <p className="text-sm text-muted-foreground">{n.description}</p>
              </div>
              <Switch
                checked={notifSettings[n.key] ?? true}
                disabled={notifLoading[n.key]}
                onCheckedChange={(checked) => toggleNotification(n.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
