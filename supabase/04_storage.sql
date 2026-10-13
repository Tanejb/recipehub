-- RecipeHub – shramba za fotografije receptov, ki jih dodajo obiskovalci.
-- Zaženi enkrat v Supabase: SQL Editor -> New query -> prilepi -> Run.
--
-- Bucket je javen (slike so vidne vsem), nalaga pa lahko le (anonimni) obiskovalec,
-- in to samo v svojo mapo: <id obiskovalca>/<ime>.webp. Brisati sme le svoje slike.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-images', 'recipe-images', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "slike receptov berejo vsi" on storage.objects;
drop policy if exists "obiskovalec naloži sliko v svojo mapo" on storage.objects;
drop policy if exists "obiskovalec izbriše svojo sliko" on storage.objects;

create policy "slike receptov berejo vsi" on storage.objects
  for select using (bucket_id = 'recipe-images');

create policy "obiskovalec naloži sliko v svojo mapo" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "obiskovalec izbriše svojo sliko" on storage.objects
  for delete to authenticated
  using (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = auth.uid()::text);
