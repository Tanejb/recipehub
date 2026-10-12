-- RecipeHub – shema baze
-- Zaženi enkrat v Supabase: SQL Editor -> New query -> prilepi -> Run.
-- Skripta je idempotentna: ob ponovnem zagonu najprej pobriše obstoječe objekte.

drop view if exists public.recipes_with_rating;
drop table if exists public.shopping_items, public.favorites, public.ratings, public.recipes, public.categories cascade;
drop type if exists public.difficulty;

-- ---------------------------------------------------------------------------
-- Tabele
-- ---------------------------------------------------------------------------

create type public.difficulty as enum ('lahka', 'srednja', 'zahtevna');

create table public.categories (
  id          smallint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  sort_order  smallint not null default 0
);

create table public.recipes (
  id                bigint generated always as identity primary key,
  slug              text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title             text not null check (char_length(title) between 3 and 120),
  description       text not null default '' check (char_length(description) <= 600),
  category_id       smallint not null references public.categories (id),
  prep_minutes      int not null check (prep_minutes between 1 and 1440),
  difficulty        public.difficulty not null,
  servings          int not null check (servings between 1 and 50),
  image_url         text,
  -- [{ "name": "moka", "amount": 200, "unit": "g" }, ...]; amount je lahko null (npr. "sol po okusu")
  ingredients       jsonb not null default '[]' check (jsonb_typeof(ingredients) = 'array'),
  steps             text[] not null default '{}',
  -- začetne ocene, da seznam ob prvem obisku ni prazen (prave ocene so v tabeli ratings)
  base_rating_count int not null default 0,
  base_rating_sum   int not null default 0,
  is_seed           boolean not null default false,
  author_id         uuid default auth.uid() references auth.users (id) on delete cascade,
  created_at        timestamptz not null default now(),
  -- iskanje po imenu ali sestavini, brez šumnikov in velikih črk (č->c, š->s, ž->z)
  search_text       text generated always as (
    translate(
      lower(title || ' ' || jsonb_path_query_array(ingredients, '$[*].name')::text),
      'čšžćđ', 'cszcd'
    )
  ) stored
);

create index recipes_category_idx on public.recipes (category_id);

create table public.ratings (
  recipe_id  bigint not null references public.recipes (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  stars      smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create table public.favorites (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_id  bigint not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table public.shopping_items (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_id  bigint references public.recipes (id) on delete set null,
  name       text not null check (char_length(name) between 1 and 120),
  amount     numeric,
  unit       text not null default '',
  checked    boolean not null default false,
  created_at timestamptz not null default now()
);

create index shopping_items_user_idx on public.shopping_items (user_id);

-- Recepti skupaj s kategorijo in povprečno oceno (začetne + prave ocene).
create view public.recipes_with_rating with (security_invoker = true) as
select
  r.*,
  c.slug as category_slug,
  c.name as category_name,
  (r.base_rating_count + count(rt.stars))::int as rating_count,
  round(
    (r.base_rating_sum + coalesce(sum(rt.stars), 0))::numeric
      / nullif(r.base_rating_count + count(rt.stars), 0),
    1
  ) as rating_avg
from public.recipes r
join public.categories c on c.id = r.category_id
left join public.ratings rt on rt.recipe_id = r.id
group by r.id, c.id;

-- ---------------------------------------------------------------------------
-- Pravice in varnostna pravila (RLS)
-- Obiskovalci so anonimni Supabase uporabniki (vloga "authenticated", brez registracije).
-- ---------------------------------------------------------------------------

alter table public.categories     enable row level security;
alter table public.recipes        enable row level security;
alter table public.ratings        enable row level security;
alter table public.favorites      enable row level security;
alter table public.shopping_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.recipes, public.ratings, public.recipes_with_rating to anon, authenticated;
grant insert, update, delete on public.recipes to authenticated;
grant insert, update, delete on public.ratings to authenticated;
grant select, insert, update, delete on public.favorites, public.shopping_items to authenticated;

-- Kategorije: vsi berejo, nihče ne piše (razen prek SQL Editorja).
create policy "kategorije berejo vsi" on public.categories
  for select using (true);

-- Recepti: vsi berejo; obiskovalec doda/ureja/briše samo svoje, nikoli začetnih.
create policy "recepte berejo vsi" on public.recipes
  for select using (true);
create policy "obiskovalec doda svoj recept" on public.recipes
  for insert to authenticated
  with check (author_id = auth.uid() and not is_seed and base_rating_count = 0 and base_rating_sum = 0);
create policy "obiskovalec ureja svoj recept" on public.recipes
  for update to authenticated
  using (author_id = auth.uid() and not is_seed)
  with check (author_id = auth.uid() and not is_seed and base_rating_count = 0 and base_rating_sum = 0);
create policy "obiskovalec izbriše svoj recept" on public.recipes
  for delete to authenticated
  using (author_id = auth.uid() and not is_seed);

-- Ocene: vsi berejo (za povprečje); vsak upravlja samo svojo.
create policy "ocene berejo vsi" on public.ratings
  for select using (true);
create policy "obiskovalec doda svojo oceno" on public.ratings
  for insert to authenticated with check (user_id = auth.uid());
create policy "obiskovalec spremeni svojo oceno" on public.ratings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "obiskovalec izbriše svojo oceno" on public.ratings
  for delete to authenticated using (user_id = auth.uid());

-- Priljubljeni in nakupovalni seznam: popolnoma zasebni.
create policy "samo svoji priljubljeni" on public.favorites
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "samo svoj nakupovalni seznam" on public.shopping_items
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
