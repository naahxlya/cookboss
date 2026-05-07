import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChefHat, Clock, Sparkles, Utensils } from "lucide-react";
import { Layout } from "@/components/cookboss/Layout";
import { Button } from "@/components/ui/button";
import { recipesApi } from "@/services/recipesApi";
import { RecipeCard } from "@/components/cookboss/RecipeCard";
import { LoadingSpinner } from "@/components/cookboss/LoadingSpinner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CookBoss — Cook with confidence" },
      { name: "description", content: "Discover, create and save recipes you'll actually cook." },
    ],
  }),
  component: Home,
});

const CATEGORIES = [
  { name: "Breakfast", emoji: "🥞" },
  { name: "Main Course", emoji: "🍝" },
  { name: "Dessert", emoji: "🍰" },
  { name: "Salad", emoji: "🥗" },
  { name: "Snack", emoji: "🥨" },
  { name: "Drink", emoji: "🍹" },
];

function Home() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: recipesApi.getAll,
  });
  const featured = (recipes ?? []).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: "var(--gradient-soft)" }}
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Your kitchen, organized
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Cook like the <span className="text-primary">boss</span> of your kitchen.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Save recipes, plan meals, and discover dishes worth cooking again.
              CookBoss is your modern, no-nonsense recipe companion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/recipes">Browse recipes <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/recipes/add">Add your own</Link>
              </Button>
            </div>
            <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
              <Stat icon={Utensils} label={`${recipes?.length ?? "—"} recipes`} />
              <Stat icon={Clock} label="Quick to prep" />
              <Stat icon={ChefHat} label="Made by cooks" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem]" style={{ background: "var(--gradient-warm)" }} />
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000"
              alt="Beautiful plated dish"
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Browse by category</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to="/recipes"
              search={{ category: c.name } as never}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Featured recipes</h2>
          <Link to="/recipes" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div
          className="overflow-hidden rounded-3xl p-10 text-center shadow-card md:p-16"
          style={{ background: "var(--gradient-warm)" }}
        >
          <h2 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Got a recipe worth sharing?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Add it to your CookBoss collection in under a minute.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/recipes/add">Add a recipe</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ icon: Icon, label }: { icon: typeof Utensils; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-primary" /> {label}
    </span>
  );
}
