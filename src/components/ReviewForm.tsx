import { useState } from "react";
import { z } from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
}

export const ReviewForm = ({ onSubmitted }: Props) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ firstName, lastInitial, occupation, location, text, rating });
    if (!parsed.success) {
      toast({ title: "Please check your entry", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const display_name = `${parsed.data.firstName} ${parsed.data.lastInitial.toUpperCase()}.`;
    const { error } = await supabase.from("user_reviews").insert({
      display_name,
      occupation: parsed.data.occupation,
      location: parsed.data.location,
      text: parsed.data.text,
      rating: parsed.data.rating,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not post review", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Thanks for your review!", description: "It is now live on the homepage." });
    setFirstName(""); setLastInitial(""); setOccupation(""); setLocation(""); setText(""); setRating(5);
    onSubmitted?.();
  };

  return (
    <Card className="max-w-2xl mx-auto mt-12 border-border/50">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">Share your experience</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your review appears live below and is refreshed the next day.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px] gap-3">
            <Input
              placeholder="First name (e.g. David)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={30}
            />
            <Input
              placeholder="W"
              value={lastInitial}
              onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
              maxLength={1}
            />
          </div>
          <Input
            placeholder="Occupation (e.g. Boutique Owner)"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            maxLength={60}
          />
          <Input
            placeholder="City, Country (e.g. Lagos, Nigeria)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={80}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
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
            placeholder="Tell us about your experience…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={600}
            rows={4}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Posting…" : "Post review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
