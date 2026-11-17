-- Aceita a Cakto como plataforma (para bancos criados antes desta mudança; pode rodar mais de uma vez).
alter table public.compras drop constraint if exists compras_plataforma_check;
alter table public.compras add constraint compras_plataforma_check
  check (plataforma in ('cakto', 'kiwify', 'hotmart', 'manual', 'outra'));
