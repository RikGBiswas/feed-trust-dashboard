import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Database, LayoutDashboard, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-feed", label: "Add Feed", icon: PlusCircle },
] as const;

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const now = useNow();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-header text-header-foreground border-b border-header/40">
        <div className="px-8 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="h-11 w-11 rounded-lg bg-header-foreground/10 ring-1 ring-header-foreground/20 flex items-center justify-center">
                <Database className="h-6 w-6" />
              </div>
              <div className="leading-tight">
                <div className="text-2xl font-extrabold tracking-tight">CoAction</div>
                <div className="text-sm text-header-foreground/70 font-semibold tracking-wide">DataTrust</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1.5">
              {nav.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-md text-base font-medium transition-colors ${
                      active
                        ? "bg-header-foreground/15 text-header-foreground"
                        : "text-header-foreground/75 hover:text-header-foreground hover:bg-header-foreground/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="hidden md:block text-center flex-1">
            <div className="text-lg font-bold tracking-tight">Feed Inventory Dashboard — Growth Protocol</div>
            <div className="text-sm text-header-foreground/70">Centralized inventory of all data feeds provisioned to Growth Protocol (GP).</div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:block text-sm text-header-foreground/80 tabular-nums font-medium">
              {now
                ? now.toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
            <button
              type="button"
              className="relative h-10 w-10 rounded-md hover:bg-header-foreground/10 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-warning" />
            </button>
            <div className="h-10 w-10 rounded-full bg-header-foreground/15 ring-1 ring-header-foreground/25 flex items-center justify-center text-sm font-semibold">
              JS
            </div>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex-1 text-center px-3 py-1.5 rounded-md text-xs ${
                  active
                    ? "bg-header-foreground/15"
                    : "text-header-foreground/75 hover:bg-header-foreground/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card">
        <div className="px-6 py-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} CoAction DataTrust</span>
          <span>v1.0.0 · Internal use only</span>
        </div>
      </footer>
    </div>
  );
}
