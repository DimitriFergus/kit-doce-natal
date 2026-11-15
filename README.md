# Natalê

Três sites no mesmo design (vinho, creme e dourado):

| Site | Pasta | Para quê |
|---|---|---|
| Oferta 1 | `/` (`index.html`) | Página de venda direta, ângulo "cardápio pronto" |
| Oferta 2 | `/oferta-2/` | Página de venda direta, ângulo "renda extra começando do zero" (teste A/B) |
| Área de membros | `/membros/` | Onde a cliente recebe tudo, sem PDF |

## Configurar (um arquivo só)
Edite `assets/js/kit.js`:
- `checkoutOferta1` / `checkoutOferta2`: links do checkout (as UTMs da visita são repassadas).
- `preco`, `precoCompleto`, `precoDe`, `parcelas`.
- `videoEmbed`: URL de embed do vídeo de demonstração.
- `emailSuporte`, `whatsappSuporte`, `linkGrupoComunidade`.
- `codigoAcessoHash`: hash do código que vai no e-mail de boas-vindas (o código em si não fica no site). O comando para gerar o hash de um código novo está no próprio `kit.js`.
- `checkoutQuiz`: checkout usado pelo quiz (`/quiz/`); vazio = usa o da Oferta 1.

**E-mail pós-compra sugerido:** link `https://SEU-SITE/membros/?email={email}&codigo=NATAL2026` (o login já vem preenchido).

> Segurança atual (sem servidor): código guardado só como hash SHA-256, bloqueio progressivo após 5 tentativas erradas, sessão invalidada ao trocar o código, CSP restritiva, proteção contra o site ser embutido em outro e código removido da barra de endereço. Isso dificulta o acesso casual, mas **os arquivos de conteúdo continuam públicos para quem souber o endereço**. A proteção completa (login por comprador, liberação via webhook da plataforma, conteúdo servido só para quem pagou) entra na etapa do banco de dados.

## App (PWA)
A área de membros é um app instalável (`membros/manifest.webmanifest` + `membros/sw.js`): abre offline, guarda as imagens no celular e mostra o botão "Instalar o app" no Início (no iPhone, a instrução de "Adicionar à Tela de Início").
**Sempre que publicar mudanças na área de membros, troque `VERSAO` no topo de `membros/sw.js`** para os celulares baixarem a versão nova.

## Imagens
A planilha `PROMPTS-IMAGENS-Kit-Doce-Natal.xlsx` lista todas as 107 imagens com nome exato, pasta, tamanho e prompt.
Enquanto uma imagem não existe, o site mostra um quadro tracejado com o nome do arquivo esperado.
- Logo: `assets/img/logo-natale.webp` (fundo transparente, para fundos escuros) e `assets/img/icone-natale.webp` (o "N", usado em fundos claros). Ícones do app em `membros/icons/` e favicon em `assets/img/favicon-natale.png`.
- `assets/img/` → páginas de oferta
- `assets/img/membros/` → área de membros (capas, fundos de cardápio, artes)
- `assets/img/membros/receitas/` → foto de cada receita (`<id-da-receita>.webp`, 1200×900) e `receitas/mini/` (720×540, usada nos cards)

**Como converter imagens sem perder qualidade** (o ffmpeg ignora `-quality`; use `-q:v`):
`ffmpeg -i original.png -vf "scale=1200:900:flags=lanczos,format=yuv420p" -c:v libwebp -q:v 82 -compression_level 6 saida.webp`
Nunca amplie além do tamanho do original. Ao trocar imagens da área de membros, troque também `CACHE_IMG` em `membros/sw.js` (senão o celular continua mostrando a versão antiga).

**Fotos das 50 receitas novas:** os prompts estão em `PROMPTS-FOTOS-50-RECEITAS-NOVAS.xlsx` (clique no prompt, Ctrl+C e cole na geradora). Enquanto a foto não existe, a receita tem `foto: false` e mostra uma capa desenhada. Para ativar uma foto: gere a imagem (4:3), converta para `receitas/<id>.webp` (1200×900) e `receitas/mini/<id>.webp` (720×540) e apague o `foto: false` da receita.

Prova social (`prova-01` a `prova-06`): use **somente fotos/prints reais de clientes**, com autorização.

## Conteúdo da área de membros
- `membros/data/receitas.js`: 87 receitas, 57 doces e 30 salgadas (`tipo: "salgado"`), com ingredientes numéricos para a calculadora.
- `membros/data/conteudo.js`: mensagens, legendas, aulas, sabores, checklist, calendário, cardápios, artes e etiquetas.
- Os dados que a aluna digita (perfil, encomendas, preços, progresso) ficam salvos no navegador dela.

## Publicação
GitHub Pages via Actions (`.github/workflows/deploy.yml`) a cada push na `main`. Site 100% estático, sem build.
