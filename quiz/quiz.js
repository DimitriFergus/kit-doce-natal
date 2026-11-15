/* ===========================================================
   MOTOR DO QUIZ (serve para qualquer oferta)
   - Os textos, perguntas, resultado e oferta ficam em quiz/funis/<nome>.js
   - O funil é escolhido pelo link: /quiz/?f=ferias  (sem ?f= abre o "natal")
   - Para outra oferta: copie quiz/funis/_modelo.js, preencha e use ?f=<nome-do-arquivo>
   Não precisa mexer neste arquivo.
   =========================================================== */
(function () {
  var KIT = window.KIT || {};
  var Q = window.QUIZ;
  var root = document.getElementById("quiz");
  if (!Q || !root) return;

  var OF = Q.oferta || {}, RS = Q.resultado || {}, AB = Q.abertura || {};
  var CHAVE = "quiz:" + (Q.id || "padrao");

  /* ---------- marca, título da aba e cores ---------- */
  if (Q.paginaTitulo) document.title = Q.paginaTitulo;
  if (Q.marca) {
    var lg = document.querySelector(".qz-header .logo-img");
    if (lg && Q.marca.logo) { lg.src = Q.marca.logo; lg.alt = Q.marca.nome || ""; }
    var lk = document.querySelector(".qz-header .logo");
    if (lk && Q.marca.link) lk.href = Q.marca.link;
    document.querySelectorAll("[data-marca]").forEach(function (el) { el.textContent = Q.marca.nome || ""; });
  }
  if (Q.cores) Object.keys(Q.cores).forEach(function (k) { document.documentElement.style.setProperty("--" + k, Q.cores[k]); });
  if (Q.neve === false) { var sn = document.getElementById("snow"); if (sn) sn.remove(); }

  /* ---------- estado (fica salvo se a pessoa recarregar a página) ---------- */
  var st = { passo: -1, nome: "", contato: "", r: {} };
  try { var salvo = JSON.parse(sessionStorage.getItem(CHAVE)); if (salvo && salvo.r) st = salvo; } catch (e) {}
  function guarda() { try { sessionStorage.setItem(CHAVE, JSON.stringify(st)); } catch (e) {} }

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function brl(n) { return "R$ " + Math.round(n).toLocaleString("pt-BR"); }
  function utms() {
    var o = {}; new URLSearchParams(location.search).forEach(function (v, k) { if (/^(utm_|src|sck|fbclid|gclid|ttclid|xcod)/.test(k)) o[k] = v; }); return o;
  }
  function evento(nome, dados) {
    var d = Object.assign({ funil: Q.id }, dados || {});
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: nome }, d));
    if (window.fbq) window.fbq("trackCustom", nome, d);
    if (window.ttq && window.ttq.track) window.ttq.track(nome, d);
  }
  function render(html) { root.innerHTML = html; window.scrollTo({ top: 0, behavior: "smooth" }); }

  /* números do resultado (meta, prazo, encomendas) */
  function prazoData() {
    var p = RS.prazo || { mes: 12, dia: 24 }, hoje = new Date();
    var d = new Date(hoje.getFullYear(), p.mes - 1, p.dia, 23, 59);
    if (hoje > d) d = new Date(hoje.getFullYear() + 1, p.mes - 1, p.dia, 23, 59);
    return d;
  }
  function numeros() {
    var m = RS.meta || {};
    var meta = +st.r[m.por] || m.padrao || 0;
    var ticket = m.ticket || 45;
    var dias = Math.max(1, Math.ceil((prazoData() - new Date()) / 864e5));
    var semanas = Math.max(1, Math.round(dias / 7));
    var enc = meta ? Math.ceil(meta / ticket) : 0;
    return { meta: meta, ticket: ticket, semanas: semanas, dias: dias, encomendas: enc, porSemana: Math.ceil(enc / semanas) };
  }
  /* troca {nome}, {meta}, {semanas}... pelos valores. Nome entra escapado. */
  function preenche(txt, n) {
    if (typeof txt === "function") txt = txt(st.r, n);
    var nome = st.nome ? esc(st.nome) : "";
    return String(txt || "")
      .replace(/\{nome,\}/g, nome ? nome + ", " : "")
      .replace(/\{Nome\}/g, nome || "Você")
      .replace(/\{nome\}/g, nome)
      .replace(/\{meta\}/g, n ? brl(n.meta) : "")
      .replace(/\{ticket\}/g, n ? brl(n.ticket) : "")
      .replace(/\{encomendas\}/g, n ? n.encomendas : "")
      .replace(/\{porSemana\}/g, n ? n.porSemana : "")
      .replace(/\{semanas\}/g, n ? n.semanas : "")
      .replace(/\{dias\}/g, n ? n.dias : "")
      .replace(/\{prazo\}/g, (RS.prazo && RS.prazo.rotulo) || "")
      .replace(/\{marca\}/g, esc((Q.marca && Q.marca.nome) || KIT.nome || ""))
      .replace(/^\s*([a-zà-ú])/, function (m, c) { return c.toUpperCase(); }); /* sem nome, a frase começa com maiúscula */
  }

  /* ---------- abertura ---------- */
  function abertura() {
    var pedirNome = AB.pedirNome !== false;
    render('<section class="qz-card">' +
      (AB.imagem ? '<div class="qz-hero"><img src="' + esc(AB.imagem) + '" alt="' + esc(AB.imagemAlt || "") + '" width="800" height="1000" fetchpriority="high"></div>' : "") +
      (AB.eyebrow ? '<span class="qz-eyebrow">' + AB.eyebrow + "</span>" : "") +
      "<h1>" + preenche(AB.titulo) + "</h1>" +
      '<p class="qz-lead">' + preenche(AB.lead) + "</p>" +
      (AB.selos && AB.selos.length ? '<ul class="qz-badges">' + AB.selos.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul>" : "") +
      '<form id="qz-ini">' +
      (pedirNome ? '<label class="qz-field">' + (AB.perguntaNome || "Como você se chama?") + '<input name="nome" autocomplete="given-name" placeholder="Seu primeiro nome" value="' + esc(st.nome) + '" maxlength="40"></label>' : "") +
      '<button class="btn btn-lg btn-block btn-pulse" type="submit">' + (AB.botao || "COMEÇAR") + ' <span aria-hidden="true">→</span></button></form>' +
      '<p class="qz-small">' + (AB.aviso || "🔒 Suas respostas não são compartilhadas.") + "</p></section>");
    document.getElementById("qz-ini").addEventListener("submit", function (e) {
      e.preventDefault();
      if (this.nome) st.nome = this.nome.value.trim().split(/\s+/)[0].slice(0, 20) || "";
      st.passo = 0; guarda(); evento("quiz_inicio"); pergunta();
    });
  }

  /* ---------- perguntas ---------- */
  var P = Q.perguntas || [];
  var temLead = !!(Q.lead && Q.lead.pedir);
  function total() { return P.length + (temLead ? 1 : 0); }

  function topo(i) {
    var n = total();
    return '<div class="qz-top"><button class="qz-back" type="button" aria-label="Voltar">←</button><div class="qz-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + i + '"><i style="width:' + (i / n * 100) + '%"></i></div><span class="qz-step">' + (i + 1) + "/" + n + "</span></div>";
  }
  function animaBarra(i) { requestAnimationFrame(function () { var b = root.querySelector(".qz-bar i"); if (b) b.style.width = ((i + 1) / total() * 100) + "%"; }); }
  function voltar() { if (st.passo <= 0) { st.passo = -1; guarda(); abertura(); } else { st.passo--; guarda(); passo(); } }

  function pergunta() {
    var i = st.passo, p = P[i];
    var eyebrow = i === 0 && st.nome ? esc(st.nome) + ", " + (p.eyebrowNome || "para começar…") : (p.eyebrow || "");
    render('<section class="qz-card">' + topo(i) +
      '<span class="qz-eyebrow">' + eyebrow + "</span>" +
      "<h2>" + preenche(p.titulo) + "</h2>" + (p.sub ? '<p class="qz-lead">' + preenche(p.sub) + "</p>" : "") +
      '<div class="qz-opts">' +
      p.opcoes.map(function (o) {
        return '<button type="button" class="qz-opt' + (st.r[p.id] === o.v ? " on" : "") + '" data-v="' + esc(o.v) + '"><span class="ic" aria-hidden="true">' + o.ic + "</span><span>" + o.t + (o.s ? "<small>" + o.s + "</small>" : "") + "</span></button>";
      }).join("") + "</div></section>");
    animaBarra(i);
    root.querySelector(".qz-back").addEventListener("click", voltar);
    root.querySelector(".qz-opts").addEventListener("click", function (e) {
      var b = e.target.closest(".qz-opt"); if (!b || root.dataset.lock) return;
      root.dataset.lock = "1";
      root.querySelectorAll(".qz-opt").forEach(function (x) { x.classList.toggle("on", x === b); });
      st.r[p.id] = b.dataset.v;
      evento("quiz_resposta", { pergunta: i + 1, id: p.id, resposta: b.dataset.v });
      setTimeout(function () { delete root.dataset.lock; st.passo++; guarda(); passo(); }, 380);
    });
  }

  /* contato opcional (WhatsApp ou e-mail) antes do resultado */
  function captura() {
    var L = Q.lead, i = P.length, zap = L.pedir === "whatsapp";
    render('<section class="qz-card">' + topo(i) +
      '<span class="qz-eyebrow">' + (L.eyebrow || "Último passo") + "</span><h2>" + preenche(L.titulo || "Para onde envio o seu plano?") + "</h2>" +
      (L.sub ? '<p class="qz-lead">' + preenche(L.sub) + "</p>" : "") +
      '<form id="qz-lead"><label class="qz-field">' + (zap ? "Seu WhatsApp com DDD" : "Seu melhor e-mail") +
      '<input name="contato" required ' + (zap ? 'type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999" pattern="[0-9 \\(\\)+\\-]{10,20}"' : 'type="email" autocomplete="email" placeholder="voce@email.com"') + ' value="' + esc(st.contato) + '" maxlength="80"></label>' +
      '<button class="btn btn-lg btn-block" type="submit">' + (L.botao || "VER MEU RESULTADO") + ' <span aria-hidden="true">→</span></button></form>' +
      (L.pular !== false ? '<p class="qz-small"><button type="button" class="qz-skip" style="all:unset;cursor:pointer;text-decoration:underline">Pular e ver o resultado</button></p>' : "") +
      '<p class="qz-small">' + (L.aviso || "🔒 Sem spam. Você pode sair da lista quando quiser.") + "</p></section>");
    animaBarra(i);
    root.querySelector(".qz-back").addEventListener("click", voltar);
    var pular = root.querySelector(".qz-skip");
    if (pular) pular.addEventListener("click", function () { st.passo++; guarda(); passo(); });
    document.getElementById("qz-lead").addEventListener("submit", function (e) {
      e.preventDefault();
      st.contato = this.contato.value.trim(); st.passo++; guarda();
      evento("quiz_lead", { tipo: L.pedir });
      if (L.webhook) {
        try {
          fetch(L.webhook, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ funil: Q.id, nome: st.nome, contato: st.contato, tipo: L.pedir, respostas: st.r, origem: utms(), pagina: location.href, data: new Date().toISOString() }) });
        } catch (er) {}
      }
      passo();
    });
  }

  function passo() {
    if (st.passo < 0) return abertura();
    if (st.passo < P.length) return pergunta();
    if (temLead && st.passo === P.length) return captura();
    if (st.passo === total()) return analise();
    return resultado();
  }

  /* ---------- análise ---------- */
  function analise() {
    var A = Q.analise || {};
    var itens = A.itens || ["Analisando as suas respostas", "Calculando o seu potencial", "Montando o seu plano"];
    render('<section class="qz-card qz-load"><div class="qz-spinner" aria-hidden="true"></div><h2>' + preenche(A.titulo || "{Nome}, estamos montando o seu <em>diagnóstico</em>…") + '</h2><ul class="qz-checks">' +
      itens.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></section>");
    var li = root.querySelectorAll(".qz-checks li"), k = 0;
    var t = setInterval(function () {
      if (k < li.length) { li[k++].classList.add("ok"); return; }
      clearInterval(t); st.passo = total() + 1; guarda(); resultado();
    }, 650);
  }

  /* ---------- resultado ---------- */
  function bloco(b, n) {
    var r = st.r, ic, txt;
    if (b.fixo) { ic = b.fixo.ic; txt = b.fixo.texto; }
    else {
      var it = b.itens && (b.itens[r[b.por]] || b.itens._padrao);
      if (!it) return { html: "" };
      if (typeof it === "string") { ic = b.ic; txt = (b.titulo ? "<strong>" + b.titulo + "</strong> " : "") + it; }
      else { ic = it.ic || b.ic; txt = it.texto; }
    }
    return { html: '<li><span class="ic">' + (ic || "✔️") + "</span><span>" + preenche(txt, n) + "</span></li>", destaque: it && it.destaque };
  }

  function resultado() {
    var r = st.r, n = numeros();
    var perfis = RS.perfis || {}, perfil = perfis[r[RS.perfilPor]] || perfis._padrao || ["", ""];
    var blocos = (RS.blocos || []).map(function (b) { return bloco(b, n); });
    var destaque = blocos.map(function (b) { return b.destaque; }).filter(Boolean);
    var comp = RS.complementos ? (RS.complementos[r[RS.complementoPor]] || "") : "";
    var meta = RS.meta;

    evento("quiz_resultado", Object.assign({ meta: n.meta }, r));

    var garantia = OF.garantiaDias || 7;
    render('<section class="qz-card qz-result">' +
      (perfil[0] ? '<span class="qz-profile">' + perfil[0] + "</span>" : "") +
      "<h1>" + preenche(RS.titulo || "{Nome}, este é o seu <span>resultado</span>", n) + "</h1>" +
      '<p class="qz-lead">' + preenche(perfil[1], n) + (comp ? " " + preenche(comp, n) : "") + "</p>" +
      (meta && n.meta ? '<div class="qz-meta"><p>' + preenche(meta.rotulo || "A sua meta {prazo}", n) + "</p><strong>" + brl(n.meta) + "</strong>" +
        '<div class="qz-nums"><div><b>' + n.encomendas + "</b><span>" + preenche(meta.unidade || "encomendas de {ticket}", n) + "</span></div><div><b>" + n.semanas + "</b><span>" + preenche(meta.unidadeTempo || "semanas {prazo}", n) + "</span></div><div><b>" + n.porSemana + "</b><span>" + (meta.unidadeSemana || "por semana") + "</span></div></div>" +
        (meta.nota !== false ? '<p class="qz-nota">' + (meta.nota || "Projeção feita a partir da meta que você escolheu. Não é promessa de ganho: o resultado depende do seu trabalho e da sua região.") + "</p>" : "") + "</div>" : "") +
      (blocos.length ? '<h2 class="qz-sec">' + preenche(RS.tituloPlano || "O seu plano", n) + '</h2><ul class="qz-diag">' + blocos.map(function (b) { return b.html; }).join("") + "</ul>" : "") +
      '<h2 class="qz-sec">' + preenche(OF.titulo || "O que você precisa está no <em>{marca}</em>", n) + "</h2>" +
      (OF.imagem ? '<div class="qz-kit"><img src="' + esc(OF.imagem) + '" alt="' + esc(OF.imagemAlt || "") + '" width="900" height="822" loading="lazy"></div>' : "") +
      '<ul class="qz-stack">' + (OF.itens || []).map(function (it) { return "<li" + (destaque.indexOf(it) >= 0 ? ' class="hl"' : "") + ">" + it + "</li>"; }).join("") + "</ul>" +
      '<div class="qz-offer"><p class="from">De <s>' + esc(OF.precoDe || KIT.precoDe || "") + "</s> por apenas</p><span class=\"price\">" + esc(OF.preco || KIT.precoCompleto || KIT.preco || "") + "</span>" +
      '<p class="inst">' + esc(OF.parcelas || KIT.parcelas || "") + " · pagamento único</p>" +
      '<a class="btn btn-lg btn-block btn-pulse" id="qz-buy" href="' + esc(OF.linkReserva || "../#oferta-final") + '">' + preenche(OF.botao || "QUERO COMEÇAR AGORA", n) + ' <span aria-hidden="true">→</span></a>' +
      '<p class="qz-secure">🔒 Compra segura · acesso imediato por e-mail</p></div>' +
      '<div class="qz-guar"><b><span><big>' + garantia + "</big>DIAS</span></b><span>" + (OF.garantiaTexto || "Garantia incondicional: se não for para você, devolvemos 100% do seu dinheiro.") + "</span></div>" +
      (OF.linkVerMais ? '<a class="qz-more" href="' + esc(OF.linkVerMais) + '">' + (OF.linkVerMaisTexto || "Quero ver tudo que vem") + "</a>" : "") +
      '<p class="qz-small"><button type="button" class="qz-redo" style="all:unset;cursor:pointer;text-decoration:underline">Refazer o quiz</button></p></section>');

    var buy = document.getElementById("qz-buy");
    var checkout = OF.checkout || KIT.checkoutQuiz || KIT.checkoutOferta1;
    if (checkout) {
      try {
        var url = new URL(checkout), u = utms();
        Object.keys(u).forEach(function (k) { url.searchParams.set(k, u[k]); });
        if (!url.searchParams.has("src")) url.searchParams.set("src", "quiz-" + Q.id);
        buy.href = url.toString();
      } catch (e) { console.warn("[quiz] checkout inválido", e); }
    }
    buy.addEventListener("click", function () { evento("quiz_checkout", { meta: n.meta }); });
    root.querySelector(".qz-redo").addEventListener("click", function () { st = { passo: -1, nome: st.nome, contato: st.contato, r: {} }; guarda(); abertura(); });
  }

  /* ---------- início ---------- */
  passo();

  /* neve */
  var snow = document.getElementById("snow");
  if (snow && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var i = 0; i < (innerWidth < 700 ? 12 : 22); i++) {
      var f = document.createElement("i");
      f.textContent = Math.random() > 0.5 ? "❄" : "•";
      f.style.left = Math.random() * 100 + "%";
      f.style.fontSize = 8 + Math.random() * 12 + "px";
      f.style.animationDuration = 9 + Math.random() * 12 + "s";
      f.style.animationDelay = -Math.random() * 20 + "s";
      f.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      snow.appendChild(f);
    }
  }
  var ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();
})();
