import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Layout } from "@/components/cookboss/Layout";
import { LoadingSpinner } from "@/components/cookboss/LoadingSpinner";
import { RecipeCard } from "@/components/cookboss/RecipeCard";
import { recipesApi } from "@/services/recipesApi";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — CookBoss" }] }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useFavorites();
  const { data, isLoading } = useQuery({ queryKey: ["recipes"], queryFn: recipesApi.getAll });
  const list = (data ?? []).filter((r) => favorites.includes(r.id));

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-7 w-7 text-primary" />
          <h1 className="font-display text-4xl font-bold">Your favorites</h1>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-2xl">No favorites yet</p>
            <p className="mt-2 text-muted-foreground">
              Tap the heart on any recipe to save it here.
            </p>
            <Button asChild className="mt-4"><Link to="/recipes">Browse recipes</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
