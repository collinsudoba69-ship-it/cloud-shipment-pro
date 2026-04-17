import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

interface Props {
  variant?: "ghost" | "outline" | "secondary";
  invert?: boolean;
}

export const LanguageSwitcher = ({ variant = "ghost", invert = false }: Props) => {
  const { i18n } = useTranslation();
  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ??
    LANGUAGES.find((l) => l.code === i18n.language.split("-")[0]) ??
    LANGUAGES[0];

  useEffect(() => {
    document.documentElement.dir = i18n.language.startsWith("ar") ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={invert ? "gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : "gap-2"}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current.flag} {current.label}</span>
          <span className="sm:hidden">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LANGUAGES.map((lng) => (
          <DropdownMenuItem
            key={lng.code}
            onClick={() => i18n.changeLanguage(lng.code)}
            className={lng.code === current.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lng.flag}</span>
            {lng.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
