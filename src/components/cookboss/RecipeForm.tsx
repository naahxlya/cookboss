import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe } from "@/services/recipesApi";

export type RecipeFormValues = {
  name: string;
  category: string;
  prep_time: number;
  difficulty: string;
  ingredients: string[];
  steps: string[];
  image_url: string | null;
};

export const CATEGORIES = ["Breakfast", "Main Course", "Dessert", "Salad", "Snack", "Drink"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export function RecipeForm({
  initial,
  submitLabel,
  onSubmit,
  loading,
}: {
  initial?: Recipe | null;
  submitLabel: string;
  onSubmit: (values: RecipeFormValues) => Promise<void> | void;
  loading?: boolean;
}) {
  const [values, setValues] = useState<RecipeFormValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "Main Course",
    prep_time: initial?.prep_time ?? 30,
    difficulty: initial?.difficulty ?? "Easy",
    ingredients: initial?.ingredients ?? [""],
    steps: initial?.steps ?? [""],
    image_url: initial?.image_url ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof RecipeFormValues>(k: K, v: RecipeFormValues[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (values.name.length > 120) e.name = "Name too long";
    if (values.prep_time < 1 || values.prep_time > 1000) e.prep_time = "1–1000 minutes";
    const ing = values.ingredients.map((s) => s.trim()).filter(Boolean);
    if (ing.length === 0) e.ingredients = "Add at least one ingredient";
    const steps = values.steps.map((s) => s.trim()).filter(Boolean);
    if (steps.length === 0) e.steps = "Add at least one step";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...values,
      ingredients: values.ingredients.map((s) => s.trim()).filter(Boolean),
      steps: values.steps.map((s) => s.trim()).filter(Boolean),
      image_url: values.image_url?.trim() || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Recipe name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Spaghetti Carbonara"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={values.image_url ?? ""}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label>Category</Label>
          <Select value={values.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="time">Prep time (min)</Label>
          <Input
            id="time"
            type="number"
            min={1}
            value={values.prep_time}
            onChange={(e) => set("prep_time", Number(e.target.value))}
          />
          {errors.prep_time && <p className="mt-1 text-xs text-destructive">{errors.prep_time}</p>}
        </div>
        <div>
          <Label>Difficulty</Label>
          <Select value={values.difficulty} onValueChange={(v) => set("difficulty", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DynamicList
        label="Ingredients"
        items={values.ingredients}
        onChange={(items) => set("ingredients", items)}
        placeholder="e.g. 2 cups flour"
        error={errors.ingredients}
      />

      <DynamicList
        label="Preparation steps"
        items={values.steps}
        onChange={(items) => set("steps", items)}
        placeholder="Describe a step..."
        error={errors.steps}
        textarea
      />

      <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

function DynamicList({
  label, items, onChange, placeholder, error, textarea,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  error?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            {textarea ? (
              <Textarea
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                placeholder={`${i + 1}. ${placeholder}`}
                rows={2}
              />
            ) : (
              <Input
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                placeholder={placeholder}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              disabled={items.length === 1}
            >
              ×
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
          + Add {label.toLowerCase().slice(0, -1)}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
