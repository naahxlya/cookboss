import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/cookboss/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { recipesApi } from "@/services/recipesApi";
import { RecipeCard } from "@/components/cookboss/RecipeCard";
import { LoadingSpinner } from "@/components/cookboss/LoadingSpinner";
import { CATEGORIES, DIFFICULTIES } from "@/components/cookboss/RecipeForm";

type Search = { category?: string; difficulty?: string; q?: string; sort?: string };

export const Route = createFileRoute("/recipes/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    difficulty: typeof s.difficulty === "string" ? s.difficulty : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All recipes — CookBoss" },
      { name: "description", content: "Search and filter the full CookBoss recipe collection." },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["recipes"], queryFn: recipesApi.getAll });

  const [q, setQ] = useState(search.q ?? "");
  const category = search.category ?? "all";
  const difficulty = search.difficulty ?? "all";
  const sort = search.sort ?? "newest";

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (difficulty !== "all") list = list.filter((r) => r.difficulty === difficulty);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(t));
    }
    list = [...list].sort((a, b) => {
      if (sort === "time") return a.prep_time - b.prep_time;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [data, category, difficulty, q, sort]);

  const setParam = (patch: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold md:text-5xl">All recipes</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} recipe${filtered.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search recipes..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={(v) => setParam({ category: v === "all" ? undefined : v })}>
            <SelectTrigger className="md:w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={(v) => setParam({ difficulty: v === "all" ? undefined : v })}>
            <SelectTrigger className="md:w-[140px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any difficulty</SelectItem>
              {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setParam({ sort: v })}>
            <SelectTrigger className="md:w-[150px]">
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="time">Prep time</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-2xl">No recipes match your filters</p>
            <p className="mt-2 text-muted-foreground">Try clearing some filters or add a new recipe.</p>
            <Button asChild className="mt-4">
              <Link to="/recipes/add">Add a recipe</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
