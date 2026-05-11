create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text,
  avatar_url text,
  progress jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = id);

create policy "Profiles are insertable by owner" on profiles
  for insert with check (auth.uid() = id);

create policy "Profiles are updatable by owner" on profiles
  for update using (auth.uid() = id);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null,
  message text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  page text not null,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "Feedback insert for signed-in users" on feedback
  for insert with check (auth.uid() = user_id);

create policy "Feedback view for owner" on feedback
  for select using (auth.uid() = user_id);
