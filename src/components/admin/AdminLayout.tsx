import { ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Package2, LayoutDashboard, Package, Users, FileText, LogOut, Plus, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/shipments", label: "Shipments", icon: Package, end: false },
  { to: "/admin/users", label: "Users", icon: Users, superOnly: true, end: false },
  { to: "/admin/logs", label: "Activity Logs", icon: FileText, superOnly: true, end: false },
];

const NavItem = ({ to, label, icon: Icon, active }: { to: string; label: string; icon: typeof Package; active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { profile, signOut, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (to: string, end: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
            <Package2 className="h-4 w-4" />
          </span>
          <span className="font-semibold">Cloud Shipment</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems
            .filter((i) => !i.superOnly || isSuperAdmin)
            .map((i) => (
              <NavItem key={i.to} to={i.to} label={i.label} icon={i.icon} active={isActive(i.to, i.end)} />
            ))}
          <div className="my-3 h-px bg-sidebar-border" />
          <NavItem to="/" label="Public site" icon={Home} active={false} />
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 px-2 text-xs">
            <p className="font-medium text-sidebar-foreground">{profile?.display_name ?? profile?.email}</p>
            <p className="text-sidebar-foreground/60">
              {isSuperAdmin ? "Super Admin · ∞ credits" : `${profile?.credits ?? 0} credits`}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div className="md:hidden">
            <span className="font-semibold">Cloud Shipment</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="gap-2">
              <Link to="/admin/shipments/new"><Plus className="h-4 w-4" />New shipment</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
