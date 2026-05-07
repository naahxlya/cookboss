import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Recipe = Tables<"recipes">;
export type NewRecipe = TablesInsert<"recipes">;
export type UpdateRecipe = TablesUpdate<"recipes">;

export const recipesApi = {
  // GET /recipes
  async getAll(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  // GET /recipes/:id
  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  // POST /recipes
  async create(recipe: Omit<NewRecipe, "user_id">): Promise<Recipe> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("You must be signed in to create a recipe.");
    const { data, error } = await supabase
      .from("recipes")
      .insert({ ...recipe, user_id: userData.user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // PUT /recipes/:id
  async update(id: string, patch: UpdateRecipe): Promise<Recipe> {
    const { data, error } = await supabase
      .from("recipes")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // DELETE /recipes/:id
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) throw error;
  },
};
