# Kit Doce Natal — Landing Page

Landing page de vendas com HTML, CSS e TypeScript separados.

## Estrutura
- `index.html`: marcação da página
- `css/style.css`: estilos e animações CSS
- `src/main.ts`: código-fonte TypeScript (interações)
- `js/main.js`: JavaScript compilado a partir do TS (`npm run build`)
- `assets/`: imagens

## Personalizar
1. **Checkout:** edite `CHECKOUT_URL` em `src/main.ts` e rode `npm run build`.
2. **Vídeo:** cole o embed dentro de `<div class="video" id="video">` no `index.html`.
3. **Imagens:** troque cada `<div class="ph ...">` por `<div class="ph ..."><img src="assets/sua-imagem.webp" alt="..."></div>`.
4. **Depoimentos:** use somente prints reais das suas clientes, com autorização delas.

## Desenvolvimento
```bash
npm install
npm run watch
```

O deploy no GitHub Pages é feito automaticamente pelo GitHub Actions a cada push na branch `main`.
