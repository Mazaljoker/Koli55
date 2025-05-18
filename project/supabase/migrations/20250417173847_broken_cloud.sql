create or replace function get_policies(table_name text)
returns text[] as $$
declare
  policies text[];
begin
  select array_agg(polname::text)
  into policies
  from pg_policy
  where schemaname = 'public'
    and tablename = table_name;
  
  return policies;
end;
$$ language plpgsql security definer;