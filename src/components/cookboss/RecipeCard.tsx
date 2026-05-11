import { Link } from "@tanstack/react-router";
import { Clock, Flame } from "lucide-react";
import type { Recipe } from "@/services/recipesApi";
import { FavoriteButton } from "./FavoriteButton";
import { Badge } from "@/components/ui/badge";

const difficultyColor: Record<string, string> = {
  Easy: "bg-herb/20 text-herb-foreground",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$id"
      params={{ id: recipe.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">No image</div>
        )}
        <div className="absolute right-3 top-3">
          <FavoriteButton recipeId={recipe.id} />
        </div>
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-card/90 text-foreground backdrop-blur">
            {recipe.category}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl font-semibold leading-tight">{recipe.name}</h3>
        <div className="mt-auto flex items-center gap-3 pt-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> {recipe.prep_time} min
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              difficultyColor[recipe.difficulty] ?? "bg-muted"
            }`}
          >
            <Flame className="h-3 w-3" /> {recipe.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}
