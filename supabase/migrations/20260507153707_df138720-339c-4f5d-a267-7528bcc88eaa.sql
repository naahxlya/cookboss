
-- Recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  prep_time INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'Easy',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  steps TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Anyone can read recipes
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT USING (true);

-- Authenticated users can insert recipes (must set their own user_id)
CREATE POLICY "Authenticated users can create recipes"
  ON public.recipes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Owners can update their recipes
CREATE POLICY "Users can update their own recipes"
  ON public.recipes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Owners can delete their recipes
CREATE POLICY "Users can delete their own recipes"
  ON public.recipes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_set_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed 6 sample recipes (no user_id => public seed data)
INSERT INTO public.recipes (name, category, prep_time, difficulty, ingredients, steps, image_url) VALUES
('Chocolate Cake', 'Dessert', 60, 'Medium',
  ARRAY['2 cups flour','2 cups sugar','3/4 cup cocoa powder','2 eggs','1 cup milk','1/2 cup vegetable oil','2 tsp baking powder','1 tsp vanilla'],
  ARRAY['Preheat oven to 175°C (350°F).','Mix dry ingredients in a large bowl.','Add eggs, milk, oil, and vanilla. Beat for 2 minutes.','Pour into greased pan and bake for 35 minutes.','Cool, frost, and serve.'],
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'),
('Lasagna', 'Main Course', 90, 'Hard',
  ARRAY['12 lasagna noodles','500g ground beef','2 cups marinara sauce','2 cups ricotta','3 cups mozzarella','1/2 cup parmesan','2 cloves garlic','Italian seasoning'],
  ARRAY['Boil noodles until al dente.','Brown beef with garlic, add marinara.','Layer noodles, meat sauce, ricotta, mozzarella in baking dish.','Repeat layers and top with parmesan.','Bake at 190°C for 45 minutes.'],
  'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800'),
('Caesar Salad', 'Salad', 15, 'Easy',
  ARRAY['1 head romaine lettuce','1/2 cup croutons','1/4 cup parmesan','1/4 cup Caesar dressing','1 lemon','Black pepper'],
  ARRAY['Wash and chop romaine.','Toss with dressing and lemon juice.','Top with croutons and parmesan.','Season with black pepper and serve.'],
  'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800'),
('Pancakes', 'Breakfast', 20, 'Easy',
  ARRAY['1.5 cups flour','3.5 tsp baking powder','1 tsp salt','1 tbsp sugar','1.25 cups milk','1 egg','3 tbsp melted butter'],
  ARRAY['Whisk dry ingredients.','Add milk, egg and butter; mix until smooth.','Heat a non-stick pan, pour 1/4 cup of batter.','Cook until bubbles form, flip and cook 1 minute more.','Serve with maple syrup.'],
  'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800'),
('Omelette', 'Breakfast', 10, 'Easy',
  ARRAY['3 eggs','2 tbsp milk','Salt and pepper','1 tbsp butter','1/4 cup shredded cheese','Chopped herbs'],
  ARRAY['Beat eggs with milk, salt and pepper.','Melt butter in pan over medium heat.','Pour eggs, swirl to cover pan.','Sprinkle cheese, fold in half when set.','Garnish with herbs.'],
  'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=800'),
('Brownies', 'Dessert', 45, 'Medium',
  ARRAY['1 cup butter','2 cups sugar','4 eggs','1 cup cocoa','1 cup flour','1 tsp vanilla','1/2 tsp salt','1 cup chocolate chips'],
  ARRAY['Preheat oven to 175°C.','Melt butter, mix with sugar.','Add eggs and vanilla.','Stir in cocoa, flour, salt and chips.','Pour into pan, bake 30 minutes.'],
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800');
