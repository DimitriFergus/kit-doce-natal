/* ===========================================================
   KIT DOCE NATAL — área de membros (app de página única)
   Tudo o que o aluno digita fica salvo no navegador (localStorage).
   =========================================================== */
(function () {
  "use strict";
  /* impede que a área de membros seja aberta dentro de outro site (clickjacking) */
  if (window.top !== window.self) { try { window.top.location = window.self.location.href; } catch (e) { document.documentElement.innerHTML = ""; return; } }
  var KIT = window.KIT || {};
  var RECEITAS = window.RECEITAS || [];
  var C = window.CONTEUDO || {};
  var IMG = "../assets/img/membros/";

  /* ---------------- utilidades ---------------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("kdn:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("kdn:" + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem("kdn:" + k); } catch (e) {} }
  };
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function brl(n) { return (isFinite(n) ? n : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : 0; }
  function fmtQ(q) { var r = q < 10 ? Math.round(q * 10) / 10 : Math.round(q); return r.toLocaleString("pt-BR"); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function slug(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }
  function fmtData(d) { if (!d) return "sem data"; var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function hoje() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }

  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function copiar(txt) {
    var ok = function () { toast("Copiado! É só colar 💛"); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt).then(ok, fallback); } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("Não consegui copiar, selecione o texto manualmente"); } ta.remove();
    }
  }
  /* botão que pede um segundo toque para confirmar (sem janelas do navegador) */
  function confirma(btn, acao) {
    if (btn.dataset.armed) { acao(); return; }
    var txt = btn.textContent; btn.dataset.armed = "1"; btn.textContent = "Toque de novo para confirmar"; btn.classList.add("danger");
    setTimeout(function () { if (!btn.isConnected) return; delete btn.dataset.armed; btn.textContent = txt; btn.classList.remove("danger"); }, 3000);
  }

  /* ---------------- perfil ---------------- */
  function perfil() { return store.get("perfil", {}); }
  function preencher(txt) {
    var p = perfil();
    var m = { loja: p.loja || "[NOME DA SUA LOJA]", whats: p.whats || "[SEU WHATSAPP]", instagram: p.instagram || "[@SEUINSTAGRAM]", cidade: p.cidade ? slug(p.cidade).replace(/\s+/g, "") : "suacidade", pix: p.pix || "[SUA CHAVE PIX]", nome: p.nome || "[SEU NOME]" };
    return txt.replace(/\{(\w+)\}/g, function (a, k) { return m[k] != null ? m[k] : a; });
  }
  function avisoPerfil() {
    var p = perfil();
    if (p.loja && p.whats) return "";
    return '<a class="notice" href="#/perfil">✏️ Preencha o <strong>Meu perfil</strong> (nome da loja, WhatsApp e Pix) para os textos já saírem completos.</a>';
  }

  /* ---------------- login ---------------- */
  /* O código de acesso não fica escrito no site: só o hash SHA-256 de "kdn:" + CÓDIGO (KIT.codigoAcessoHash).
     A sessão guarda um pedaço desse hash; trocar o código em kit.js desconecta todo mundo. */
  var HASH = String(KIT.codigoAcessoHash || "").toLowerCase();
  function sha256(txt) {
    var bytes = new TextEncoder().encode(txt);
    if (window.crypto && crypto.subtle && window.isSecureContext) {
      return crypto.subtle.digest("SHA-256", bytes).then(function (b) { return hex(new Uint8Array(b)); });
    }
    return Promise.resolve(hex(sha256js(bytes)));
  }
  function hex(a) { return Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function sha256js(m) { // reserva para navegadores antigos ou sem HTTPS
    var K = [], H = [], i, j, p = 0;
    function frac(x) { return (x - Math.floor(x)) * 4294967296 | 0; }
    for (var c = 2; p < 64; c++) { for (i = 2; i * i <= c && c % i; i++); if (i * i > c) { if (p < 8) H[p] = frac(Math.pow(c, 1 / 2)); K[p++] = frac(Math.pow(c, 1 / 3)); } }
    var l = m.length, n = ((l + 9 + 63) >> 6) << 6, b = new Uint8Array(n); b.set(m); b[l] = 128;
    var dv = new DataView(b.buffer); dv.setUint32(n - 4, l * 8); var W = new Array(64);
    for (var o = 0; o < n; o += 64) {
      var h = H.slice(0);
      for (j = 0; j < 64; j++) {
        if (j < 16) W[j] = dv.getUint32(o + j * 4);
        else { var x = W[j - 15], y = W[j - 2]; W[j] = (((x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3) + W[j - 7] + ((y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ y >>> 10) + W[j - 16]) | 0; }
        var e = h[4], a = h[0];
        var t1 = (h[7] + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + ((e & h[5]) ^ (~e & h[6])) + K[j] + W[j]) | 0;
        var t2 = (((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]))) | 0;
        h = [(t1 + t2) | 0, h[0], h[1], h[2], (h[3] + t1) | 0, h[4], h[5], h[6]];
      }
      for (j = 0; j < 8; j++) H[j] = (H[j] + h[j]) | 0;
    }
    var out = new Uint8Array(32); for (j = 0; j < 8; j++) { out[j * 4] = H[j] >>> 24; out[j * 4 + 1] = H[j] >>> 16 & 255; out[j * 4 + 2] = H[j] >>> 8 & 255; out[j * 4 + 3] = H[j] & 255; }
    return out;
  }
  function logado() {
    var u = store.get("usuario", null);
    if (!u || !u.email) return false;
    if (HASH && u.k !== HASH.slice(0, 16)) { store.del("usuario"); return false; }
    return true;
  }
  /* trava contra tentativas repetidas: 5 erros bloqueiam por 1 min, e o tempo dobra a cada novo bloqueio */
  function bloqueio() { var t = store.get("tentativas", { n: 0, ate: 0, nivel: 0 }); return t; }
  function registraErro() {
    var t = bloqueio(); t.n++;
    if (t.n >= 5) { t.nivel++; t.ate = Date.now() + 60000 * Math.pow(2, t.nivel - 1); t.n = 0; }
    store.set("tentativas", t); return t;
  }
  function telaLogin() {
    $("#app").hidden = true; $("#login").hidden = false;
    var q = new URLSearchParams(location.search);
    if (q.get("email")) $("#lg-email").value = q.get("email");
    if (q.get("codigo")) $("#lg-codigo").value = q.get("codigo");
    if (q.has("codigo") || q.has("email")) history.replaceState(null, "", location.pathname + location.hash); // tira o código da barra de endereço e do histórico
    if (!HASH) $("#lg-codigo-wrap").hidden = true;
  }
  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#lg-email").value.trim().toLowerCase(), cod = $("#lg-codigo").value.trim().toUpperCase();
    var err = $("#lg-erro"), btn = e.target.querySelector("button[type=submit]");
    var t = bloqueio();
    if (t.ate > Date.now()) { err.textContent = "Muitas tentativas. Aguarde " + Math.ceil((t.ate - Date.now()) / 60000) + " min e tente de novo."; return; }
    if (email.length > 120 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = "Digite um e-mail válido."; return; }
    if (HASH && (!cod || cod.length > 40)) { err.textContent = "Digite o código de acesso."; return; }
    btn.disabled = true;
    (HASH ? sha256("kdn:" + cod) : Promise.resolve("")).then(function (h) {
      btn.disabled = false;
      if (HASH && h !== HASH) {
        var tt = registraErro();
        err.textContent = tt.ate > Date.now() ? "Muitas tentativas. Aguarde alguns minutos e tente de novo." : "Código de acesso incorreto. Confira o e-mail da compra.";
        return;
      }
      store.del("tentativas");
      store.set("usuario", { email: email, desde: hoje(), k: HASH.slice(0, 16) });
      err.textContent = "";
      history.replaceState(null, "", location.pathname + "#/inicio");
      iniciar();
    });
  });

  /* ---------------- navegação ---------------- */
  var NAV = [
    ["inicio", "🏠", "Início"], ["receitas", "🍫", "Receitas"], ["calculadora", "🧮", "Calculadora"], ["cardapios", "📜", "Cardápios"],
    ["mensagens", "💬", "Mensagens"], ["legendas", "📸", "Legendas"], ["etiquetas", "🏷️", "Etiquetas"], ["encomendas", "📋", "Encomendas"],
    ["bonus", "🎁", "Bônus"], ["comunidade", "🤝", "Comunidade"], ["perfil", "👤", "Meu perfil"]
  ];
  var BOTTOM = ["inicio", "receitas", "calculadora", "encomendas"];
  function montarNav() {
    $("#side-nav").innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '" data-r="' + n[0] + '"><span>' + n[1] + "</span>" + n[2] + "</a>"; }).join("");
    $("#bottomnav").innerHTML = NAV.filter(function (n) { return BOTTOM.indexOf(n[0]) > -1; }).map(function (n) { return '<a href="#/' + n[0] + '" data-r="' + n[0] + '"><span>' + n[1] + "</span>" + n[2] + "</a>"; }).join("") +
      '<button type="button" id="menu-btn"><span>☰</span>Menu</button>';
    $("#menu-btn").addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
    $("#side-backdrop").addEventListener("click", function () { document.body.classList.remove("menu-open"); });
  }
  var BONUS_ROTAS = ["treinamento", "sabores", "checklist", "calendario", "artes"];
  function rota() {
    var h = location.hash.replace(/^#\/?/, "") || "inicio";
    var qi = h.indexOf("?"); var params = new URLSearchParams(qi > -1 ? h.slice(qi + 1) : "");
    var parts = (qi > -1 ? h.slice(0, qi) : h).split("/");
    return { nome: parts[0], arg: decodeURIComponent(parts[1] || ""), params: params };
  }
  function render() {
    if (!logado()) { telaLogin(); return; }
    var r = rota(); var fn = VIEWS[r.nome] || VIEWS.inicio;
    document.body.classList.remove("menu-open");
    var ativo = r.nome === "receita" ? "receitas" : BONUS_ROTAS.indexOf(r.nome) > -1 ? "bonus" : r.nome;
    $$("[data-r]").forEach(function (a) { a.classList.toggle("on", a.dataset.r === ativo); });
    // contêiner novo a cada tela: descarta os ouvintes de eventos da tela anterior
    var old = $("#view"), v = old.cloneNode(false); old.replaceWith(v); v.className = "view view--" + r.nome;
    fn(v, r);
    if (r.nome === "inicio") mostraInstalar();
    window.scrollTo(0, 0);
    v.focus({ preventScroll: true });
  }
  function head(eyebrow, titulo, sub, voltar) {
    return (voltar ? '<a class="back" href="' + voltar + '">← Voltar</a>' : "") +
      '<header class="page-head"><span class="eyebrow">' + eyebrow + "</span><h1>" + titulo + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</header>";
  }

  /* ---------------- progresso ---------------- */
  function progresso() {
    var feitas = store.get("feitas", []).length;
    var aulas = store.get("aulas", []).length;
    var check = store.get("check", {}); var totalCheck = 0;
    (C.checklist || []).forEach(function (g) { totalCheck += g.itens.length; });
    var marcados = Object.keys(check).filter(function (k) { return check[k]; }).length;
    return { feitas: feitas, aulas: aulas, totalAulas: (C.treinamento || []).length, check: marcados, totalCheck: totalCheck };
  }

  /* =========================================================
     VIEWS
     ========================================================= */
  var VIEWS = {};

  /* ---------- INÍCIO ---------- */
  VIEWS.inicio = function (v) {
    var p = perfil(), pr = progresso();
    var pct = Math.round(((pr.aulas / (pr.totalAulas || 1)) + (pr.check / (pr.totalCheck || 1)) + Math.min(pr.feitas / 5, 1)) / 3 * 100);
    var modulos = [
      ["receitas", "Receitas Natalinas", RECEITAS.length + " receitas passo a passo"],
      ["calculadora", "Calculadora de Preços", "Custo, preço e lucro automáticos"],
      ["cardapios", "Cardápios Editáveis", "Edite e baixe como imagem"],
      ["mensagens", "Mensagens WhatsApp", (C.mensagens || []).length + " textos prontos"],
      ["legendas", "Legendas e Posts", "Feed, stories e reels"],
      ["etiquetas", "Etiquetas e Tags", "Personalize e imprima"],
      ["encomendas", "Organizador de Encomendas", "Pedidos, produção e pagamentos"],
      ["bonus", "Bônus Exclusivos", "Treinamento, sabores, checklist e mais"]
    ];
    v.innerHTML =
      '<section class="welcome"><img class="welcome-bg" src="' + IMG + 'banner-boas-vindas.webp" alt="" aria-hidden="true">' +
      '<div class="welcome-copy"><span class="hand">Que bom ter você aqui!</span><h1>Olá' + (p.nome ? ", " + esc(p.nome.split(" ")[0]) : "") + '! <em>Vamos adoçar este Natal?</em></h1>' +
      "<p>Tudo do Kit Doce Natal está aqui dentro. Siga os 4 passos abaixo e comece a vender.</p>" +
      '<div class="progress-wrap"><div class="progress-bar"><i style="width:' + pct + '%"></i></div><span>' + pct + "% do kit explorado</span></div></div></section>" +
      avisoPerfil() +
      '<h2 class="sec-title">Comece por aqui</h2><div class="steps">' +
      step(1, "Preencha seu perfil", "Nome da loja, WhatsApp e Pix entram em todos os textos.", "#/perfil") +
      step(2, "Escolha suas receitas", "Favorite de 5 a 8 doces para o seu cardápio.", "#/receitas") +
      step(3, "Calcule os preços", "Descubra quanto cobrar em cada doce.", "#/calculadora") +
      step(4, "Monte o cardápio e divulgue", "Baixe a imagem e use as mensagens prontas.", "#/cardapios") +
      '</div><h2 class="sec-title">Seu kit</h2><div class="modules">' +
      modulos.map(function (m) {
        return '<a class="module" href="#/' + m[0] + '"><div class="module-img"><img src="' + IMG + "modulo-" + m[0] + '.webp" alt="' + esc(m[1]) + '" width="800" height="450" loading="lazy" decoding="async"></div><div class="module-txt"><strong>' + m[1] + "</strong><span>" + m[2] + "</span></div></a>";
      }).join("") + "</div>" +
      '<div class="stats"><div><b>' + pr.feitas + "</b>receitas feitas</div><div><b>" + pr.aulas + "/" + pr.totalAulas + "</b>aulas concluídas</div><div><b>" + pr.check + "/" + pr.totalCheck + "</b>itens do checklist</div><div><b>" + store.get("encomendas", []).length + "</b>encomendas anotadas</div></div>";
    function step(n, t, d, href) { return '<a class="step" href="' + href + '"><b>' + n + "</b><div><strong>" + t + "</strong><span>" + d + "</span></div><i>→</i></a>"; }
  };

  /* ---------- RECEITAS ---------- */
  var filtroRec = { q: "", cat: "Todas", fav: false };
  VIEWS.receitas = function (v) {
    var cats = ["Todas"]; RECEITAS.forEach(function (r) { if (cats.indexOf(r.categoria) < 0) cats.push(r.categoria); });
    v.innerHTML = head("RECEITAS NATALINAS", "Receitas que <em>vendem no Natal</em>", RECEITAS.length + " receitas com rendimento, validade, embalagem e custo calculado com um clique.") +
      '<div class="toolbar"><input class="search" type="search" id="rq" placeholder="Buscar receita ou ingrediente…" value="' + esc(filtroRec.q) + '">' +
      '<button type="button" class="chip' + (filtroRec.fav ? " on" : "") + '" id="rfav">♥ Favoritas</button></div>' +
      '<div class="chips" id="rcats">' + cats.map(function (c) { return '<button type="button" class="chip' + (c === filtroRec.cat ? " on" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>" +
      '<div class="rgrid" id="rgrid"></div>';
    function lista() {
      var favs = store.get("favs", []), feitas = store.get("feitas", []), q = slug(filtroRec.q);
      var res = RECEITAS.filter(function (r) {
        if (filtroRec.cat !== "Todas" && r.categoria !== filtroRec.cat) return false;
        if (filtroRec.fav && favs.indexOf(r.id) < 0) return false;
        if (q) { var hay = slug(r.nome + " " + r.categoria + " " + r.ingredientes.map(function (i) { return i.item; }).join(" ")); if (hay.indexOf(q) < 0) return false; }
        return true;
      });
      $("#rgrid").innerHTML = res.length ? res.map(function (r) {
        return '<a class="rcard" href="#/receita/' + r.id + '"><div class="rcard-img"><img src="' + IMG + "receitas/mini/" + r.id + '.webp" alt="' + esc(r.nome) + '" width="480" height="360" loading="lazy" decoding="async">' +
          (favs.indexOf(r.id) > -1 ? '<span class="rfav">♥</span>' : "") + (feitas.indexOf(r.id) > -1 ? '<span class="rdone">✓ feita</span>' : "") + "</div>" +
          '<div class="rcard-body"><small>' + esc(r.categoria) + "</small><strong>" + esc(r.nome) + '</strong><div class="rmeta"><span>⏱ ' + esc(r.tempo) + "</span><span>🍽 " + esc(r.rendimento.qtd + " " + r.rendimento.unidade) + "</span><span>" + esc(r.dificuldade) + "</span></div></div></a>";
      }).join("") : '<p class="empty">Nenhuma receita encontrada. ' + (filtroRec.fav ? "Toque no ♥ dentro de uma receita para favoritar." : "Tente outra busca.") + "</p>";
    }
    $("#rq").addEventListener("input", function (e) { filtroRec.q = e.target.value; lista(); });
    $("#rfav").addEventListener("click", function (e) { filtroRec.fav = !filtroRec.fav; e.currentTarget.classList.toggle("on", filtroRec.fav); lista(); });
    $("#rcats").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      filtroRec.cat = b.dataset.cat; $$("#rcats .chip").forEach(function (c) { c.classList.toggle("on", c === b); }); lista();
    });
    lista();
  };

  VIEWS.receita = function (v, r) {
    var rec = RECEITAS.filter(function (x) { return x.id === r.arg; })[0];
    if (!rec) { v.innerHTML = head("RECEITAS", "Receita não encontrada", "", "#/receitas"); return; }
    var mult = 1;
    v.innerHTML = '<a class="back" href="#/receitas">← Todas as receitas</a>' +
      '<article class="recipe"><div class="recipe-hero"><img src="' + IMG + "receitas/" + rec.id + '.webp" alt="' + esc(rec.nome) + '" width="960" height="720" decoding="async"></div>' +
      '<div class="recipe-head"><span class="eyebrow">' + esc(rec.categoria.toUpperCase()) + "</span><h1>" + esc(rec.nome) + "</h1><p>" + esc(rec.resumo) + "</p>" +
      '<div class="rmeta big"><span>⏱ ' + esc(rec.tempo) + "</span><span>📊 " + esc(rec.dificuldade) + "</span><span>🗓 " + esc(rec.validade) + "</span></div>" +
      '<div class="recipe-actions"><button type="button" class="btn btn-sm" id="r-calc">🧮 Calcular o preço</button><button type="button" class="btn btn-sm btn-ghost" id="r-fav"></button><button type="button" class="btn btn-sm btn-ghost" id="r-done"></button><button type="button" class="btn btn-sm btn-ghost" id="r-print">🖨 Imprimir</button></div></div>' +
      '<div class="recipe-grid"><section class="card"><div class="card-head"><h2>Ingredientes</h2><label class="mult">Fazer <select id="r-mult"><option value="0.5">½ receita</option><option value="1" selected>1 receita</option><option value="2">2 receitas</option><option value="3">3 receitas</option><option value="4">4 receitas</option><option value="5">5 receitas</option></select></label></div>' +
      '<p class="yield" id="r-yield"></p><ul class="ingr" id="r-ingr"></ul></section>' +
      '<section class="card"><h2>Modo de preparo</h2><ol class="steps-list">' + rec.preparo.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol><p class=\"hint\">Toque em um passo para marcar como feito.</p></section></div>" +
      '<div class="recipe-grid three"><section class="card tip"><h3>💡 Dicas</h3><ul>' + rec.dicas.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="card tip"><h3>🎁 Embalagem</h3><p>' + esc(rec.embalagem) + '</p></section><section class="card tip"><h3>💰 Como vender</h3><p>' + esc(rec.venda) + "</p></section></div></article>";
    function ingr() {
      $("#r-yield").textContent = "Rende " + fmtQ(rec.rendimento.qtd * mult) + " " + rec.rendimento.unidade;
      $("#r-ingr").innerHTML = rec.ingredientes.map(function (i, k) {
        return '<li><label><input type="checkbox"><span><b>' + fmtQ(i.qtd * mult) + " " + esc(i.un) + "</b> " + esc(i.item) + "</span></label></li>";
      }).join("");
    }
    function botoes() {
      var favs = store.get("favs", []), feitas = store.get("feitas", []);
      $("#r-fav").textContent = favs.indexOf(rec.id) > -1 ? "♥ Favorita" : "♡ Favoritar";
      $("#r-done").textContent = feitas.indexOf(rec.id) > -1 ? "✓ Já fiz" : "Marcar como feita";
    }
    function alterna(chave, msg) {
      var l = store.get(chave, []), i = l.indexOf(rec.id);
      if (i > -1) l.splice(i, 1); else { l.push(rec.id); toast(msg); }
      store.set(chave, l); botoes();
    }
    $("#r-mult").addEventListener("change", function (e) { mult = num(e.target.value); ingr(); });
    $("#r-fav").addEventListener("click", function () { alterna("favs", "Adicionada às favoritas ♥"); });
    $("#r-done").addEventListener("click", function () { alterna("feitas", "Receita marcada como feita ✓"); });
    $("#r-print").addEventListener("click", function () { window.print(); });
    $("#r-calc").addEventListener("click", function () { location.hash = "#/calculadora?r=" + rec.id + "&m=" + mult; });
    $$(".steps-list li", v).forEach(function (li) { li.addEventListener("click", function () { li.classList.toggle("done"); }); });
    ingr(); botoes();
  };

  /* ---------- CALCULADORA ---------- */
  function calcVazia() { return { nome: "", rend: 10, emb: 0, gas: 8, horas: 1, hora: 20, margem: 60, itens: [{ item: "", usado: 0, un: "g", pq: 0, pp: 0 }] }; }
  VIEWS.calculadora = function (v, r) {
    var livro = store.get("precosIngredientes", {});
    var c = store.get("calcAtual", null) || calcVazia();
    var rid = r.params.get("r");
    if (rid) {
      var rec = RECEITAS.filter(function (x) { return x.id === rid; })[0];
      if (rec) {
        var m = num(r.params.get("m")) || 1;
        c = calcVazia(); c.nome = rec.nome; c.rend = Math.round(rec.rendimento.qtd * m * 10) / 10;
        c.itens = rec.ingredientes.map(function (i) {
          var l = livro[slug(i.item)] || {};
          return { item: i.item, usado: Math.round(i.qtd * m * 10) / 10, un: i.un, pq: l.pq || 0, pp: l.pp || 0 };
        });
        history.replaceState(null, "", location.pathname + "#/calculadora");
      }
    }
    v.innerHTML = head("CALCULADORA DE PREÇOS", "Quanto cobrar <em>em cada doce</em>", "Preencha o preço e o tamanho do pacote de cada ingrediente. Os valores ficam salvos e são reaproveitados nas próximas receitas.") +
      '<div class="calc"><section class="card"><div class="grid2"><label class="field">Produto<input id="c-nome" placeholder="Ex.: Brigadeiro gourmet"></label><label class="field">Rendimento (unidades)<input id="c-rend" type="number" min="0" step="any" inputmode="decimal"></label></div>' +
      '<h2>Ingredientes</h2><p class="hint">Use a mesma unidade no "usado" e no "pacote" (g com g, ml com ml). Para itens como "pitada", deixe o pacote vazio e digite direto o custo.</p>' +
      '<div class="ctable" id="c-itens"></div><button type="button" class="btn btn-sm btn-ghost" id="c-add">+ Adicionar ingrediente</button>' +
      '<h2>Outros custos</h2><div class="grid2"><label class="field">Embalagem por unidade (R$)<input id="c-emb" type="number" min="0" step="any" inputmode="decimal"></label><label class="field">Gás e energia (% sobre ingredientes)<input id="c-gas" type="number" min="0" step="any" inputmode="decimal"></label>' +
      '<label class="field">Horas de trabalho<input id="c-horas" type="number" min="0" step="any" inputmode="decimal"></label><label class="field">Quanto vale sua hora (R$)<input id="c-hora" type="number" min="0" step="any" inputmode="decimal"></label>' +
      '<label class="field">Margem de lucro (%)<input id="c-margem" type="number" min="0" step="any" inputmode="decimal"></label></div></section>' +
      '<aside class="card result" id="c-res"></aside></div>' +
      '<section class="card"><div class="card-head"><h2>Meus preços salvos</h2><button type="button" class="btn btn-sm btn-ghost" id="c-novo">Nova conta</button></div><div id="c-salvos"></div></section>';
    var campos = { nome: "#c-nome", rend: "#c-rend", emb: "#c-emb", gas: "#c-gas", horas: "#c-horas", hora: "#c-hora", margem: "#c-margem" };
    function carregarCampos() { Object.keys(campos).forEach(function (k) { $(campos[k]).value = c[k] || (k === "nome" ? "" : 0); }); }
    function linhas() {
      $("#c-itens").innerHTML = '<div class="crow chead"><span>Ingrediente</span><span>Usado</span><span>Un.</span><span>Pacote (qtd)</span><span>Pacote (R$)</span><span>Custo</span><span></span></div>' +
        c.itens.map(function (i, k) {
          return '<div class="crow" data-k="' + k + '"><input data-f="item" value="' + esc(i.item) + '" placeholder="Ingrediente" aria-label="Ingrediente">' +
            '<input data-f="usado" type="number" step="any" min="0" inputmode="decimal" value="' + (i.usado || "") + '" aria-label="Quantidade usada">' +
            '<input data-f="un" value="' + esc(i.un) + '" aria-label="Unidade">' +
            '<input data-f="pq" type="number" step="any" min="0" inputmode="decimal" value="' + (i.pq || "") + '" placeholder="ex.: 395" aria-label="Tamanho do pacote">' +
            '<input data-f="pp" type="number" step="any" min="0" inputmode="decimal" value="' + (i.pp || "") + '" placeholder="R$" aria-label="Preço do pacote">' +
            '<output data-o="' + k + '">' + brl(custoItem(i)) + '</output><button type="button" class="x" data-del="' + k + '" aria-label="Remover">×</button></div>';
        }).join("");
    }
    function custoItem(i) { return i.pq > 0 ? (i.pp / i.pq) * i.usado : i.pp; }
    function calcula() {
      var ing = c.itens.reduce(function (s, i) { return s + custoItem(i); }, 0);
      var gas = ing * c.gas / 100, mao = c.horas * c.hora, rend = c.rend > 0 ? c.rend : 1, emb = c.emb * rend;
      var total = ing + gas + emb + mao, un = total / rend, preco = un * (1 + c.margem / 100), sug = Math.ceil(preco * 2) / 2;
      c._preco = sug; c._custo = un;
      c.itens.forEach(function (i, k) { var o = $('[data-o="' + k + '"]'); if (o) o.textContent = brl(custoItem(i)); });
      $("#c-res").innerHTML = '<h2>Resultado</h2><div class="rline"><span>Ingredientes</span><b>' + brl(ing) + '</b></div><div class="rline"><span>Gás e energia</span><b>' + brl(gas) + '</b></div><div class="rline"><span>Embalagens</span><b>' + brl(emb) + '</b></div><div class="rline"><span>Sua mão de obra</span><b>' + brl(mao) + '</b></div><div class="rline total"><span>Custo total</span><b>' + brl(total) + "</b></div>" +
        '<div class="rline"><span>Custo por unidade</span><b>' + brl(un) + '</b></div><div class="price-box"><small>Preço sugerido por unidade</small><strong>' + brl(sug) + "</strong><span>(cálculo exato: " + brl(preco) + ")</span></div>" +
        '<div class="rline good"><span>Lucro por unidade</span><b>' + brl(sug - un) + '</b></div><div class="rline good"><span>Você ganha nesta produção</span><b>' + brl((sug - un) * rend + mao) + "</b></div>" +
        '<p class="hint">Inclui sua mão de obra + lucro. Compare com o preço praticado na sua região antes de fechar.</p><button type="button" class="btn btn-block" id="c-salvar">Salvar este preço</button>';
      store.set("calcAtual", c);
    }
    function salvos() {
      var l = store.get("precosSalvos", []);
      $("#c-salvos").innerHTML = l.length ? '<div class="saved">' + l.map(function (s, k) {
        return '<div class="saved-row"><div><strong>' + esc(s.nome || "Sem nome") + "</strong><small>Custo " + brl(s._custo) + " · rende " + fmtQ(s.rend) + '</small></div><b>' + brl(s._preco) + '</b><button type="button" class="btn btn-sm btn-ghost" data-load="' + k + '">Abrir</button><button type="button" class="btn btn-sm btn-ghost" data-rm="' + k + '">Excluir</button></div>';
      }).join("") + "</div>" : '<p class="empty">Nenhum preço salvo ainda. Faça uma conta e toque em "Salvar este preço".</p>';
    }
    v.addEventListener("input", function (e) {
      var t = e.target, row = t.closest(".crow[data-k]");
      if (row) {
        var i = c.itens[+row.dataset.k], f = t.dataset.f;
        i[f] = f === "item" || f === "un" ? t.value : num(t.value);
        if (i.item && (f === "pq" || f === "pp")) { livro[slug(i.item)] = { pq: i.pq, pp: i.pp }; store.set("precosIngredientes", livro); }
      } else {
        Object.keys(campos).forEach(function (k) { if (t.matches(campos[k])) c[k] = k === "nome" ? t.value : num(t.value); });
      }
      calcula();
    });
    v.addEventListener("click", function (e) {
      var t = e.target;
      if (t.id === "c-add") { c.itens.push({ item: "", usado: 0, un: "g", pq: 0, pp: 0 }); linhas(); calcula(); $("#c-itens .crow:last-child input").focus(); }
      else if (t.dataset.del != null) { c.itens.splice(+t.dataset.del, 1); if (!c.itens.length) c.itens.push(calcVazia().itens[0]); linhas(); calcula(); }
      else if (t.id === "c-salvar") {
        var l = store.get("precosSalvos", []), copia = JSON.parse(JSON.stringify(c)), idx = -1;
        l.forEach(function (s, k) { if (c.nome && s.nome === c.nome) idx = k; });
        if (idx > -1) l[idx] = copia; else l.unshift(copia);
        store.set("precosSalvos", l); salvos(); toast("Preço salvo em \"Meus preços\" ✓");
      }
      else if (t.id === "c-novo") { c = calcVazia(); carregarCampos(); linhas(); calcula(); }
      else if (t.dataset.load != null) { c = store.get("precosSalvos", [])[+t.dataset.load]; carregarCampos(); linhas(); calcula(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else if (t.dataset.rm != null) { confirma(t, function () { var l = store.get("precosSalvos", []); l.splice(+t.dataset.rm, 1); store.set("precosSalvos", l); salvos(); }); }
    });
    carregarCampos(); linhas(); calcula(); salvos();
  };

  /* ---------- ESTÚDIO (cardápios e artes) — prévia escalada + download PNG ---------- */
  function encaixar(stage, canvas, w) {
    function ajusta() { var s = stage.clientWidth / w; canvas.style.transform = "scale(" + s + ")"; stage.style.height = canvas.offsetHeight * s + "px"; }
    ajusta();
    if ("ResizeObserver" in window) new ResizeObserver(ajusta).observe(stage); else addEventListener("resize", ajusta);
  }
  /* o gerador de imagem (200 KB) só é baixado quando a pessoa pede a primeira imagem */
  var h2cPromessa;
  function carregaH2C() {
    if (window.html2canvas) return Promise.resolve();
    return h2cPromessa || (h2cPromessa = new Promise(function (ok, falha) {
      var s = document.createElement("script"); s.src = "vendor/html2canvas.min.js";
      s.onload = ok; s.onerror = function () { h2cPromessa = null; falha(); }; document.head.appendChild(s);
    }));
  }
  function baixarPNG(node, nome, btn) {
    var txt = btn.textContent; btn.textContent = "Gerando imagem…"; btn.disabled = true;
    carregaH2C().then(function () {
      return window.html2canvas(node, {
        scale: 1, useCORS: true, backgroundColor: null, width: node.offsetWidth, height: node.offsetHeight,
        onclone: function (doc) { var n = doc.getElementById(node.id); n.style.transform = "none"; }
      });
    }).then(function (cv) {
      return new Promise(function (ok) { cv.toBlob(ok, "image/png"); });
    }).then(function (blob) {
      var arq = window.File ? new File([blob], nome + ".png", { type: "image/png" }) : null;
      // no celular abre a janela de compartilhar (salvar na galeria, WhatsApp, Instagram...)
      if (arq && navigator.canShare && navigator.canShare({ files: [arq] })) {
        return navigator.share({ files: [arq], title: nome }).catch(function () {});
      }
      var url = URL.createObjectURL(blob), a = document.createElement("a");
      a.download = nome + ".png"; a.href = url; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast("Imagem baixada! Confira seus downloads 📥");
    }).catch(function () { toast(navigator.onLine === false ? "Conecte-se à internet uma vez para liberar o gerador de imagem." : "Não foi possível gerar a imagem. Tente de novo ou faça um print da tela."); })
      .then(function () { btn.textContent = txt; btn.disabled = false; });
  }

  VIEWS.cardapios = function (v) {
    var d = store.get("cardapio", null) || JSON.parse(JSON.stringify(C.cardapioPadrao));
    d.tema = d.tema || "classico";
    v.innerHTML = head("CARDÁPIOS EDITÁVEIS", "Monte seu cardápio <em>e baixe como imagem</em>", "Escolha um modelo, edite os textos e preços e baixe em alta resolução (1080×1920) para enviar no WhatsApp e postar nos stories.") + avisoPerfil() +
      '<div class="studio"><section class="card studio-form"><h2>1. Modelo</h2><div class="themes" id="m-temas">' +
      C.cardapios.map(function (t) { return '<button type="button" class="theme-btn tb-' + t.id + '" data-tema="' + t.id + '"><i></i>' + esc(t.nome) + "</button>"; }).join("") +
      '</div><h2>2. Textos</h2><label class="field">Título<input data-k="titulo"></label><label class="field">Subtítulo<input data-k="subtitulo"></label>' +
      '<div id="m-secoes"></div><button type="button" class="btn btn-sm btn-ghost" id="m-addsec">+ Adicionar categoria</button>' +
      '<label class="field">Rodapé<input data-k="rodape"></label><div class="studio-actions"><button type="button" class="btn btn-block" id="m-baixar">⬇ Baixar imagem do cardápio</button><button type="button" class="btn btn-sm btn-ghost" id="m-reset">Restaurar modelo</button></div></section>' +
      '<section class="studio-preview"><div class="stage" id="m-stage"><div class="mc" id="m-canvas"></div></div></section></div>';
    function form() {
      $$("[data-k]", v).forEach(function (i) { i.value = d[i.dataset.k] || ""; });
      $$("#m-temas [data-tema]").forEach(function (b) { b.classList.toggle("on", b.dataset.tema === d.tema); });
      $("#m-secoes").innerHTML = d.secoes.map(function (s, si) {
        return '<fieldset class="sec-edit" data-si="' + si + '"><div class="sec-edit-head"><input class="sec-name" data-sec="' + si + '" value="' + esc(s.nome) + '" aria-label="Nome da categoria"><button type="button" class="x" data-rmsec="' + si + '" aria-label="Remover categoria">×</button></div>' +
          s.itens.map(function (it, ii) {
            return '<div class="item-edit"><input data-it="' + si + "," + ii + ',0" value="' + esc(it[0]) + '" aria-label="Item"><input class="price" data-it="' + si + "," + ii + ',1" value="' + esc(it[1]) + '" aria-label="Preço"><button type="button" class="x" data-rmit="' + si + "," + ii + '" aria-label="Remover item">×</button></div>';
          }).join("") + '<button type="button" class="link" data-addit="' + si + '">+ item</button></fieldset>';
      }).join("");
    }
    function canvas() {
      var p = perfil(), el = $("#m-canvas");
      el.className = "mc mc--" + d.tema;
      el.style.setProperty("--img", "url(" + IMG + "fundo-cardapio-" + d.tema + ".webp)");
      el.innerHTML = '<div class="mc-inner"><div class="mc-brand">' + esc(p.loja || "Nome da sua loja") + '</div><div class="mc-orn">✦ ❄ ✦</div><h2 class="mc-title">' + esc(d.titulo) + '</h2><p class="mc-sub">' + esc(d.subtitulo) + "</p>" +
        d.secoes.map(function (s) {
          return '<div class="mc-sec"><h3>' + esc(s.nome) + "</h3><ul>" + s.itens.map(function (it) { return "<li><span>" + esc(it[0]) + "</span><i></i><b>" + esc(it[1]) + "</b></li>"; }).join("") + "</ul></div>";
        }).join("") +
        '<div class="mc-foot"><p>' + esc(d.rodape) + "</p><strong>" + (p.whats ? "📲 " + esc(p.whats) : "📲 Seu WhatsApp") + (p.instagram ? " · " + esc(p.instagram) : "") + "</strong></div></div>";
      store.set("cardapio", d);
    }
    v.addEventListener("input", function (e) {
      var t = e.target;
      if (t.dataset.k) d[t.dataset.k] = t.value;
      else if (t.dataset.sec != null) d.secoes[+t.dataset.sec].nome = t.value;
      else if (t.dataset.it) { var a = t.dataset.it.split(","); d.secoes[+a[0]].itens[+a[1]][+a[2]] = t.value; }
      canvas();
    });
    v.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.tema) { d.tema = t.dataset.tema; form(); }
      else if (t.id === "m-addsec") { d.secoes.push({ nome: "Nova categoria", itens: [["Novo item", "R$ 00,00"]] }); form(); }
      else if (t.dataset.rmsec != null) { d.secoes.splice(+t.dataset.rmsec, 1); form(); }
      else if (t.dataset.addit != null) { d.secoes[+t.dataset.addit].itens.push(["Novo item", "R$ 00,00"]); form(); }
      else if (t.dataset.rmit) { var a = t.dataset.rmit.split(","); d.secoes[+a[0]].itens.splice(+a[1], 1); form(); }
      else if (t.id === "m-reset") { confirma(t, function () { var tema = d.tema; d = JSON.parse(JSON.stringify(C.cardapioPadrao)); d.tema = tema; form(); canvas(); }); return; }
      else if (t.id === "m-baixar") { baixarPNG($("#m-canvas"), "cardapio-natal", t); return; }
      else return;
      canvas();
    });
    form(); canvas(); encaixar($("#m-stage"), $("#m-canvas"), 1080);
  };

  VIEWS.artes = function (v, r) {
    var lista = C.artes || [];
    var sel = lista.filter(function (a) { return a.id === r.arg; })[0];
    if (!sel) {
      v.innerHTML = head("BÔNUS · ARTES DE DATAS", "Artes prontas <em>para postar</em>", "Escolha uma arte, coloque o nome da sua loja e baixe para o feed ou para os stories.", "#/bonus") +
        '<div class="art-grid">' + lista.map(function (a) {
          return '<a class="art-card" href="#/artes/' + a.id + '"><div class="art-thumb ' + a.formato + '"><img src="' + IMG + "arte-" + a.id + '.webp" alt="' + esc(a.titulo) + '" loading="lazy"></div><strong>' + esc(a.titulo) + "</strong><small>" + (a.formato === "story" ? "Stories 9:16" : "Feed 4:5") + "</small></a>";
        }).join("") + "</div>";
      return;
    }
    var salvo = store.get("arte:" + sel.id, {});
    var d = { linha1: salvo.linha1 || sel.linha1, linha2: salvo.linha2 || sel.linha2, linha3: salvo.linha3 || sel.linha3 };
    var h = sel.formato === "story" ? 1920 : 1350;
    v.innerHTML = head("BÔNUS · ARTES DE DATAS", esc(sel.titulo), "Edite os textos e baixe a arte em 1080×" + h + ".", "#/artes") +
      '<div class="studio"><section class="card studio-form"><label class="field">Linha 1<input data-k="linha1"></label><label class="field">Destaque<input data-k="linha2"></label><label class="field">Linha final<input data-k="linha3"></label>' +
      '<div class="studio-actions"><button type="button" class="btn btn-block" id="a-baixar">⬇ Baixar arte</button></div><p class="hint">O nome da loja e o WhatsApp vêm do Meu perfil.</p></section>' +
      '<section class="studio-preview"><div class="stage" id="a-stage"><div class="ac ac--' + sel.formato + '" id="a-canvas"></div></div></section></div>';
    function canvas() {
      var p = perfil(), el = $("#a-canvas");
      el.style.setProperty("--img", "url(" + IMG + "arte-" + sel.id + ".webp)");
      el.innerHTML = '<div class="ac-inner"><span class="ac-l1">' + esc(d.linha1) + '</span><strong class="ac-l2">' + esc(d.linha2) + '</strong><span class="ac-l3">' + esc(d.linha3) + '</span><div class="ac-brand">' + esc(p.loja || "Nome da sua loja") + (p.whats ? "<small>📲 " + esc(p.whats) + "</small>" : "") + "</div></div>";
      store.set("arte:" + sel.id, d);
    }
    $$("[data-k]", v).forEach(function (i) { i.value = d[i.dataset.k]; i.addEventListener("input", function () { d[i.dataset.k] = i.value; canvas(); }); });
    $("#a-baixar").addEventListener("click", function (e) { baixarPNG($("#a-canvas"), "arte-" + sel.id, e.currentTarget); });
    canvas(); encaixar($("#a-stage"), $("#a-canvas"), 1080);
  };

  /* ---------- MENSAGENS E LEGENDAS ---------- */
  function listaTextos(v, cfg) {
    var cats = ["Todas"]; cfg.itens.forEach(function (m) { if (cats.indexOf(m[cfg.campo]) < 0) cats.push(m[cfg.campo]); });
    var atual = "Todas";
    v.innerHTML = head(cfg.eyebrow, cfg.titulo, cfg.sub) + avisoPerfil() +
      '<div class="chips" id="t-cats">' + cats.map(function (c) { return '<button type="button" class="chip' + (c === atual ? " on" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + '</div><div class="msgs" id="t-lista"></div>';
    function lista() {
      $("#t-lista").innerHTML = cfg.itens.map(function (m, k) {
        if (atual !== "Todas" && m[cfg.campo] !== atual) return "";
        var t = preencher(m.texto);
        return '<article class="msg"><header><small>' + esc(m[cfg.campo]) + "</small><strong>" + esc(m.titulo) + '</strong></header><pre>' + esc(t).replace(/\*([^*\n]+)\*/g, "<b>$1</b>") + '</pre><footer><button type="button" class="btn btn-sm" data-copy="' + k + '">Copiar</button>' +
          (cfg.whats ? '<a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(t) + '">Abrir no WhatsApp</a>' : "") + "</footer></article>";
      }).join("");
    }
    v.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (b) { atual = b.dataset.cat; $$("#t-cats .chip").forEach(function (c) { c.classList.toggle("on", c === b); }); lista(); return; }
      var cp = e.target.closest("[data-copy]"); if (cp) copiar(preencher(cfg.itens[+cp.dataset.copy].texto));
    });
    lista();
  }
  VIEWS.mensagens = function (v) {
    listaTextos(v, { itens: C.mensagens || [], campo: "cat", whats: true, eyebrow: "MENSAGENS PARA WHATSAPP", titulo: "Textos prontos <em>para cada momento</em>", sub: "Divulgação, atendimento, fechamento, entrega e pós-venda. Complete o que estiver entre [COLCHETES] e envie." });
  };
  VIEWS.legendas = function (v) {
    listaTextos(v, { itens: C.legendas || [], campo: "tipo", whats: false, eyebrow: "LEGENDAS E IDEIAS DE POST", titulo: "O que postar <em>para vender mais</em>", sub: "Legendas para o feed e roteiros simples de stories e reels." });
  };

  /* ---------- ETIQUETAS ---------- */
  VIEWS.etiquetas = function (v) {
    var p = perfil();
    var d = store.get("etiqueta", { tipo: "redonda", produto: "Brigadeiro Gourmet", ingredientes: "Leite condensado, chocolate, creme de leite, manteiga. Contém leite. Pode conter glúten.", fab: hoje(), validade: "5 dias", conserva: "Manter em local fresco e seco", msg: "Feito com amor para o seu Natal", qtd: 12 });
    v.innerHTML = head("ETIQUETAS E TAGS", "Etiquetas <em>prontas para imprimir</em>", "Personalize, confira a prévia e imprima em papel adesivo ou cartão. Dica: na janela de impressão, escolha \"Salvar como PDF\" para levar à gráfica.") + avisoPerfil() +
      '<div class="studio"><section class="card studio-form"><h2>Modelo</h2><div class="chips" id="e-tipos">' + C.etiquetas.map(function (t) { return '<button type="button" class="chip" data-tipo="' + t.id + '">' + esc(t.nome) + "</button>"; }).join("") + "</div>" +
      '<label class="field">Produto<input data-k="produto"></label><label class="field" data-only="validade">Ingredientes e alérgenos<textarea data-k="ingredientes" rows="3"></textarea></label>' +
      '<div class="grid2" data-only="validade"><label class="field">Fabricação<input type="date" data-k="fab"></label><label class="field">Validade<input data-k="validade"></label></div>' +
      '<label class="field" data-only="validade">Conservação<input data-k="conserva"></label><label class="field" data-only="redonda presente">Mensagem<input data-k="msg"></label>' +
      '<label class="field">Quantidade na folha<input type="number" min="1" max="60" data-k="qtd"></label><button type="button" class="btn btn-block" id="e-print">🖨 Imprimir etiquetas</button></section>' +
      '<section class="studio-preview"><div class="sheet print-area" id="e-sheet"></div></section></div>';
    function etiqueta() {
      var marca = esc(p.loja || "Nome da sua loja"), contato = esc([p.whats, p.instagram].filter(Boolean).join(" · "));
      if (d.tipo === "validade") return '<div class="lbl lbl-validade"><strong>' + esc(d.produto) + "</strong><p>" + esc(d.ingredientes) + '</p><div class="lbl-dates"><span>Fab.: ' + fmtData(d.fab) + "</span><span>Val.: " + esc(d.validade) + "</span></div><small>" + esc(d.conserva) + '</small><em>' + marca + (contato ? " · " + contato : "") + "</em></div>";
      if (d.tipo === "presente") return '<div class="lbl lbl-presente"><i class="hole"></i><span class="lbl-orn">🎄</span><strong>' + esc(d.msg) + "</strong><small>" + esc(d.produto) + "</small><em>" + marca + "</em></div>";
      return '<div class="lbl lbl-redonda"><span class="lbl-orn">✦ ❄ ✦</span><em>' + marca + "</em><strong>" + esc(d.produto) + "</strong><small>" + esc(d.msg) + "</small></div>";
    }
    function render() {
      $$("[data-k]", v).forEach(function (i) { if (document.activeElement !== i) i.value = d[i.dataset.k]; });
      $$("#e-tipos .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.tipo === d.tipo); });
      $$("[data-only]", v).forEach(function (el) { el.hidden = el.dataset.only.split(" ").indexOf(d.tipo) < 0; });
      var n = Math.max(1, Math.min(60, Math.round(num(d.qtd)) || 1)), html = "";
      for (var i = 0; i < n; i++) html += etiqueta();
      $("#e-sheet").className = "sheet print-area sheet--" + d.tipo; $("#e-sheet").innerHTML = html;
      store.set("etiqueta", d);
    }
    v.addEventListener("input", function (e) { if (e.target.dataset.k) { d[e.target.dataset.k] = e.target.value; render(); } });
    $("#e-tipos").addEventListener("click", function (e) { var b = e.target.closest("[data-tipo]"); if (b) { d.tipo = b.dataset.tipo; render(); } });
    $("#e-print").addEventListener("click", function () { window.print(); });
    render();
  };

  /* ---------- ENCOMENDAS ---------- */
  var STATUS = ["Novo", "Confirmado", "Em produção", "Pronto", "Entregue", "Cancelado"];
  var filtroEnc = { aba: "pedidos", status: "Ativos" };
  function totalPedido(o) { return o.itens.reduce(function (s, i) { return s + num(i.qtd) * num(i.preco); }, 0); }
  VIEWS.encomendas = function (v) {
    var lista = store.get("encomendas", []);
    v.innerHTML = head("ORGANIZADOR DE ENCOMENDAS", "Todas as encomendas <em>em um só lugar</em>", "Anote os pedidos, acompanhe pagamentos e veja quanto produzir de cada doce.") +
      '<div class="enc-top"><div class="tabs" id="enc-abas"><button type="button" data-aba="pedidos">Pedidos</button><button type="button" data-aba="producao">Lista de produção</button><button type="button" data-aba="resumo">Resumo financeiro</button></div>' +
      '<button type="button" class="btn" id="enc-novo">+ Nova encomenda</button></div><div id="enc-corpo"></div>' +
      '<dialog class="dlg" id="enc-dlg"><form method="dialog" id="enc-form"></form></dialog>';
    var dlg = $("#enc-dlg");
    function salvar() { store.set("encomendas", lista); }
    function corpo() {
      $$("#enc-abas button").forEach(function (b) { b.classList.toggle("on", b.dataset.aba === filtroEnc.aba); });
      var el = $("#enc-corpo");
      if (filtroEnc.aba === "pedidos") {
        var filtros = ["Ativos", "Todos"].concat(STATUS);
        var ls = lista.filter(function (o) {
          if (filtroEnc.status === "Todos") return true;
          if (filtroEnc.status === "Ativos") return o.status !== "Entregue" && o.status !== "Cancelado";
          return o.status === filtroEnc.status;
        }).sort(function (a, b) { return (a.data || "9999") < (b.data || "9999") ? -1 : 1; });
        el.innerHTML = '<div class="chips" id="enc-filtros">' + filtros.map(function (f) { return '<button type="button" class="chip' + (f === filtroEnc.status ? " on" : "") + '" data-st="' + f + '">' + f + "</button>"; }).join("") + "</div>" +
          (ls.length ? '<div class="orders">' + ls.map(function (o) {
            var tot = totalPedido(o), falta = tot - num(o.pago);
            return '<article class="order st-' + slug(o.status).replace(/\s/g, "-") + '"><header><div><strong>' + esc(o.cliente || "Sem nome") + "</strong><small>📅 " + fmtData(o.data) + (o.hora ? " às " + esc(o.hora) : "") + " · " + esc(o.tipo) + '</small></div><span class="badge">' + esc(o.status) + "</span></header>" +
              "<ul>" + o.itens.map(function (i) { return "<li>" + fmtQ(num(i.qtd)) + "× " + esc(i.produto) + "</li>"; }).join("") + "</ul>" +
              (o.endereco ? '<p class="addr">📍 ' + esc(o.endereco) + "</p>" : "") + (o.obs ? '<p class="addr">📝 ' + esc(o.obs) + "</p>" : "") +
              '<div class="money"><span>Total <b>' + brl(tot) + "</b></span><span>Pago <b>" + brl(num(o.pago)) + "</b></span><span class=\"" + (falta > 0.009 ? "due" : "ok") + '">' + (falta > 0.009 ? "Falta <b>" + brl(falta) + "</b>" : "✓ Quitado") + "</span></div>" +
              '<footer><button type="button" class="btn btn-sm" data-next="' + o.id + '">' + (STATUS.indexOf(o.status) < 4 ? "Avançar: " + STATUS[STATUS.indexOf(o.status) + 1] : "Concluído") + '</button><button type="button" class="btn btn-sm btn-ghost" data-edit="' + o.id + '">Editar</button>' +
              (o.fone ? '<a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="https://wa.me/' + o.fone.replace(/\D/g, "").replace(/^(?!55)(\d{10,11})$/, "55$1") + "?text=" + encodeURIComponent(resumoMsg(o)) + '">WhatsApp</a>' : "") +
              '<button type="button" class="btn btn-sm btn-ghost" data-rm="' + o.id + '">Excluir</button></footer></article>';
          }).join("") + "</div>" : '<p class="empty">Nenhuma encomenda aqui. Toque em "+ Nova encomenda" para anotar a primeira.</p>');
      } else if (filtroEnc.aba === "producao") {
        var ate = filtroEnc.ate || "";
        var agg = {};
        lista.forEach(function (o) {
          if (o.status === "Entregue" || o.status === "Cancelado" || o.status === "Pronto") return;
          if (ate && o.data && o.data > ate) return;
          o.itens.forEach(function (i) { var k = i.produto.trim() || "Sem nome"; agg[k] = (agg[k] || 0) + num(i.qtd); });
        });
        var ks = Object.keys(agg).sort();
        el.innerHTML = '<section class="card"><div class="card-head"><h2>O que produzir</h2><label class="field inline">Entregas até<input type="date" id="enc-ate" value="' + ate + '"></label></div><p class="hint">Soma dos pedidos com status Novo, Confirmado e Em produção.</p>' +
          (ks.length ? '<ul class="prod">' + ks.map(function (k) { return "<li><span>" + esc(k) + "</span><b>" + fmtQ(agg[k]) + "</b></li>"; }).join("") + "</ul>" : '<p class="empty">Nada para produzir neste período.</p>') + "</section>";
      } else {
        var val = lista.filter(function (o) { return o.status !== "Cancelado"; });
        var fat = val.reduce(function (s, o) { return s + totalPedido(o); }, 0), rec = val.reduce(function (s, o) { return s + Math.min(num(o.pago), totalPedido(o)); }, 0);
        var lucro = store.get("margemMedia", 40);
        el.innerHTML = '<div class="kpis"><div><small>Pedidos</small><b>' + val.length + "</b></div><div><small>Faturamento</small><b>" + brl(fat) + "</b></div><div><small>Já recebido</small><b>" + brl(rec) + '</b></div><div class="due"><small>A receber</small><b>' + brl(fat - rec) + "</b></div></div>" +
          '<section class="card"><h2>Lucro estimado</h2><label class="field inline">Margem média dos seus produtos (%)<input type="number" min="0" max="100" id="enc-margem" value="' + lucro + '"></label><p class="big-num" id="enc-lucro">' + brl(fat * lucro / 100) + '</p><p class="hint">Use a margem média que a calculadora mostrou para os seus produtos.</p></section>' +
          '<button type="button" class="btn btn-ghost" id="enc-csv">⬇ Exportar planilha (CSV)</button>';
      }
    }
    function resumoMsg(o) {
      return preencher("Olá, " + (o.cliente || "") + "! Aqui é da {loja} 💛\n\n*Resumo da sua encomenda:*\n" + o.itens.map(function (i) { return "• " + fmtQ(num(i.qtd)) + "× " + i.produto; }).join("\n") +
        "\n💰 Total: " + brl(totalPedido(o)) + (num(o.pago) ? "\n✅ Pago: " + brl(num(o.pago)) : "") + "\n📅 " + o.tipo + ": " + fmtData(o.data) + (o.hora ? " às " + o.hora : "") + (o.endereco ? "\n📍 " + o.endereco : "") + "\n\nPix: {pix}");
    }
    function form(o) {
      var produtos = RECEITAS.map(function (r) { return r.nome; }).concat(store.get("precosSalvos", []).map(function (s) { return s.nome; })).filter(Boolean);
      $("#enc-form").innerHTML = "<h2>" + (o.id ? "Editar encomenda" : "Nova encomenda") + '</h2><datalist id="enc-produtos">' + produtos.map(function (p) { return '<option value="' + esc(p) + '">'; }).join("") + "</datalist>" +
        '<div class="grid2"><label class="field">Cliente<input name="cliente" required value="' + esc(o.cliente) + '"></label><label class="field">WhatsApp da cliente<input name="fone" inputmode="tel" value="' + esc(o.fone) + '" placeholder="(11) 99999-9999"></label></div>' +
        '<h3>Itens</h3><div id="enc-itens">' + o.itens.map(itemRow).join("") + '</div><button type="button" class="link" id="enc-additem">+ item</button>' +
        '<div class="grid2"><label class="field">Data<input type="date" name="data" value="' + esc(o.data) + '"></label><label class="field">Horário<input type="time" name="hora" value="' + esc(o.hora) + '"></label>' +
        '<label class="field">Tipo<select name="tipo"><option' + (o.tipo === "Retirada" ? " selected" : "") + ">Retirada</option><option" + (o.tipo === "Entrega" ? " selected" : "") + '>Entrega</option></select></label><label class="field">Status<select name="status">' + STATUS.map(function (s) { return "<option" + (o.status === s ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></label></div>" +
        '<label class="field">Endereço<input name="endereco" value="' + esc(o.endereco) + '"></label><div class="grid2"><label class="field">Valor já pago (R$)<input type="number" step="any" min="0" name="pago" value="' + (o.pago || "") + '"></label><div class="field"><span>Total do pedido</span><output id="enc-total" class="big-num sm"></output></div></div>' +
        '<label class="field">Observações<textarea name="obs" rows="2">' + esc(o.obs) + '</textarea></label><div class="dlg-actions"><button type="button" class="btn btn-ghost" value="cancel" id="enc-cancel">Cancelar</button><button type="submit" class="btn" value="ok">Salvar encomenda</button></div>';
      var f = $("#enc-form");
      function totalForm() { var t = 0; $$(".item-edit", f).forEach(function (r) { t += num(r.querySelector("[name=qtd]").value) * num(r.querySelector("[name=preco]").value); }); $("#enc-total").textContent = brl(t); }
      f.oninput = totalForm;
      $("#enc-additem").onclick = function () { $("#enc-itens").insertAdjacentHTML("beforeend", itemRow({ produto: "", qtd: 1, preco: "" })); };
      $("#enc-itens").onclick = function (e) { if (e.target.dataset.rmrow != null) { e.target.closest(".item-edit").remove(); totalForm(); } };
      $("#enc-cancel").onclick = function () { dlg.close(); };
      f.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(f), novo = { id: o.id || uid(), itens: [] };
        ["cliente", "fone", "data", "hora", "tipo", "status", "endereco", "pago", "obs"].forEach(function (k) { novo[k] = fd.get(k) || ""; });
        $$(".item-edit", f).forEach(function (r) { var pdt = r.querySelector("[name=produto]").value.trim(); if (pdt) novo.itens.push({ produto: pdt, qtd: num(r.querySelector("[name=qtd]").value), preco: num(r.querySelector("[name=preco]").value) }); });
        var idx = lista.map(function (x) { return x.id; }).indexOf(novo.id);
        if (idx > -1) lista[idx] = novo; else lista.push(novo);
        salvar(); dlg.close(); corpo(); toast("Encomenda salva ✓");
      };
      totalForm();
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    }
    function itemRow(i) {
      return '<div class="item-edit"><input name="produto" list="enc-produtos" placeholder="Produto" value="' + esc(i.produto) + '"><input name="qtd" type="number" step="any" min="0" class="qty" value="' + (i.qtd || "") + '" aria-label="Quantidade"><input name="preco" type="number" step="any" min="0" class="price" placeholder="R$ un." value="' + (i.preco || "") + '" aria-label="Preço unitário"><button type="button" class="x" data-rmrow aria-label="Remover">×</button></div>';
    }
    function csv() {
      var linhas = [["Cliente", "WhatsApp", "Data", "Horário", "Tipo", "Status", "Itens", "Total", "Pago", "Falta", "Endereço", "Obs"]];
      lista.forEach(function (o) { var t = totalPedido(o); linhas.push([o.cliente, o.fone, fmtData(o.data), o.hora, o.tipo, o.status, o.itens.map(function (i) { return i.qtd + "x " + i.produto; }).join(" | "), t.toFixed(2).replace(".", ","), num(o.pago).toFixed(2).replace(".", ","), (t - num(o.pago)).toFixed(2).replace(".", ","), o.endereco, o.obs]); });
      var txt = "﻿" + linhas.map(function (l) { return l.map(function (c) { return '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/csv;charset=utf-8" })); a.download = "encomendas-natal.csv"; a.click();
    }
    v.addEventListener("click", function (e) {
      var t = e.target;
      if (t.dataset.aba) { filtroEnc.aba = t.dataset.aba; corpo(); }
      else if (t.dataset.st) { filtroEnc.status = t.dataset.st; corpo(); }
      else if (t.id === "enc-novo") form({ cliente: "", fone: "", data: "", hora: "", tipo: "Retirada", status: "Confirmado", endereco: "", pago: "", obs: "", itens: [{ produto: "", qtd: 1, preco: "" }] });
      else if (t.dataset.edit) form(JSON.parse(JSON.stringify(lista.filter(function (o) { return o.id === t.dataset.edit; })[0])));
      else if (t.dataset.next) { var o = lista.filter(function (x) { return x.id === t.dataset.next; })[0], i = STATUS.indexOf(o.status); if (i < 4) { o.status = STATUS[i + 1]; salvar(); corpo(); toast("Status: " + o.status); } }
      else if (t.dataset.rm && t.closest(".order")) confirma(t, function () { lista = lista.filter(function (x) { return x.id !== t.dataset.rm; }); salvar(); corpo(); });
      else if (t.id === "enc-csv") csv();
    });
    v.addEventListener("input", function (e) {
      if (e.target.id === "enc-ate") { filtroEnc.ate = e.target.value; corpo(); }
      if (e.target.id === "enc-margem") { store.set("margemMedia", num(e.target.value)); var val = lista.filter(function (o) { return o.status !== "Cancelado"; }); $("#enc-lucro").textContent = brl(val.reduce(function (s, o) { return s + totalPedido(o); }, 0) * num(e.target.value) / 100); }
    });
    corpo();
  };

  /* ---------- BÔNUS ---------- */
  VIEWS.bonus = function (v) {
    var b = [
      ["treinamento", "Mini Treinamento", (C.treinamento || []).length + " aulas rápidas de precificação e vendas"],
      ["sabores", "Guia de Sabores", (C.sabores || []).length + " combinações que vendem"],
      ["checklist", "Checklist de Produção", "Marque cada etapa até a entrega"],
      ["calendario", "Calendário de Divulgação", "O que postar em cada semana"],
      ["artes", "Artes de Datas", (C.artes || []).length + " artes editáveis para baixar"]
    ];
    v.innerHTML = head("BÔNUS EXCLUSIVOS", "Seus <em>5 bônus</em>", "Ferramentas extras para vender mais e se organizar melhor.") +
      '<div class="modules">' + b.map(function (m) {
        return '<a class="module" href="#/' + m[0] + '"><div class="module-img"><img src="' + IMG + "modulo-bonus-" + m[0] + '.webp" alt="' + esc(m[1]) + '" width="800" height="450" loading="lazy" decoding="async"></div><div class="module-txt"><small class="tag">BÔNUS</small><strong>' + m[1] + "</strong><span>" + m[2] + "</span></div></a>";
      }).join("") + "</div>";
  };
  VIEWS.treinamento = function (v) {
    var feitas = store.get("aulas", []);
    v.innerHTML = head("BÔNUS · MINI TREINAMENTO", "Venda com <em>segurança</em>", "Aulas rápidas para ler em poucos minutos.", "#/bonus") +
      '<div class="lessons">' + C.treinamento.map(function (a, k) {
        var ok = feitas.indexOf(k) > -1;
        return '<details class="lesson' + (ok ? " ok" : "") + '"' + (k === 0 ? " open" : "") + '><summary><span class="ln">' + (ok ? "✓" : k + 1) + "</span>" + esc(a.titulo) + '</summary><div class="lesson-body">' + a.html + '<button type="button" class="btn btn-sm" data-aula="' + k + '">' + (ok ? "Concluída ✓" : "Marcar como concluída") + "</button></div></details>";
      }).join("") + "</div>";
    v.addEventListener("click", function (e) {
      var b = e.target.closest("[data-aula]"); if (!b) return;
      var k = +b.dataset.aula, l = store.get("aulas", []), i = l.indexOf(k);
      if (i > -1) l.splice(i, 1); else l.push(k);
      store.set("aulas", l); var on = i < 0;
      b.textContent = on ? "Concluída ✓" : "Marcar como concluída";
      var d = b.closest("details"); d.classList.toggle("ok", on); d.querySelector(".ln").textContent = on ? "✓" : k + 1;
      if (on) { toast("Aula concluída 🎉"); var nx = d.nextElementSibling; if (nx) { d.open = false; nx.open = true; } }
    });
  };
  VIEWS.sabores = function (v) {
    v.innerHTML = head("BÔNUS · GUIA DE SABORES", "Combinações <em>que vendem</em>", "Use como recheio, cobertura ou para criar versões novas das receitas do kit.", "#/bonus") +
      '<input class="search" type="search" id="s-q" placeholder="Buscar sabor ou produto…"><div class="flavors" id="s-lista"></div>';
    function lista(q) {
      q = slug(q || "");
      $("#s-lista").innerHTML = C.sabores.filter(function (s) { return !q || slug(s.nome + s.base + s.par + s.uso).indexOf(q) > -1; }).map(function (s) {
        return '<article class="flavor"><strong>' + esc(s.nome) + "</strong><p><span>Base</span>" + esc(s.base) + "</p><p><span>Combina com</span>" + esc(s.par) + "</p><p><span>Use em</span>" + esc(s.uso) + "</p></article>";
      }).join("");
    }
    $("#s-q").addEventListener("input", function (e) { lista(e.target.value); });
    lista();
  };
  function listaMarcavel(v, cfg) {
    var marc = store.get(cfg.chave, {});
    function pct() { var t = 0, m = 0; cfg.grupos.forEach(function (g, gi) { cfg.itens(g).forEach(function (x, ii) { t++; if (marc[gi + "-" + ii]) m++; }); }); return { t: t, m: m }; }
    v.innerHTML = head(cfg.eyebrow, cfg.titulo, cfg.sub, "#/bonus") + '<div class="progress-wrap light"><div class="progress-bar"><i id="ck-bar"></i></div><span id="ck-txt"></span></div>' +
      '<div class="checkgroups">' + cfg.grupos.map(function (g, gi) {
        return '<section class="card checkgroup"><h2>' + cfg.titulo_g(g) + "</h2>" + cfg.itens(g).map(function (it, ii) {
          var k = gi + "-" + ii; return '<label class="check"><input type="checkbox" data-ck="' + k + '"' + (marc[k] ? " checked" : "") + "><span>" + esc(it) + "</span></label>";
        }).join("") + "</section>";
      }).join("") + '</div><button type="button" class="btn btn-sm btn-ghost" id="ck-reset">Desmarcar tudo</button>';
    function barra() { var p = pct(); $("#ck-bar").style.width = (p.m / p.t * 100) + "%"; $("#ck-txt").textContent = p.m + " de " + p.t + " concluídos"; }
    v.addEventListener("change", function (e) { var k = e.target.dataset.ck; if (k) { marc[k] = e.target.checked; store.set(cfg.chave, marc); barra(); } });
    $("#ck-reset").addEventListener("click", function (e) { confirma(e.currentTarget, function () { marc = {}; store.set(cfg.chave, marc); render(); }); });
    barra();
  }
  VIEWS.checklist = function (v) {
    listaMarcavel(v, { chave: "check", grupos: C.checklist, itens: function (g) { return g.itens; }, titulo_g: function (g) { return esc(g.grupo); }, eyebrow: "BÔNUS · CHECKLIST DE PRODUÇÃO", titulo: "Nada fica <em>para trás</em>", sub: "Marque cada etapa. Seu progresso fica salvo neste aparelho." });
  };
  VIEWS.calendario = function (v) {
    listaMarcavel(v, { chave: "cal", grupos: C.calendario, itens: function (g) { return g.acoes; }, titulo_g: function (g) { return '<small class="tag">' + esc(g.semana) + "</small>" + esc(g.tema); }, eyebrow: "BÔNUS · CALENDÁRIO DE DIVULGAÇÃO", titulo: "O que postar <em>em cada semana</em>", sub: "Siga semana a semana até o Natal. Use as mensagens e legendas prontas do kit." });
  };

  /* ---------- COMUNIDADE ---------- */
  VIEWS.comunidade = function (v) {
    var wpp = KIT.whatsappSuporte ? "https://wa.me/" + KIT.whatsappSuporte + "?text=" + encodeURIComponent("Olá! Sou aluna do Kit Doce Natal e preciso de ajuda.") : "";
    v.innerHTML = head("COMUNIDADE E SUPORTE", "Você não está <em>sozinha</em>", "Troque dicas com outras alunas e fale com o nosso suporte.") +
      '<div class="support"><section class="card"><span class="big-emoji">🤝</span><h2>Comunidade de alunas</h2><p>Grupo exclusivo para compartilhar fotos, tirar dúvidas e celebrar as vendas.</p>' +
      (KIT.linkGrupoComunidade ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(KIT.linkGrupoComunidade) + '">Entrar no grupo</a>' : '<p class="hint">O link do grupo será liberado em breve.</p>') + "</section>" +
      '<section class="card"><span class="big-emoji">💌</span><h2>Suporte</h2><p>Dúvidas sobre o acesso ou o conteúdo? Fale com a gente.</p><a class="btn btn-ghost" href="mailto:' + esc(KIT.emailSuporte) + '">' + esc(KIT.emailSuporte) + "</a>" +
      (wpp ? '<a class="btn" target="_blank" rel="noopener" href="' + wpp + '">Suporte no WhatsApp</a>' : "") + "</section></div>";
  };

  /* ---------- PERFIL ---------- */
  VIEWS.perfil = function (v) {
    var p = perfil(), u = store.get("usuario", {});
    var campos = [["nome", "Seu nome", "Maria"], ["loja", "Nome da loja", "Doces da Maria"], ["whats", "WhatsApp", "(11) 99999-9999"], ["instagram", "Instagram", "@docesdamaria"], ["cidade", "Cidade", "Campinas"], ["pix", "Chave Pix", "seu@email.com ou CPF"]];
    v.innerHTML = head("MEU PERFIL", "Seus dados <em>nos materiais</em>", "Essas informações entram automaticamente nas mensagens, legendas, cardápios, artes e etiquetas.") +
      '<section class="card narrow"><form id="p-form">' + campos.map(function (c) { return '<label class="field">' + c[1] + '<input name="' + c[0] + '" value="' + esc(p[c[0]]) + '" placeholder="' + c[2] + '"></label>'; }).join("") +
      '<button class="btn btn-block" type="submit">Salvar perfil</button></form></section>' +
      '<section class="card narrow"><h2>Conta</h2><p>Acesso liberado para <strong>' + esc(u.email) + "</strong>.</p><p class=\"hint\">Seus dados (encomendas, preços, progresso) ficam salvos neste navegador. Para usar em outro aparelho, exporte as encomendas em CSV.</p>" +
      '<div class="row-btns"><button type="button" class="btn btn-sm btn-ghost" id="p-sair">Sair</button><button type="button" class="btn btn-sm btn-ghost" id="p-apagar">Apagar todos os meus dados</button></div></section>';
    $("#p-form").addEventListener("submit", function (e) {
      e.preventDefault(); var fd = new FormData(e.target), n = {};
      campos.forEach(function (c) { n[c[0]] = (fd.get(c[0]) || "").trim(); });
      store.set("perfil", n); toast("Perfil salvo ✓"); atualizaTopo();
    });
    $("#p-sair").addEventListener("click", function () { store.del("usuario"); location.hash = ""; render(); });
    $("#p-apagar").addEventListener("click", function (e) {
      confirma(e.currentTarget, function () {
        try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf("kdn:") === 0) localStorage.removeItem(k); }); } catch (err) {}
        location.hash = ""; render();
      });
    });
  };

  /* ---------------- início ---------------- */
  function atualizaTopo() { var p = perfil(); $("#top-user").textContent = p.nome ? p.nome.split(" ")[0] : "Meu perfil"; }
  var montado = false;
  function iniciar() {
    var sp = $("#splash"); if (sp) sp.remove();
    if (!logado()) { telaLogin(); return; }
    $("#login").hidden = true; $("#app").hidden = false;
    if (!montado) { montarNav(); addEventListener("hashchange", render); montado = true; }
    atualizaTopo(); render();
    aquecerCache();
  }

  /* ---------------- app instalável (PWA) ---------------- */
  var sw = "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1");
  if (sw) {
    addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function (e) { console.warn("[Kit] service worker", e); });
    });
  }
  /* depois que a pessoa entra, guarda o resto das imagens para usar offline — só no Wi-Fi/4G e sem "economia de dados" */
  function aquecerCache() {
    if (!sw || store.get("aquecido", "") === "v1") return;
    var con = navigator.connection || {};
    if (con.saveData || /2g/.test(con.effectiveType || "")) return;
    setTimeout(function () {
      navigator.serviceWorker.ready.then(function (reg) {
        if (!reg.active) return;
        var urls = [];
        RECEITAS.forEach(function (r) { urls.push(IMG + "receitas/mini/" + r.id + ".webp", IMG + "receitas/" + r.id + ".webp"); });
        ["receitas", "calculadora", "cardapios", "mensagens", "legendas", "etiquetas", "encomendas", "bonus"].forEach(function (m) { urls.push(IMG + "modulo-" + m + ".webp"); });
        BONUS_ROTAS.forEach(function (m) { urls.push(IMG + "modulo-bonus-" + m + ".webp"); });
        (C.cardapios || []).forEach(function (t) { urls.push(IMG + "fundo-cardapio-" + t.id + ".webp"); });
        (C.artes || []).forEach(function (a) { urls.push(IMG + "arte-" + a.id + ".webp"); });
        reg.active.postMessage({ tipo: "aquecer", urls: urls });
        store.set("aquecido", "v1");
      });
    }, 6000);
  }

  var pedidoInstalar = null;
  function standalone() { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; }
  function ehIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); pedidoInstalar = e; mostraInstalar(); });
  addEventListener("appinstalled", function () { pedidoInstalar = null; store.set("instalado", true); var b = $("#instalar"); if (b) b.remove(); toast("App instalado! Procure o ícone Doce Natal na tela inicial 🎄"); });
  /* cartão "Instalar o app" no topo do Início */
  function cartaoInstalar() {
    if (standalone() || store.get("instalado", false) || store.get("instalarFechado", 0) > Date.now()) return "";
    if (pedidoInstalar) return '<section class="install" id="instalar"><span class="install-ic">📲</span><div><strong>Instale o app no seu celular</strong><span>Abre direto da tela inicial, mais rápido e funciona até sem internet.</span></div><button type="button" class="btn btn-sm" data-instalar>Instalar</button><button type="button" class="x" data-fechar-inst aria-label="Fechar">×</button></section>';
    if (ehIOS()) return '<section class="install" id="instalar"><span class="install-ic">📲</span><div><strong>Coloque o app na tela inicial</strong><span>No Safari, toque em <b>Compartilhar</b> <span aria-hidden="true">⎋</span> e depois em <b>Adicionar à Tela de Início</b>.</span></div><button type="button" class="x" data-fechar-inst aria-label="Fechar">×</button></section>';
    return "";
  }
  function mostraInstalar() {
    if ($("#instalar") || rota().nome !== "inicio" || !logado()) return;
    var html = cartaoInstalar(); if (!html) return;
    var v = $("#view"); v.insertAdjacentHTML("afterbegin", html);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-instalar]") && pedidoInstalar) {
      pedidoInstalar.prompt();
      pedidoInstalar.userChoice.then(function () { pedidoInstalar = null; var b = $("#instalar"); if (b) b.remove(); });
    } else if (e.target.closest("[data-fechar-inst]")) {
      store.set("instalarFechado", Date.now() + 7 * 864e5); var b = $("#instalar"); if (b) b.remove();
    }
  });
  addEventListener("offline", function () { toast("Você está sem internet. O kit continua funcionando 💛"); });

  iniciar();
})();
