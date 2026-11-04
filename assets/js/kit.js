/* ===========================================================
   KIT DOCE NATAL — CONFIGURAÇÃO GERAL
   Edite SÓ este bloco para trocar preço, checkout, vídeo e contatos.
   Vale para as duas páginas de oferta e para a área de membros.
   =========================================================== */
window.KIT = {
  nome: "Kit Doce Natal",

  // Preços exibidos nas páginas
  preco: "R$ 47",
  precoCompleto: "R$ 47,00",
  precoDe: "R$ 197",
  parcelas: "ou em até 5x no cartão",

  // Link do checkout (Kiwify, Hotmart, PerfectPay, Eduzz...). As UTMs da visita são repassadas automaticamente.
  checkoutOferta1: "",
  checkoutOferta2: "",
  checkoutQuiz: "",          // se ficar vazio, o quiz usa o checkout da Oferta 1

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
  urlAreaMembros: "membros/"
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
