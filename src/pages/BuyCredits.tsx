import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Coins, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SHIPMENT_CREDIT_COST, CREDITS_PER_USD } from "@/lib/credits";

const SUPPORT_EMAIL = "Cloudshipmentcontact@gmail.com";

const packs = [
  { credits: 2_000, usd: 2 },
  { credits: 10_000, usd: 10 },
  { credits: 50_000, usd: 50 },
  { credits: 100_000, usd: 100 },
];

const BuyCredits = () => {
  const { user, profile } = useAuth();
  const [whatsapp, setWhatsapp] = useState<string>("+16833182000");

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "whatsapp_support_number")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setWhatsapp(data.value);
      });
  }, []);

  const buildMessage = (credits: number, usd: number) =>
    `Hello, I would like to purchase ${credits.toLocaleString()} credits ($${usd}) for my Cloud Shipment account${user?.email ? ` (${user.email})` : ""}.`;

  const waLink = (msg: string) =>
    `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  const mailLink = (msg: string) =>
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Buy Credits")}&body=${encodeURIComponent(msg)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Link
          to="/admin/shipments"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Coins className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Buy more credits</h1>
          <p className="mt-2 text-muted-foreground">
            {CREDITS_PER_USD.toLocaleString()} credits = $1 USD. Each shipment
            costs {SHIPMENT_CREDIT_COST.toLocaleString()} credits ($
            {SHIPMENT_CREDIT_COST / CREDITS_PER_USD}).
          </p>
          {profile && !profile.unlimited_credits && (
            <p className="mt-3 text-sm">
              Current balance:{" "}
              <span className="font-semibold">{profile.credits.toLocaleString()}</span>{" "}
              credits
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {packs.map((p) => {
            const msg = buildMessage(p.credits, p.usd);
            return (
              <Card key={p.credits}>
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between">
                    <span>{p.credits.toLocaleString()} credits</span>
                    <span className="text-primary">${p.usd}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enough for {Math.floor(p.credits / SHIPMENT_CREDIT_COST)}{" "}
                    shipment{p.credits / SHIPMENT_CREDIT_COST !== 1 ? "s" : ""}.
                  </p>
                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <Button
                      asChild
                      className="flex-1 bg-[#25D366] text-white hover:bg-[#1ebd5b]"
                    >
                      <a href={waLink(msg)} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <a href={mailLink(msg)}>
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Choose a pack above and contact us via WhatsApp or email.</p>
            <p>2. We confirm payment instructions ({CREDITS_PER_USD.toLocaleString()} credits per $1).</p>
            <p>3. Once paid, we top up your account with the exact amount of credits purchased.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyCredits;
