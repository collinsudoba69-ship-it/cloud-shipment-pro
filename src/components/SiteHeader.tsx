import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/cloud-shipment-logo.png";

export const SiteHeader = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src={logo} alt="Cloud Shipment" className="h-9 w-auto" />
          <span className="sr-only">Cloud Shipment</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">{t("nav.home")}</Link>
          <Link to="/track" className="text-sm font-medium text-muted-foreground hover:text-foreground">{t("nav.track")}</Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.dashboard")}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <Button asChild size="sm">
              <Link to={isAdmin ? "/admin" : "/"}>{isAdmin ? t("nav.dashboard") : t("nav.account")}</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">{t("nav.staffLogin")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
