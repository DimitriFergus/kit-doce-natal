/* ===========================================================
   NATALÊ — CONFIGURAÇÃO GERAL
   Edite SÓ este bloco para trocar preço, checkout, vídeo e contatos.
   Vale para as duas páginas de oferta e para a área de membros.
   =========================================================== */
window.KIT = {
  nome: "Natalê",

  // Preços exibidos nas páginas
  preco: "R$ 27,90",          // Black Friday (preço normal: R$ 57,90)
  precoCompleto: "R$ 27,90",
  precoDe: "R$ 57,90",        // aparece riscado: "De R$ 57,90 por R$ 27,90"
  parcelas: "ou em até 5x no cartão",

  // Link do checkout (Kiwify, Hotmart, PerfectPay, Eduzz...). As UTMs da visita são repassadas automaticamente.
  checkoutOferta1: "https://pay.cakto.com.br/3becfa3_1333847",
  checkoutOferta2: "https://pay.cakto.com.br/3becfa3_1333847",
  checkoutQuiz: "",          // se ficar vazio, o quiz usa o checkout da Oferta 1

  // Meta Pixel (Facebook/Instagram Ads). Vazio = sem pixel.
  pixelMeta: "1186166813747911",

  // Vídeo de demonstração: cole a URL de embed (ex.: https://www.youtube.com/embed/ID ou player do VTurb/Panda)
  videoEmbed: "",

  // Contatos
  emailSuporte: "suporte@seudominio.com.br",
  whatsappSuporte: "",        // só números com DDI, ex.: 5511999999999
  linkGrupoComunidade: "",    // link de convite do grupo/comunidade de alunos

  // Área de membros: o código de acesso (enviado no e-mail pós-compra) NÃO fica escrito aqui, só o hash dele.
  // Para trocar o código, gere o novo hash e cole abaixo (isso desconecta quem já entrou):
  //   node -e "console.log(require('crypto').createHash('sha256').update('kdn:' + 'NOVOCODIGO'.toUpperCase()).digest('hex'))"
  // Deixe "" para liberar a entrada só com o e-mail.
  codigoAcessoHash: "bb679b88f1fb6c3d1c2d8d79fbf0bac5d978080c1fb20dd358eaab7dd3109990",
  urlAreaMembros: "https://dimitrifergus.github.io/area-de-membros-natale/",

  // Banco de dados da área de membros (Supabase). Veja BANCO-DE-DADOS.md.
  // Preenchidos → login com e-mail + senha e dados salvos na nuvem. Vazios → login antigo por código.
  // Aqui vai SÓ a chave PÚBLICA (publishable, começa com "sb_publishable_" ou a "anon"). Ela pode ficar no site:
  // quem protege os dados são as regras do banco. A chave SECRETA (sb_secret_/service_role) NUNCA entra aqui.
  supabaseUrl: "https://ifslsvpkfhkqplunkgau.supabase.co",              // ex.: https://abcdefghijklmnop.supabase.co
  supabaseChavePublica: "sb_publishable_wRiQX6bfg_4vp6nWGjqwow_dpEL9lyn"
};

/* Imagem ainda não enviada? Mostra um aviso com o nome do arquivo esperado no lugar dela. */
window.addEventListener("error", function (e) {
  var img = e.target;
  if (!img || img.tagName !== "IMG" || img.dataset.phDone) return;
  img.dataset.phDone = "1";
  var file = (img.getAttribute("src") || "").split("/").pop();
  var ph = document.createElement("div");
  ph.className = "ph";
  ph.setAttribute("role", "img");
  ph.setAttribute("aria-label", img.alt || "Imagem");
  ph.innerHTML = "<b>📷</b><span>" + (img.alt || "Imagem pendente") + "</span><code>" + file + "</code>";
  img.replaceWith(ph);
}, true);
