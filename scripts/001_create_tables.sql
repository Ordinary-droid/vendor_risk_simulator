-- Vendor Risk Platform Database Schema
-- Creates tables for vendors, incidents, and user profiles with RLS policies

-- Profiles table (references auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'viewer' check (role in ('admin', 'analyst', 'viewer')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Vendors table
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('cloud', 'saas', 'infrastructure', 'security', 'data', 'communication')),
  status text default 'active' check (status in ('active', 'inactive', 'under_review', 'blocked')),
  security_rating integer default 75 check (security_rating >= 0 and security_rating <= 100),
  compliance_nist boolean default false,
  compliance_iso27001 boolean default false,
  compliance_soc2 boolean default false,
  compliance_gdpr boolean default false,
  contract_value numeric(12, 2) default 0,
  data_access_level text default 'low' check (data_access_level in ('none', 'low', 'medium', 'high', 'critical')),
  last_assessment timestamp with time zone,
  next_assessment timestamp with time zone,
  contact_email text,
  contact_name text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.vendors enable row level security;

-- All authenticated users can read vendors
create policy "vendors_select_authenticated"
  on public.vendors for select
  to authenticated
  using (true);

-- Only admins and analysts can insert vendors
create policy "vendors_insert_authorized"
  on public.vendors for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'analyst')
    )
  );

-- Only admins and analysts can update vendors
create policy "vendors_update_authorized"
  on public.vendors for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'analyst')
    )
  );

-- Only admins can delete vendors
create policy "vendors_delete_admin"
  on public.vendors for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Incidents table
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete cascade,
  title text not null,
  description text,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  status text default 'open' check (status in ('open', 'investigating', 'mitigating', 'resolved', 'closed')),
  incident_type text check (incident_type in ('data_breach', 'service_outage', 'compliance_violation', 'security_vulnerability', 'policy_violation', 'other')),
  affected_systems text[],
  resolution text,
  resolved_at timestamp with time zone,
  reported_by uuid references auth.users(id),
  assigned_to uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.incidents enable row level security;

-- All authenticated users can read incidents
create policy "incidents_select_authenticated"
  on public.incidents for select
  to authenticated
  using (true);

-- Admins and analysts can create incidents
create policy "incidents_insert_authorized"
  on public.incidents for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'analyst')
    )
  );

-- Admins and analysts can update incidents
create policy "incidents_update_authorized"
  on public.incidents for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'analyst')
    )
  );

-- Only admins can delete incidents
create policy "incidents_delete_admin"
  on public.incidents for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Audit log table for tracking changes
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone default now()
);

alter table public.audit_logs enable row level security;

-- Only admins can view audit logs
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- System can insert audit logs
create policy "audit_logs_insert_authenticated"
  on public.audit_logs for insert
  to authenticated
  with check (true);

-- Create indexes for better query performance
create index if not exists idx_vendors_status on public.vendors(status);
create index if not exists idx_vendors_category on public.vendors(category);
create index if not exists idx_vendors_security_rating on public.vendors(security_rating);
create index if not exists idx_incidents_vendor_id on public.incidents(vendor_id);
create index if not exists idx_incidents_severity on public.incidents(severity);
create index if not exists idx_incidents_status on public.incidents(status);
create index if not exists idx_incidents_created_at on public.incidents(created_at desc);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- Function to automatically update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
drop trigger if exists update_vendors_updated_at on public.vendors;
create trigger update_vendors_updated_at
  before update on public.vendors
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_incidents_updated_at on public.incidents;
create trigger update_incidents_updated_at
  before update on public.incidents
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();
