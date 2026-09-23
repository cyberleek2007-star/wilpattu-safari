-- Wilpattu Safari — traveller stories / reviews / ratings / photos
create table if not exists public.traveller_stories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  comment text not null,
  photo_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.traveller_stories enable row level security;

-- Public visitors can submit stories, but they always enter moderation as pending.
drop policy if exists "Public can submit traveller stories" on public.traveller_stories;
create policy "Public can submit traveller stories"
on public.traveller_stories
for insert to anon, authenticated
with check (status = 'pending');

-- Public visitors can only see approved stories.
drop policy if exists "Public can read approved traveller stories" on public.traveller_stories;
create policy "Public can read approved traveller stories"
on public.traveller_stories
for select to anon, authenticated
using (status = 'approved');

-- Admins can manage every story.
drop policy if exists "Admins can read all traveller stories" on public.traveller_stories;
create policy "Admins can read all traveller stories"
on public.traveller_stories
for select to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'admin'));

drop policy if exists "Admins can update traveller stories" on public.traveller_stories;
create policy "Admins can update traveller stories"
on public.traveller_stories
for update to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'admin'))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'admin'));

drop policy if exists "Admins can delete traveller stories" on public.traveller_stories;
create policy "Admins can delete traveller stories"
on public.traveller_stories
for delete to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'admin'));

-- Public bucket for approved traveller photos. Files themselves are harmless public media;
-- moderation happens at the database row level.
insert into storage.buckets (id, name, public)
values ('traveller-stories', 'traveller-stories', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can upload traveller story photos" on storage.objects;
create policy "Public can upload traveller story photos"
on storage.objects
for insert to anon, authenticated
with check (bucket_id = 'traveller-stories' and (storage.foldername(name))[1] = 'pending');

drop policy if exists "Public can view traveller story photos" on storage.objects;
create policy "Public can view traveller story photos"
on storage.objects
for select to anon, authenticated
using (bucket_id = 'traveller-stories');

drop policy if exists "Admins can delete traveller story photos" on storage.objects;
create policy "Admins can delete traveller story photos"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'traveller-stories'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.role = 'admin')
);
