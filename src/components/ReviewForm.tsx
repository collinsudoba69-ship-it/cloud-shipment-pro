import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getReviewUIStrings } from "@/lib/locales/reviewUI";

const schema = z.object({
  firstName: z.string().trim().min(2, "Enter your first name").max(30),
  lastInitial: z
    .string()
    .trim()
    .min(1, "Last name initial required")
    .max(1, "Just one letter, e.g. W")
    .regex(/^[A-Za-z]$/, "Use a single letter"),
  occupation: z.string().trim().min(2, "Enter your occupation").max(60),
  location: z
    .string()
    .trim()
    .min(2, "Enter City, Country")
    .max(80)
    .regex(/.+,.+/, "Format: City, Country"),
  text: z.string().trim().min(10, "Review must be at least 10 characters").max(600),
  rating: z.number().int().min(1).max(5),
});

interface Props {
  onSubmitted?: () => void;
  embedded?: boolean;
}

export const ReviewForm = ({ onSubmitted, embedded = false }: Props) => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const ui = getReviewUIStrings(i18n.language || "en");
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const getDeviceId = (): string => {
    try {
      const key = "cs_device_id";
      let id = localStorage.getItem(key);
      if (!id) {
        id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        localStorage.setItem(key, id);
      }
      return id;
    } catch {
      return `nostor-${Math.random().toString(36).slice(2)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ firstName, lastInitial, occupation, location, text, rating });
    if (!parsed.success) {
      toast({ title: "Please check your entry", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    // Block re-submission from same device same day
    try {
      const lastDay = localStorage.getItem("my_review_day");
      const todayUTC = new Date().toISOString().slice(0, 10);
      if (lastDay === todayUTC) {
        toast({
          title: "You've already reviewed today",
          description: "Only one review per device per day. Come back tomorrow.",
          variant: "destructive",
        });
        return;
      }
    } catch {}

    setSubmitting(true);
    const display_name = `${parsed.data.firstName} ${parsed.data.lastInitial.toUpperCase()}.`;
    const device_id = getDeviceId();
    const { data, error } = await supabase.from("user_reviews").insert({
      display_name,
      occupation: parsed.data.occupation,
      location: parsed.data.location,
      text: parsed.data.text,
      rating: parsed.data.rating,
      device_id,
    }).select("id").single();
    setSubmitting(false);
    if (error) {
      // Postgres unique violation = 23505
      const code = (error as { code?: string }).code;
      if (code === "23505") {
        const msg = error.message.includes("device")
          ? "This device has already posted a review today."
          : error.message.includes("name")
          ? "Someone has already posted a review under that name today. Try a different first name or initial."
          : "That exact review has already been posted today. Please write your own words.";
        toast({ title: "Duplicate review", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: "Could not post review", description: error.message, variant: "destructive" });
      return;
    }
    try {
      const key = "my_review_ids";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (data?.id) {
        existing.push(data.id);
        localStorage.setItem(key, JSON.stringify(existing));
      }
      localStorage.setItem("my_review_day", new Date().toISOString().slice(0, 10));
    } catch {}
    toast({ title: "Thanks for your review!", description: "It is now live on the homepage." });
    setFirstName(""); setLastInitial(""); setOccupation(""); setLocation(""); setText(""); setRating(5);
    onSubmitted?.();
  };


  const formBody = (
    <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px] gap-3">
            <Input
              placeholder={ui.firstNamePh}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={30}
            />
            <Input
              placeholder={ui.lastInitialPh}
              value={lastInitial}
              onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
              maxLength={1}
            />
          </div>
          <Input
            placeholder={ui.occupationPh}
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            maxLength={60}
          />
          <Input
            placeholder={ui.locationPh}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={80}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{ui.yourRating}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const v = i + 1;
                const filled = v <= (hover || rating);
                return (
                  <button
                    key={v}
                    type="button"
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(v)}
                    aria-label={`${v} star${v > 1 ? "s" : ""}`}
                  >
                    <Star className={`h-6 w-6 ${filled ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            placeholder={ui.experiencePh}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={600}
            rows={4}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? ui.posting : ui.postReview}
          </Button>
    </form>
  );

  if (embedded) {
    return <div className="p-4">{formBody}</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-12 border-border/50">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">{ui.shareTitle}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {ui.shareDesc}
        </p>
        {formBody}
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
