import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/i18n";
import logo from "@/assets/cloud-shipment-logo.png";

export const SiteFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <img src={logo} alt="Cloud Shipment" className="h-9 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("services.air")}</li>
              <li>{t("services.sea")}</li>
              <li>{t("services.express")}</li>
              <li>{t("services.warehousing")}</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.support")}</h4>
            <p className="mb-2 text-sm text-muted-foreground">{t("footer.supportDesc")}</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Cloud%20Shipment%20support%20request`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/track" className="hover:text-foreground">{t("footer.trackShipment")}</Link></li>
              <li><Link to="/auth" className="hover:text-foreground">{t("footer.staffPortal")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">{t("footer.privacy")}</a></li>
              <li><a href="#" className="hover:text-foreground">{t("footer.terms")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Cloud Shipment. {t("footer.rights")}</p>
          <p>{t("home.footerVersion")}</p>
        </div>
      </div>
    </footer>
  );
};
