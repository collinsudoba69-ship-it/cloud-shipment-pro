import { useMemo } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getDailyReviews, POOL_AVG_RATING, POOL_SIZE } from "@/lib/testimonials";

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

const RELATIVE_DATES = [
  "Today","Yesterday","2 days ago","3 days ago","4 days ago","5 days ago","6 days ago",
  "1 week ago","1 week ago","2 weeks ago","2 weeks ago","3 weeks ago","1 month ago",
];

export const Testimonials = () => {
  const { reviews, totalReviews, avgRating } = useMemo(() => {
    const reviews = getDailyReviews(24);
    return {
      reviews,
      totalReviews: POOL_SIZE,
      avgRating: POOL_AVG_RATING,
    };
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4 fill-current" />
            Trusted Worldwide · Updated Daily
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Stars rating={5} />
            <span className="text-2xl font-bold">{avgRating}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
          <p className="text-muted-foreground">
            Based on{" "}
            <span className="font-semibold text-foreground">
              {totalReviews.toLocaleString()}+
            </span>{" "}
            verified customer reviews
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
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
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
                    {RELATIVE_DATES[idx % RELATIVE_DATES.length]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          New reviews surface every day.{" "}
          <span className="text-primary font-medium">Track your shipment above ↑</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
