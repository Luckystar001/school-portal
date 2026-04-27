-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  user_type text not null default 'student', -- 'student', 'staff', 'admin'
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_admin_select_all" on public.profiles for select using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);
create policy "profiles_admin_update_all" on public.profiles for update using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);

-- Create students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  registration_number text not null unique,
  class text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.students enable row level security;

-- Policies for students
create policy "students_select_own" on public.students for select using (auth.uid() = user_id);
create policy "students_select_public" on public.students for select using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);
create policy "students_admin_all" on public.students for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);

-- Create staff table
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  title text not null,
  department text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.staff enable row level security;

-- Policies for staff
create policy "staff_select_public" on public.staff for select using (true);
create policy "staff_select_own" on public.staff for select using (auth.uid() = user_id);
create policy "staff_admin_all" on public.staff for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);

-- Create results table
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  score numeric(5, 2) not null,
  grade text,
  term text not null,
  year integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.results enable row level security;

-- Policies for results
create policy "results_select_own" on public.results for select using (
  auth.uid() = (
    select user_id from public.students where id = student_id
  )
);
create policy "results_admin_all" on public.results for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and user_type = 'admin'
  )
);

-- Create trigger for auto-creating profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null),
    coalesce(new.raw_user_meta_data ->> 'user_type', 'student')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
