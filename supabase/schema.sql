-- Schema for DevLingo: English for Software Engineers
-- Run this in your Supabase SQL Editor

-- 1. Create table for user progress
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  xp integer default 0,
  streak integer default 1,
  current_level text default 'A1',
  completed_mission_ids text[] default '{}',
  saved_vocabulary jsonb default '[]'::jsonb,
  last_activity_date date default current_date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_progress unique (user_id)
);

-- 2. Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- Policies: users can only read and modify their own progress
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- 3. Automatic trigger to create progress record on user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_progress (user_id, xp, streak, current_level, completed_mission_ids)
  values (new.id, 0, 1, 'A1', '{}');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
