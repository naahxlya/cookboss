import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/cookboss/Layout";
import { LoadingSpinner } from "@/components/cookboss/LoadingSpinner";
import { RecipeForm } from "@/components/cookboss/RecipeForm";
import { recipesApi } from "@/services/recipesApi";

export const Route = createFileRoute("/recipes/$id/edit")({
  component: EditRecipe,
});

function EditRecipe() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipesApi.getById(id),
  });
  const [loading, setLoading] = useState(false);

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (!recipe) return <Layout><div className="p-16 text-center">Recipe not found.</div></Layout>;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold">Edit recipe</h1>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <RecipeForm
            initial={recipe}
            submitLabel="Save changes"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await recipesApi.update(recipe.id, values);
                toast.success("Recipe updated");
                navigate({ to: "/recipes/$id", params: { id: recipe.id } });
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Could not update");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      </section>
    </Layout>
  );
}
