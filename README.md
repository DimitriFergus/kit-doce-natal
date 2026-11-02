# Kit Doce Natal

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
- `codigoAcesso`: código que vai no e-mail de boas-vindas da plataforma de pagamento.

**E-mail pós-compra sugerido:** link `https://SEU-SITE/membros/?email={email}&codigo=NATAL2026` (o login já vem preenchido).

> O login da área de membros é uma trava simples no navegador (e-mail + código). Serve para organizar o acesso, mas não é proteção forte: quem tiver o código entra. Troque o código a cada campanha. Para proteção real, hospede a área dentro da plataforma (Kiwify/Hotmart) ou atrás de um login com servidor.

## Imagens
A planilha `PROMPTS-IMAGENS-Kit-Doce-Natal.xlsx` lista todas as 107 imagens com nome exato, pasta, tamanho e prompt.
Enquanto uma imagem não existe, o site mostra um quadro tracejado com o nome do arquivo esperado.
- `assets/img/` → páginas de oferta
- `assets/img/membros/` → área de membros (capas, fundos de cardápio, artes)
- `assets/img/membros/receitas/` → foto de cada receita (`<id-da-receita>.webp`)

Prova social (`prova-01` a `prova-06`): use **somente fotos/prints reais de clientes**, com autorização.

## Conteúdo da área de membros
- `membros/data/receitas.js`: 37 receitas (ingredientes numéricos, para a calculadora).
- `membros/data/conteudo.js`: mensagens, legendas, aulas, sabores, checklist, calendário, cardápios, artes e etiquetas.
- Os dados que a aluna digita (perfil, encomendas, preços, progresso) ficam salvos no navegador dela.

## Publicação
GitHub Pages via Actions (`.github/workflows/deploy.yml`) a cada push na `main`. Site 100% estático, sem build.
