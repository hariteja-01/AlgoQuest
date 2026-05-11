create extension if not exists "pgcrypto";

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null,
  message text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  page text not null,
  created_at timestamptz default now()
);

alter table public.feedback add column if not exists user_email text;
alter table public.feedback add column if not exists user_name text;

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'Admin'
  );
$$;

alter table public.feedback enable row level security;

create policy if not exists "Feedback insert for signed-in users" on public.feedback
  for insert with check (auth.uid() = user_id);

create policy if not exists "Feedback view for owner" on public.feedback
  for select using (auth.uid() = user_id);

create policy if not exists "Feedback view for admin" on public.feedback
  for select using (public.is_admin());

alter table public.profiles enable row level security;

create policy if not exists "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy if not exists "Profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

create policy if not exists "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

create policy if not exists "Profiles view for admin" on public.profiles
  for select using (public.is_admin());
