import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDailyReviews, getPoolStats } from "@/lib/testimonials";
import { getReviewStrings } from "@/lib/locales/reviews";

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

export const Testimonials = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const { reviews, stats, strings } = useMemo(() => {
    return {
      reviews: getDailyReviews(lang, 24),
      stats: getPoolStats(lang),
      strings: getReviewStrings(lang),
    };
  }, [lang]);

  const isRTL = lang.startsWith("ar");

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
          {reviews.map((r, idx) => (
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
                    {strings.todayLabels[idx % strings.todayLabels.length]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          {strings.footer}{" "}
          <span className="text-primary font-medium">{strings.trackCta}</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
