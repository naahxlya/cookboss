import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  recipeId,
  size = "md",
}: {
  recipeId: string;
  size?: "sm" | "md" | "lg";
}) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(recipeId);
  const dim = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(recipeId);
      }}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "grid place-items-center rounded-full border bg-card/90 backdrop-blur transition",
        "hover:scale-110 active:scale-95",
        dim,
        fav ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-primary"
      )}
    >
      <Heart className={cn(icon, fav && "fill-primary")} />
    </button>
  );
}
