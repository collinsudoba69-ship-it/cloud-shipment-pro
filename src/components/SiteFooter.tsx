import { Link } from "react-router-dom";
import { Package2 } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-border/60 bg-secondary/40">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Package2 className="h-4 w-4" />
            </span>
            Cloud Shipment
          </Link>
          <p className="text-sm text-muted-foreground">
            Global logistics, made transparent. Track every package from origin to doorstep.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Air Freight</li>
            <li>Sea Freight</li>
            <li>Express Delivery</li>
            <li>Warehousing</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/track" className="hover:text-foreground">Track Shipment</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Staff Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Cloud Shipment. All rights reserved.</p>
        <p>Logistics platform · v1.0</p>
      </div>
    </div>
  </footer>
);
