import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Database, LayoutDashboard, PlusCircle, ArrowLeftRight, Plug } from "lucide-react";

const nav = [
  { to: "/", label: "Feed Inventory", icon: LayoutDashboard },
  { to: "/data-integrations", label: "Data Integrations", icon: ArrowLeftRight },
  { to: "/api-library", label: "API Library", icon: Plug },
  { to: "/add-feed", label: "Add Feed", icon: PlusCircle },
] as const;

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left Sidebar ─────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 bg-header text-header-foreground flex flex-col border-r border-header/40">
        <div className="px-5 py-5 border-b border-header-foreground/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-header-foreground/10 ring-1 ring-header-foreground/20 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight">CoAction</div>
              <div className="text-xs text-header-foreground/70 font-semibold tracking-wide">DataTrust</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-header-foreground/15 text-header-foreground"
                    : "text-header-foreground/70 hover:text-header-foreground hover:bg-header-foreground/10"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-3 border-t border-header-foreground/10 text-xs text-header-foreground/50">
          © {new Date().getFullYear()} CoAction DataTrust
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
