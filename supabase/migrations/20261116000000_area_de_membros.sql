-- =====================================================================
-- NATALÊ · banco de dados da área de membros (Supabase / Postgres)
--
-- O que fica guardado:
--   compras       quem comprou (e-mail, status, transação). Só o webhook da
--                 plataforma de pagamento escreve aqui. Ninguém lê pelo site.
--   dados_aluno   o que a aluna salva na área de membros (perfil, foto,
--                 encomendas, preços, progresso). Cada aluna só enxerga e
--                 altera as PRÓPRIAS linhas, e só enquanto a compra estiver
--                 aprovada.
--
-- Não guardamos CPF, cartão, endereço nem telefone de compra.
-- Senhas ficam no Supabase Auth (bcrypt), nunca nestas tabelas.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Compras
-- ---------------------------------------------------------------------
create table if not exists public.compras (
  id            bigint generated always as identity primary key,
  email         text        not null check (email = lower(email) and length(email) between 5 and 254),
  status        text        not null check (status in ('aprovada', 'reembolsada', 'chargeback', 'cancelada')),
  plataforma    text        not null check (plataforma in ('cakto', 'kiwify', 'hotmart', 'manual', 'outra')),
  transacao     text        not null check (length(transacao) between 1 and 120),
  produto       text        check (produto is null or length(produto) <= 200),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (plataforma, transacao)
);
create index if not exists compras_email_idx on public.compras (email);

alter table public.compras enable row level security;
-- (sem "force": a função tem_acesso, que é do dono da tabela, precisa consultar as compras)
-- Sem nenhuma política: anon e authenticated não leem nem escrevem.
-- Só a service_role (usada dentro do webhook, no servidor) passa pela RLS.
revoke all on table public.compras from anon, authenticated;
revoke all on sequence public.compras_id_seq from anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. A aluna tem acesso?  (compra aprovada + e-mail confirmado)
-- ---------------------------------------------------------------------
create or replace function public.tem_acesso()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.compras c on c.email = lower(u.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
      and c.status = 'aprovada'
  );
$$;
revoke all on function public.tem_acesso() from public, anon;
grant execute on function public.tem_acesso() to authenticated;

-- ---------------------------------------------------------------------
-- 3. Dados da aluna (uma linha por assunto)
-- ---------------------------------------------------------------------
create table if not exists public.dados_aluno (
  user_id       uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  chave         text        not null check (chave in (
                  'perfil', 'foto', 'encomendas', 'precosSalvos', 'precosIngredientes', 'margemMedia',
                  'favs', 'feitas', 'check', 'aulas', 'cardapio', 'etiqueta', 'calcAtual')),
  valor         jsonb       not null,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, chave),
  -- teto por linha (a foto do perfil, já reduzida pelo app, tem uns 15 KB)
  constraint dados_aluno_tamanho check (pg_column_size(valor) <= 400000)
);

alter table public.dados_aluno enable row level security;
alter table public.dados_aluno force row level security;
revoke all on table public.dados_aluno from anon, authenticated;
grant select, insert, update, delete on table public.dados_aluno to authenticated;

drop policy if exists "aluna le os proprios dados" on public.dados_aluno;
create policy "aluna le os proprios dados" on public.dados_aluno
  for select to authenticated
  using ((select auth.uid()) = user_id and (select public.tem_acesso()));

drop policy if exists "aluna cria os proprios dados" on public.dados_aluno;
create policy "aluna cria os proprios dados" on public.dados_aluno
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select public.tem_acesso()));

drop policy if exists "aluna altera os proprios dados" on public.dados_aluno;
create policy "aluna altera os proprios dados" on public.dados_aluno
  for update to authenticated
  using ((select auth.uid()) = user_id and (select public.tem_acesso()))
  with check ((select auth.uid()) = user_id and (select public.tem_acesso()));

drop policy if exists "aluna apaga os proprios dados" on public.dados_aluno;
create policy "aluna apaga os proprios dados" on public.dados_aluno
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- data de alteração sempre a do servidor (o navegador não decide)
create or replace function public.dados_aluno_carimbo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;
drop trigger if exists dados_aluno_carimbo on public.dados_aluno;
create trigger dados_aluno_carimbo before insert or update on public.dados_aluno
  for each row execute function public.dados_aluno_carimbo();

-- a função do gatilho não precisa ser chamada por ninguém de fora
revoke all on function public.dados_aluno_carimbo() from public, anon, authenticated;
