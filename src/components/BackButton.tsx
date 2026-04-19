import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

/**
 * Resolve a sensible parent route for the current path.
 * Avoids history bouncing (navigate(-1) toggling A→B→A→B).
 */
const resolveParent = (pathname: string): string => {
  // Admin sub-routes
  if (pathname.startsWith("/admin/shipments/")) return "/admin/shipments";
  if (pathname.startsWith("/admin/users")) return "/admin";
  if (pathname.startsWith("/admin/logs")) return "/admin";
  if (pathname.startsWith("/admin/shipments")) return "/admin";
  if (pathname === "/admin" || pathname.startsWith("/admin")) return "/";

  // Public sub-routes
  if (pathname.startsWith("/track")) return "/";
  if (pathname.startsWith("/auth")) return "/";

  return "/";
};

const BackButton = ({ to, label = "Back", className }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const target = to ?? resolveParent(location.pathname);
    navigate(target);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn("gap-2 -ml-2 text-muted-foreground hover:text-foreground", className)}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
};

export default BackButton;
