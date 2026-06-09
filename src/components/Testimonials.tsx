import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Star, Quote, Trash2, PenSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getDailyReviews, getPoolStats, type Review } from "@/lib/testimonials";
import { getReviewStrings } from "@/lib/locales/reviews";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReviewForm from "./ReviewForm";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
      />
    ))}
  </div>
);

interface UserReviewRow {
  id: string;
  display_name: string;
  occupation: string;
  location: string;
  rating: number;
  text: string;
  created_at: string;
}

function startOfTodayUTC(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

export const Testimonials = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const lang = i18n.language || "en";

  const { reviews, stats, strings } = useMemo(() => {
    return {
      reviews: getDailyReviews(lang, 24),
      stats: getPoolStats(lang),
      strings: getReviewStrings(lang),
    };
  }, [lang]);

  const [userReviews, setUserReviews] = useState<UserReviewRow[]>([]);
  const [ownIds, setOwnIds] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    try {
      setOwnIds(JSON.parse(localStorage.getItem("my_review_ids") || "[]"));
    } catch {
      setOwnIds([]);
    }
  }, []);

  const loadUserReviews = useCallback(async () => {
    const { data } = await supabase
      .from("user_reviews")
      .select("id, display_name, occupation, location, rating, text, created_at")
      .gte("created_at", startOfTodayUTC())
      .order("created_at", { ascending: false })
      .limit(24);
    if (data) setUserReviews(data as UserReviewRow[]);
    try {
      setOwnIds(JSON.parse(localStorage.getItem("my_review_ids") || "[]"));
    } catch {}
  }, []);

  useEffect(() => { loadUserReviews(); }, [loadUserReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete your review?")) return;
    const { error } = await supabase.from("user_reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    const next = ownIds.filter((x) => x !== id);
    setOwnIds(next);
    localStorage.setItem("my_review_ids", JSON.stringify(next));
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Review deleted" });
  };

  const isRTL = lang.startsWith("ar");

  type Item = Review & { ownerId?: string };

  const userAsReviews: Item[] = userReviews.map((r) => {
    const parts = r.display_name.trim().split(/\s+/);
    const initials = (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
    return {
      name: r.display_name,
      role: r.occupation,
      location: r.location,
      rating: r.rating,
      text: r.text,
      initials: initials.toUpperCase().slice(0, 2),
      ownerId: r.id,
    };
  });

  const seenText = new Set<string>();
  const combined: Item[] = [];
  for (const r of [...userAsReviews, ...reviews]) {
    if (seenText.has(r.text)) continue;
    seenText.add(r.text);
    combined.push(r);
    if (combined.length >= 24) break;
  }

  return (
    <section className="py-16 bg-muted/30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4 fill-current" />
            {strings.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{strings.heading}</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Stars rating={5} />
            <span className="text-2xl font-bold">{stats.avg}</span>
            <span className="text-muted-foreground">{strings.ratesOutOf}</span>
          </div>
          <p className="text-muted-foreground">
            {strings.basedOn(stats.size.toLocaleString())}
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {combined.map((r, idx) => {
            const isOwn = !!r.ownerId && ownIds.includes(r.ownerId);
            return (
            <Card
              key={`${r.name}-${idx}`}
              className="relative hover:shadow-lg transition-shadow duration-300 border-border/50"
            >
              <CardContent className="p-6">
                <Quote className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} h-8 w-8 text-primary/10`} />
                <Stars rating={r.rating} />
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  "{r.text}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {r.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.role} · {r.location}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {idx < userAsReviews.length
                      ? strings.todayLabels[0]
                      : strings.todayLabels[idx % strings.todayLabels.length]}
                  </span>
                </div>
                {isOwn && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(r.ownerId!)}
                    className="mt-3 h-8 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete my review
                  </Button>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Review form trigger */}
        <div className="mt-10 flex justify-center">
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-md">
                <PenSquare className="h-4 w-4" />
                Write a review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Share your experience</DialogTitle>
                <DialogDescription>
                  Your review appears live below and is refreshed the next day.
                </DialogDescription>
              </DialogHeader>
              <div className="px-2 pb-2">
                <ReviewForm
                  embedded
                  onSubmitted={() => {
                    setFormOpen(false);
                    loadUserReviews();
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trust footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          {strings.footer}{" "}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("tracking-input");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => (el as HTMLInputElement).focus(), 500);
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="text-primary font-medium hover:underline"
          >
            {strings.trackCta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
