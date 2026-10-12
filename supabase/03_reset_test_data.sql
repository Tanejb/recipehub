-- RecipeHub – ponastavitev pred testiranjem z uporabniki.
-- Pobriše vse, kar so ustvarili obiskovalci (ocene, priljubljene, nakupovalne sezname,
-- dodane recepte in anonimne uporabnike). Začetni recepti ostanejo nespremenjeni.

delete from public.recipes where not is_seed;
delete from public.ratings;
delete from public.favorites;
delete from public.shopping_items;
delete from auth.users where is_anonymous;
