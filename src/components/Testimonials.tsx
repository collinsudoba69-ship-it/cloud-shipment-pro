import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
  date: string;
}

const REVIEWS: Review[] = [
  { name: "Sarah Mitchell", role: "Small Business Owner", location: "New York, USA", rating: 5, initials: "SM", date: "2 days ago",
    text: "Cloud Shipment has completely transformed how I run my e-commerce store. Tracking is real-time and my customers always know where their packages are. Couldn't ask for better!" },
  { name: "James O'Connor", role: "Frequent Sender", location: "Dublin, Ireland", rating: 5, initials: "JO", date: "5 days ago",
    text: "I ship internationally every week. The pricing is fair, the live map is incredible, and packages arrive on time, every time. Truly a game-changer." },
  { name: "Aisha Bello", role: "Online Retailer", location: "Lagos, Nigeria", rating: 5, initials: "AB", date: "1 week ago",
    text: "Customer support is on another level. They responded to my email within minutes and resolved my concern instantly. 10/10 service!" },
  { name: "Liam Chen", role: "Importer", location: "Vancouver, Canada", rating: 5, initials: "LC", date: "1 week ago",
    text: "Express delivery was faster than promised. The tracking notifications kept me updated every step of the way. Highly recommended." },
  { name: "Maria González", role: "Boutique Owner", location: "Madrid, Spain", rating: 5, initials: "MG", date: "2 weeks ago",
    text: "Beautifully designed platform. The live transit map gives me so much peace of mind. My fragile items always arrive in perfect condition." },
  { name: "David Thompson", role: "Logistics Manager", location: "London, UK", rating: 5, initials: "DT", date: "2 weeks ago",
    text: "We've switched our entire fulfillment operation to Cloud Shipment. Reliable, transparent and incredibly easy to use. Worth every penny." },
  { name: "Fatima Al-Hassan", role: "Online Seller", location: "Dubai, UAE", rating: 5, initials: "FA", date: "3 weeks ago",
    text: "The receipt and invoice feature is so professional. My buyers love how transparent everything is. Cloud Shipment makes me look great!" },
  { name: "Kwame Asante", role: "Exporter", location: "Accra, Ghana", rating: 5, initials: "KA", date: "3 weeks ago",
    text: "Finally a courier service that takes Africa seriously. Smooth process, accurate delivery dates, and very responsive team." },
  { name: "Emily Carter", role: "Etsy Seller", location: "Austin, USA", rating: 5, initials: "EC", date: "1 month ago",
    text: "The dark mode and language options are a nice touch. But what really matters is delivery — and Cloud Shipment nails it." },
  { name: "Hiroshi Tanaka", role: "Importer", location: "Tokyo, Japan", rating: 5, initials: "HT", date: "1 month ago",
    text: "Very professional service. Documentation, tracking and delivery are all handled with great attention to detail. Arigatou!" },
  { name: "Sophie Laurent", role: "Fashion Designer", location: "Paris, France", rating: 5, initials: "SL", date: "1 month ago",
    text: "I send delicate fabric samples worldwide. Cloud Shipment handles fragile packages with so much care. My go-to courier now." },
  { name: "Carlos Ramírez", role: "Wholesaler", location: "Mexico City, MX", rating: 5, initials: "CR", date: "1 month ago",
    text: "Amazing tracking system. The animated live updates make me feel in control of every shipment I send. Excellent platform!" },
  { name: "Priya Sharma", role: "Small Business Owner", location: "Mumbai, India", rating: 5, initials: "PS", date: "1 month ago",
    text: "Affordable, fast and trustworthy. I've recommended Cloud Shipment to all my friends in the export business." },
  { name: "Ahmed Khalil", role: "Frequent Buyer", location: "Cairo, Egypt", rating: 4, initials: "AK", date: "2 months ago",
    text: "Great experience overall. Tracking updates are very accurate and the support team is friendly. Will definitely use again." },
  { name: "Olivia Brown", role: "Antique Dealer", location: "Sydney, Australia", rating: 5, initials: "OB", date: "2 months ago",
    text: "I ship valuable antiques internationally. The fragile-handling option and detailed tracking give me complete confidence." },
  { name: "Pierre Dubois", role: "Wine Exporter", location: "Bordeaux, France", rating: 5, initials: "PD", date: "2 months ago",
    text: "Reliable temperature-sensitive shipping. Cloud Shipment's process is smooth from booking to delivery. Magnifique!" },
  { name: "Grace Mwangi", role: "Beauty Brand Founder", location: "Nairobi, Kenya", rating: 5, initials: "GM", date: "2 months ago",
    text: "The cleanest tracking interface I've ever used. My customers comment on it every time. Cloud Shipment has elevated my brand." },
  { name: "Marcus Schmidt", role: "Tech Reseller", location: "Berlin, Germany", rating: 5, initials: "MS", date: "3 months ago",
    text: "Sehr gut! The platform is multilingual, fast and secure. Shipping electronics has never been easier." },
  { name: "Isabella Rossi", role: "Artist", location: "Rome, Italy", rating: 5, initials: "IR", date: "3 months ago",
    text: "I send original paintings worldwide. Cloud Shipment treats every package like it's their own. Bellissimo service!" },
  { name: "Benjamin Park", role: "Frequent Sender", location: "Seoul, South Korea", rating: 5, initials: "BP", date: "3 months ago",
    text: "Real-time notifications, beautiful UI, and lightning-fast delivery. This is what modern shipping should look like." },
  { name: "Chloe Williams", role: "Subscription Box Owner", location: "Toronto, Canada", rating: 5, initials: "CW", date: "3 months ago",
    text: "Bulk shipping made easy. The admin dashboard is intuitive and my customers love the polished tracking page." },
  { name: "Tunde Adebayo", role: "Importer", location: "Abuja, Nigeria", rating: 5, initials: "TA", date: "4 months ago",
    text: "Honestly the most reliable courier I've ever used. Even during peak season, deliveries arrived on schedule." },
  { name: "Natalia Petrova", role: "Crafts Seller", location: "Moscow, Russia", rating: 5, initials: "NP", date: "4 months ago",
    text: "Spasibo Cloud Shipment! Easy to use, transparent pricing, and packages always arrive safely. Highly recommended." },
  { name: "Lucas Almeida", role: "Coffee Exporter", location: "São Paulo, Brazil", rating: 5, initials: "LA", date: "4 months ago",
    text: "Obrigado! Shipping coffee beans worldwide is now stress-free. The tracking detail is unmatched in the industry." },
];

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
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4 fill-current" />
            Trusted Worldwide
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Stars rating={5} />
            <span className="text-2xl font-bold">{avgRating}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
          <p className="text-muted-foreground">
            Based on <span className="font-semibold text-foreground">{REVIEWS.length.toLocaleString()}+</span> verified customer reviews
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, idx) => (
            <Card
              key={idx}
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
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{r.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Join thousands of happy senders worldwide. <span className="text-primary font-medium">Track your shipment above ↑</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
