-- MeCuadra · categorías estilo Revolico (ejecutar una vez en Supabase SQL Editor)
-- Convierte el enum antiguo a text y remapea valores legacy.

do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'category'
      and udt_name = 'category_t'
  ) then
    alter table public.items alter column category type text using category::text;
  end if;
end $$;

update public.items set category = 'alimentos_bebidas' where category = 'alimentos';
update public.items set category = 'articulos_hogar' where category = 'aseo';
update public.items set category = 'belleza_maquillaje' where category = 'cuidado';
update public.items set category = 'salud_bienestar' where category = 'medicamentos';
update public.items set category = 'alimentos_bebidas' where category = 'bebidas';
update public.items set category = 'otros_general' where category = 'tabaco';
update public.items set category = 'otros_ropa' where category = 'ropa';
update public.items set category = 'articulos_hogar' where category = 'hogar';
update public.items set category = 'ropa_ninos' where category = 'ninos';
update public.items set category = 'otros_general' where category = 'otros';

-- Remapear categorías dentro de wants (jsonb) en ofertas
update public.offers
set wants = (
  select coalesce(jsonb_agg(
    case
      when elem->>'category' = 'alimentos' then jsonb_set(elem, '{category}', '"alimentos_bebidas"')
      when elem->>'category' = 'aseo' then jsonb_set(elem, '{category}', '"articulos_hogar"')
      when elem->>'category' = 'cuidado' then jsonb_set(elem, '{category}', '"belleza_maquillaje"')
      when elem->>'category' = 'medicamentos' then jsonb_set(elem, '{category}', '"salud_bienestar"')
      when elem->>'category' = 'bebidas' then jsonb_set(elem, '{category}', '"alimentos_bebidas"')
      when elem->>'category' = 'tabaco' then jsonb_set(elem, '{category}', '"otros_general"')
      when elem->>'category' = 'ropa' then jsonb_set(elem, '{category}', '"otros_ropa"')
      when elem->>'category' = 'hogar' then jsonb_set(elem, '{category}', '"articulos_hogar"')
      when elem->>'category' = 'ninos' then jsonb_set(elem, '{category}', '"ropa_ninos"')
      when elem->>'category' = 'otros' then jsonb_set(elem, '{category}', '"otros_general"')
      else elem
    end
  ), '[]'::jsonb)
  from jsonb_array_elements(coalesce(wants, '[]'::jsonb)) as elem
)
where wants is not null and wants <> '[]'::jsonb;
