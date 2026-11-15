/* ===========================================================
   MODELO PARA OUTRA OFERTA
   1. Copie este arquivo e renomeie SEM o "_" (ex.: pascoa.js, bolo-pote.js).
      Só letras minúsculas, números e hífen no nome.
   2. Preencha os campos abaixo.
   3. O link do quiz fica: SEU-SITE/quiz/?f=pascoa
   (Arquivos que começam com "_" não abrem pelo link, por isso este modelo não aparece no site.)

   Textos aceitam HTML simples (<em>, <strong>, <span>) e estes tokens:
   {nome}      primeiro nome da pessoa (vazio se ela não preencher)
   {Nome}      primeiro nome, ou "Você" se estiver vazio
   {nome,}     "Ana, " (ou nada se não tiver nome), bom para começo de frase
   {meta} {ticket} {encomendas} {porSemana} {semanas} {dias} {prazo} {marca}
   =========================================================== */
window.QUIZ = {
  id: "modelo",                          // aparece nos eventos do Pixel/GTM e no src do checkout (src=quiz-modelo)
  paginaTitulo: "Quiz | Título que aparece na aba do navegador",
  marca: { nome: "Nome da Marca", logo: "../assets/img/logo-natale.webp", link: "../" },

  /* cores (opcional): troque as variáveis do tema. Apague para manter vinho e dourado. */
  // cores: { "wine-500": "#8b2420", "wine-600": "#6e1a17", "wine-800": "#3a0d0b", "wine-950": "#1a0504", "gold-400": "#e7c67e", "gold-500": "#d4af6a" },
  // neve: false,                        // desliga a neve (para ofertas fora do Natal)

  abertura: {
    imagem: "../assets/img/oferta2-hero.webp",  // foto vertical ou quadrada; aparece no topo, cortada em 16:9
    imagemAlt: "Descrição da foto",
    eyebrow: "",                          // frase pequena em letra cursiva acima do título (opcional)
    titulo: "Pergunta que gera curiosidade <span>com a promessa em destaque</span>",
    lead: "Responda X perguntas rápidas e descubra ...",
    selos: ["⏱️ Leva 1 minuto", "🎯 Benefício 2", "💰 Benefício 3"],
    botao: "COMEÇAR",
    pedirNome: true                       // false = não pergunta o nome
  },

  /* de 4 a 7 perguntas costuma ser o ideal. Cada opção tem: v (valor), ic (emoji), t (texto), s (subtexto opcional) */
  perguntas: [
    { id: "momento", eyebrow: "Para começar…", titulo: "Pergunta 1 <em>destaque</em>?", opcoes: [
      { v: "a", ic: "🏆", t: "Opção A", s: "Subtexto" },
      { v: "b", ic: "✨", t: "Opção B" },
      { v: "c", ic: "🤔", t: "Opção C" }
    ]},
    { id: "meta", eyebrow: "A sua meta", titulo: "Quanto você quer <em>faturar</em>?", opcoes: [
      { v: "1000", ic: "💵", t: "Até R$ 1.000" },          // quando a pergunta é de meta, o "v" é o número usado na conta
      { v: "3000", ic: "💰", t: "De R$ 1.000 a R$ 5.000" },
      { v: "7000", ic: "🚀", t: "Mais de R$ 5.000" }
    ]},
    { id: "trava", eyebrow: "Seja sincera", titulo: "O que mais te <em>trava</em>?", opcoes: [
      { v: "x", ic: "📖", t: "Dor X" },
      { v: "y", ic: "🧮", t: "Dor Y" }
    ]}
  ],

  /* pedir contato antes do resultado: null (não pede), "whatsapp" ou "email".
     webhook: URL que recebe os dados (Make, Zapier, n8n, Google Apps Script...). */
  lead: { pedir: null, webhook: "", titulo: "Para onde envio o seu plano?", botao: "VER MEU RESULTADO", pular: true },

  analise: { titulo: "{Nome}, estamos montando o seu <em>resultado</em>…", itens: ["Analisando as respostas", "Calculando o potencial", "Montando o plano"] },

  resultado: {
    titulo: "{nome,}a sua meta é <span>{meta} {prazo}</span>",
    prazo: { mes: 4, dia: 5, rotulo: "até a Páscoa" },   // data final da campanha (mês e dia)
    meta: { por: "meta", padrao: 3000, ticket: 50, rotulo: "A sua meta {prazo}", unidade: "vendas de {ticket}", unidadeTempo: "semanas {prazo}", unidadeSemana: "vendas por semana" },
    // meta: null,                        // sem números? apague a linha de cima e use esta
    perfilPor: "momento",                 // qual pergunta define a etiqueta e o texto de abertura
    perfis: {
      a: ["ETIQUETA A", "Texto para quem marcou A."],
      b: ["ETIQUETA B", "Texto para quem marcou B."],
      _padrao: ["ETIQUETA", "Texto padrão."]
    },
    // complementoPor: "outra-pergunta", complementos: { valor: "Frase extra no fim do texto." },
    tituloPlano: "O seu plano",
    blocos: [
      /* "destaque" marca com ⭐ o item da oferta que tem exatamente o mesmo texto */
      { por: "trava", itens: { x: { ic: "📖", texto: "<strong>Solução X:</strong> explicação.", destaque: "Item 1 da oferta" }, y: { ic: "🧮", texto: "<strong>Solução Y:</strong> explicação.", destaque: "Item 2 da oferta" } } },
      { fixo: { ic: "🎯", texto: "<strong>Meta semanal:</strong> {porSemana} vendas por semana." } }
    ]
  },

  oferta: {
    titulo: "O que você precisa está no <em>{marca}</em>",
    imagem: "../assets/img/oferta-mockup.webp",
    imagemAlt: "Mockup do produto",
    itens: ["Item 1 da oferta", "Item 2 da oferta", "Item 3 da oferta"],
    precoDe: "R$ 197",
    preco: "R$ 47,00",
    parcelas: "ou em até 5x no cartão",
    botao: "QUERO COMEÇAR AGORA",
    checkout: "",                         // link do checkout desta oferta (as UTMs do anúncio são repassadas)
    linkReserva: "../",                   // para onde o botão vai se o checkout estiver vazio
    garantiaDias: 7,
    garantiaTexto: "Garantia incondicional: se não for para você, devolvemos 100% do seu dinheiro.",
    linkVerMais: "../",
    linkVerMaisTexto: "Ver a página completa"
  }
};
