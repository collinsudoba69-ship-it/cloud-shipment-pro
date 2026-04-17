import { Link } from "react-router-dom";
import { Package2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { user, isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-md">
            <Package2 className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">Cloud Shipment</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
          <Link to="/track" className="text-sm font-medium text-muted-foreground hover:text-foreground">Track</Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm">
              <Link to={isAdmin ? "/admin" : "/"}>{isAdmin ? "Dashboard" : "Account"}</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">Staff Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
