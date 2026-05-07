import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Flame, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/cookboss/Layout";
import { LoadingSpinner } from "@/components/cookboss/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recipesApi } from "@/services/recipesApi";
import { FavoriteButton } from "@/components/cookboss/FavoriteButton";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/recipes/$id")({
  component: RecipeDetails,
});

function RecipeDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipesApi.getById(id),
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (!recipe)
    return (
      <Layout>
        <div className="mx-auto max-w-xl p-16 text-center">
          <h1 className="font-display text-4xl font-bold">Recipe not found</h1>
          <Button asChild className="mt-6"><Link to="/recipes">Back to recipes</Link></Button>
        </div>
      </Layout>
    );

  const isOwner = userId && recipe.user_id === userId;

  async function handleDelete() {
    if (!recipe) return;
    setDeleting(true);
    try {
      await recipesApi.remove(recipe.id);
      toast.success("Recipe deleted");
      navigate({ to: "/recipes" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/recipes"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link>
        </Button>

        <div className="overflow-hidden rounded-3xl shadow-card">
          {recipe.image_url && (
            <img src={recipe.image_url} alt={recipe.name} className="aspect-[16/9] w-full object-cover" />
          )}
        </div>

        <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">{recipe.category}</Badge>
            <h1 className="font-display text-4xl font-bold md:text-5xl">{recipe.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                <Clock className="h-4 w-4 text-primary" /> {recipe.prep_time} min
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                <Flame className="h-4 w-4 text-primary" /> {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton recipeId={recipe.id} size="lg" />
            {isOwner && (
              <>
                <Button asChild variant="outline">
                  <Link to="/recipes/$id/edit" params={{ id: recipe.id }}>
                    <Pencil className="mr-1.5 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="font-display text-2xl font-semibold">Ingredients</h2>
            <ul className="mt-4 space-y-2">
              {recipe.ingredients.map((it, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm">{it}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Preparation</h2>
            <ol className="mt-4 space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The recipe will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
