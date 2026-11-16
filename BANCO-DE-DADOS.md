# Banco de dados da área de membros (Supabase)

## Como funciona
1. A pessoa compra na **Kiwify** ou na **Hotmart**.
2. A plataforma avisa o **webhook** `compra-webhook`, que roda no servidor do Supabase.
3. O webhook registra a compra e manda o e-mail **"Crie a sua senha"**.
4. A aluna cria a senha e entra com **e-mail e senha**.
5. Perfil, foto, encomendas, preços, favoritos e progresso ficam salvos na conta dela, em qualquer aparelho.
6. **Reembolso ou chargeback:** o acesso aos dados salvos é cortado na hora, e ela não consegue entrar de novo.

| Tabela | O que tem | Quem acessa |
|---|---|---|
| `compras` | E-mail, status (aprovada, reembolsada, chargeback, cancelada), plataforma, nº da transação | **Só o webhook, no servidor.** Ninguém lê pelo site. |
| `dados_aluno` | O que a aluna salva no app (uma linha por assunto, no máximo 400 KB cada) | **Só a própria aluna**, e só com compra aprovada e e-mail confirmado |
| Senhas | Ficam no Supabase Auth, criptografadas (bcrypt) | Ninguém, nem você, vê a senha |

Não guardamos CPF, cartão, endereço nem telefone.

## As duas chaves (leia com atenção)
| Chave | Onde fica | Pode vazar? |
|---|---|---|
| **Pública** (`sb_publishable_...` ou `anon`) | `assets/js/kit.js` → `supabaseChavePublica` | **Pode ficar no site.** Ela só faz o que as regras do banco (RLS) deixam: cada aluna só vê as próprias linhas. |
| **Secreta** (`sb_secret_...` ou `service_role`) | **Só no servidor do Supabase.** O webhook recebe sozinha. | **NUNCA.** Não cole em `kit.js`, no GitHub, no WhatsApp nem no e-mail. Se o app perceber que ela foi colada em `kit.js`, recusa usar. |
| **Token do webhook** (`WEBHOOK_SEGREDO`) | Só em `npx supabase secrets set` | Nunca no código |

Se a chave secreta vazar um dia: Supabase → **Project Settings → API Keys** → gere uma nova (*rotate*) e apague a antiga.

## Passo a passo para ligar (uns 20 minutos)

### 1. Criar o projeto
1. Entre em https://supabase.com e crie uma conta. Use **login com 2 fatores** (Account → Security).
2. **New project.** Nome: `natale`. Região: **South America (São Paulo)**.
3. Senha do banco: clique em **Generate a password** e guarde no seu gerenciador de senhas. Você quase não vai usar.

### 2. Criar as tabelas e as regras de segurança
1. No Supabase, abra **SQL Editor → New query**.
2. Cole todo o conteúdo de `supabase/migrations/20261116000000_area_de_membros.sql` e clique em **Run**.
3. Abra **Database → Tables** e confira que `compras` e `dados_aluno` aparecem com o selo **RLS enabled**.

### 3. Configurar o login (Authentication)
1. **Sign In / Providers → Email**:
   - **Desligue "Allow new users to sign up"**: ninguém cria conta sozinho, só quem comprou.
   - Deixe **"Confirm email"** ligado.
   - Em **Minimum password length**, coloque 8.
   - Em **Password requirements**, escolha letras e números.
2. **URL Configuration**:
   - **Site URL:** `https://dimitrifergus.github.io/kit-doce-natal/membros/`
   - **Redirect URLs:** adicione a mesma e também `http://localhost:5500/membros/`
3. **Emails → SMTP Settings: obrigatório antes de vender.**
   - O e-mail padrão do Supabase manda só uns 2 a 4 e-mails por hora, o que não dá para muitas vendas.
   - Crie uma conta grátis na **Resend** (3.000 e-mails por mês) ou na **Brevo** (300 por dia).
   - Cole os dados de SMTP aqui e depois aumente o limite em **Rate Limits → emails**.
4. **Emails → Templates**:
   - Em **Invite user**, cole `supabase/templates/convite.html`.
   - Em **Reset password**, cole `supabase/templates/recuperar-senha.html`.
   - Os assuntos estão em `supabase/config.toml`.

### 4. Publicar o webhook de compra
No terminal, dentro da pasta do projeto:
```
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase secrets set WEBHOOK_SEGREDO="TOKEN_DA_KIWIFY_OU_HOTTOK_DA_HOTMART" SITE_URL="https://dimitrifergus.github.io/kit-doce-natal"
npx supabase functions deploy compra-webhook --no-verify-jwt
```
- `SEU_PROJECT_REF` são as letras do endereço do projeto (`https://SEU_PROJECT_REF.supabase.co`).
- O endereço do webhook fica `https://SEU_PROJECT_REF.supabase.co/functions/v1/compra-webhook`.

### 5. Ligar na plataforma de pagamento
- **Kiwify:** Apps → Webhooks → criar.
  - Cole o endereço acima e marque **Compra aprovada**, **Reembolso** e **Chargeback**.
  - O **token** que a Kiwify mostra é o `WEBHOOK_SEGREDO`. A Kiwify assina cada aviso com ele, e o webhook confere.
- **Hotmart:** Ferramentas → Webhook (API e notificações).
  - Cole o endereço e marque compra aprovada, completa, reembolsada, chargeback e cancelada.
  - O **hottok** da Hotmart é o `WEBHOOK_SEGREDO`.

### 6. Ligar a área de membros
Em `assets/js/kit.js`, preencha e publique:
```js
supabaseUrl: "https://SEU_PROJECT_REF.supabase.co",
supabaseChavePublica: "sb_publishable_..."   // Project Settings → API Keys → Publishable key
```
A partir daí, o login por código (NATAL2026) deixa de valer e entra o login com e-mail e senha.

### 7. Quem comprou antes do banco existir
No **SQL Editor**, para cada pessoa:
```sql
insert into public.compras (email, status, plataforma, transacao) values ('cliente@email.com', 'aprovada', 'manual', 'antiga-1');
```
Depois, peça para ela abrir a área de membros e tocar em **"Primeiro acesso ou esqueceu a senha?"**.

Para liberar alguém fora da Kiwify ou da Hotmart, mande ao webhook um POST com o cabeçalho `x-webhook-segredo: SEU_SEGREDO` e o corpo:
```json
{ "email": "cliente@email.com", "status": "aprovada" }
```

### 8. Teste final (5 minutos)
1. Faça uma compra de teste (ou use o "Testar webhook" da plataforma). O e-mail "Crie a sua senha" tem que chegar.
2. Crie a senha. Você entra direto no app.
3. Preencha o Meu perfil. Abra em outro celular, entre com a mesma conta, e o perfil tem que aparecer.
4. Reembolse a compra de teste. Ao abrir o app de novo, a pessoa tem que ser desconectada.

## Testes de segurança já feitos
- **Banco (29 testes num Postgres real):**
  - Visitante sem login não lê nem grava nada.
  - A Bia não vê, não altera, não apaga e não se passa pela Ana.
  - Quem não comprou ou não confirmou o e-mail fica sem acesso.
  - Reembolso corta o acesso na hora.
  - Limite de 400 KB por linha.
  - Data de alteração sempre a do servidor.
  - Também estraguei uma regra de propósito para provar que os testes pegam a falha.
- **Webhook (19 testes):**
  - Aviso sem assinatura, com assinatura errada ou com corpo alterado é recusado.
  - A comparação do segredo é feita em tempo constante.
  - Boleto pendente e carrinho abandonado são ignorados.
  - E-mail malicioso é recusado.
- **Área de membros (18 testes no navegador):**
  - Senha errada, conta sem compra, login, envio dos dados para a nuvem, outro aparelho, "esqueci a senha", link do e-mail, senha fraca, sair e apagar dados.
  - Chave secreta colada por engano é recusada.
- **Busca de segredos no repositório:** nenhuma chave, token ou senha nos arquivos.

## Limite que continua existindo
As **receitas e os textos** da área de membros são arquivos do site (`membros/data/*.js`) e o repositório do GitHub é **público**. Quem souber o endereço do arquivo consegue baixar o conteúdo, com ou sem login. O banco protege os **dados das alunas**, não as receitas.

Para proteger o conteúdo também, há dois caminhos:
- **Deixar o repositório privado:** o GitHub Pages em repositório privado exige o plano Pro, de US$ 4 por mês.
- **Guardar as receitas no Supabase** com a mesma regra de "só quem comprou". Isso pode ser feito numa próxima etapa.
