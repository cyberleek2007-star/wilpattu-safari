-- Wilpattu Admin rebuild. Does NOT alter the public website UI.
-- Keep the existing safari_bookings and traveller_stories data.

create table if not exists public.safari_videos(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_url text not null,
  status text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz not null default now()
);

alter table public.safari_videos enable row level security;

drop policy if exists "Public can read published safari videos" on public.safari_videos;
create policy "Public can read published safari videos"
on public.safari_videos for select to anon, authenticated
using (status='published');

drop policy if exists "Admins can manage safari videos" on public.safari_videos;
create policy "Admins can manage safari videos"
on public.safari_videos for all to authenticated
using (exists(select 1 from public.admin_users au where au.user_id=auth.uid() and au.role='admin'))
with check (exists(select 1 from public.admin_users au where au.user_id=auth.uid() and au.role='admin'));

insert into storage.buckets(id,name,public) values('safari-videos','safari-videos',true)
on conflict(id) do update set public=true;

drop policy if exists "Public can view safari videos" on storage.objects;
create policy "Public can view safari videos" on storage.objects for select to anon, authenticated
using(bucket_id='safari-videos');

drop policy if exists "Admins can manage safari video files" on storage.objects;
create policy "Admins can manage safari video files" on storage.objects for all to authenticated
using(bucket_id='safari-videos' and exists(select 1 from public.admin_users au where au.user_id=auth.uid() and au.role='admin'))
with check(bucket_id='safari-videos' and exists(select 1 from public.admin_users au where au.user_id=auth.uid() and au.role='admin'));

-- Rebuild only the admin authorization table/policy. Existing Auth users are untouched.
alter table public.admin_users enable row level security;
drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record" on public.admin_users for select to authenticated using(user_id=auth.uid());

drop policy if exists "Admins can manage admin records" on public.admin_users;
create policy "Admins can manage admin records" on public.admin_users for all to authenticated
using(exists(select 1 from public.admin_users x where x.user_id=auth.uid() and x.role='admin'))
with check(exists(select 1 from public.admin_users x where x.user_id=auth.uid() and x.role='admin'));
