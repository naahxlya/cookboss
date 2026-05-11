import { Link } from "@tanstack/react-router";
import { ChefHat, Heart, Home, PlusCircle, Utensils, Moon, Sun, LogIn, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/recipes", label: "Recipes", icon: Utensils },
  { to: "/recipes/add", label: "Add", icon: PlusCircle },
  { to: "/favorites", label: "Favorites", icon: Heart },
] as const;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">CookBoss</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "!bg-primary/10 !text-primary" }}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => supabase.auth.signOut()}
              className="hidden sm:inline-flex"
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">
                <LogIn className="mr-1.5 h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-around border-t border-border/60 px-2 py-1.5 md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "!text-primary" }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
