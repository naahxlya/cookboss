import { ChefHat, Github, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold">CookBoss</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CookBoss. Cook with confidence.
        </p>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a aria-label="Twitter" href="#" className="hover:text-primary"><Twitter className="h-4 w-4" /></a>
          <a aria-label="Instagram" href="#" className="hover:text-primary"><Instagram className="h-4 w-4" /></a>
          <a aria-label="GitHub" href="#" className="hover:text-primary"><Github className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
