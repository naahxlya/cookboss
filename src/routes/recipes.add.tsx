import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/cookboss/Layout";
import { RecipeForm } from "@/components/cookboss/RecipeForm";
import { recipesApi } from "@/services/recipesApi";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/recipes/add")({
  head: () => ({ meta: [{ title: "Add a recipe — CookBoss" }] }),
  component: AddRecipe,
});

function AddRecipe() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) return <Layout><div className="p-16" /></Layout>;
  if (!signedIn) {
    return (
      <Layout>
        <div className="mx-auto max-w-md p-16 text-center">
          <h1 className="font-display text-3xl font-bold">Sign in to add recipes</h1>
          <p className="mt-2 text-muted-foreground">You need an account to publish recipes to CookBoss.</p>
          <Button asChild className="mt-6"><Link to="/auth">Sign in or create an account</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl font-bold">Add a recipe</h1>
        <p className="mt-1 text-muted-foreground">Share your dish with the CookBoss community.</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <RecipeForm
            submitLabel="Publish recipe"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const r = await recipesApi.create(values);
                toast.success("Recipe published!");
                navigate({ to: "/recipes/$id", params: { id: r.id } });
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Could not save");
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
