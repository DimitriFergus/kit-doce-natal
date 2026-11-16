/* ===========================================================
   NATALÊ · conta da aluna (login com senha + dados salvos na nuvem)
   Liga sozinho quando KIT.supabaseUrl e KIT.supabaseChavePublica estão
   preenchidos em assets/js/kit.js. Vazio = continua o login antigo por código.

   Segurança:
   - A chave pública (publishable/anon) PODE ficar no site: ela só dá o que as
     regras do banco (RLS) deixam. Cada aluna só enxerga as próprias linhas.
   - A chave secreta (service_role / sb_secret) NUNCA entra aqui: ela vive só
     no servidor do Supabase (webhook de compra).
   =========================================================== */
(function () {
  "use strict";
  var KIT = window.KIT || {};
  var URL_SB = String(KIT.supabaseUrl || "").trim(), CHAVE = String(KIT.supabaseChavePublica || "").trim();
  /* trava extra: se alguém colar a chave secreta aqui por engano, o app recusa usar */
  function chaveSecreta(k) {
    if (/^sb_secret_/i.test(k)) return true;
    try { var p = JSON.parse(atob(k.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); return p.role === "service_role"; } catch (e) { return false; }
  }
  var ativo = !!(URL_SB && CHAVE && window.supabase && window.supabase.createClient);
  if (ativo && chaveSecreta(CHAVE)) { ativo = false; console.error("[Natalê] A chave em kit.js é a SECRETA. Troque pela chave pública (publishable/anon) e gere uma nova chave secreta no Supabase."); }
  if (ativo && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(URL_SB.replace(/\/+$/, ""))) { ativo = false; console.error("[Natalê] supabaseUrl inválida em kit.js"); }

  /* o que vai para a nuvem (o resto, como "app instalado", fica só no aparelho) */
  var SINC = ["perfil", "foto", "encomendas", "precosSalvos", "precosIngredientes", "margemMedia", "favs", "feitas", "check", "aulas", "cardapio", "etiqueta", "calcAtual"];

  /* chegou por link de e-mail (convite, recuperar senha) ou link vencido? lê antes do Supabase limpar o endereço */
  var h = location.hash || "";
  var tipoLink = /[#&]type=(recovery|invite|signup|magiclink)/.exec(h);
  var erroLink = /[#&]error_description=([^&]*)/.exec(h);
  var linkInfo = { pedeSenha: !!(tipoLink && /recovery|invite/.test(tipoLink[1])), erro: erroLink ? decodeURIComponent(erroLink[1].replace(/\+/g, " ")) : "" };

  var sb = null;
  if (ativo) {
    sb = window.supabase.createClient(URL_SB.replace(/\/+$/, ""), CHAVE, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "kdn-sessao" }
    });
  }
  /* sessão pronta (inclusive a que veio pelo link do e-mail) */
  var pronto = ativo ? sb.auth.getSession().then(function (r) { return r.data.session; }, function () { return null; }) : Promise.resolve(null);
  if (/access_token=|error_description=/.test(h)) pronto.then(function () { history.replaceState(null, "", location.pathname + location.search + "#/inicio"); });

  var uid = null, fila = {}, timer = null, aplicando = false;
  pronto.then(function (s) { uid = s && s.user ? s.user.id : null; });
  if (ativo) sb.auth.onAuthStateChange(function (ev, s) { uid = s && s.user ? s.user.id : null; });

  function ls(k) { try { return localStorage.getItem("kdn:" + k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v === null || v === undefined) localStorage.removeItem("kdn:" + k); else localStorage.setItem("kdn:" + k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- envio para a nuvem (junta várias alterações em 1,5 s) ---------- */
  function agendar(chave, valor) {
    if (!ativo || aplicando || SINC.indexOf(chave) < 0) return;
    fila[chave] = valor === undefined ? null : valor;
    clearTimeout(timer); timer = setTimeout(enviar, 1500);
  }
  function enviar() {
    if (!uid) return Promise.resolve();
    var lote = fila; fila = {};
    var sobe = [], apaga = [];
    Object.keys(lote).forEach(function (k) { if (lote[k] === null) apaga.push(k); else sobe.push({ user_id: uid, chave: k, valor: lote[k] }); });
    var p = [];
    if (sobe.length) p.push(sb.from("dados_aluno").upsert(sobe, { onConflict: "user_id,chave" }));
    if (apaga.length) p.push(sb.from("dados_aluno").delete().eq("user_id", uid).in("chave", apaga));
    return Promise.all(p).then(function (rs) {
      var falhou = rs.some(function (r) { return r && r.error; });
      if (falhou) { Object.keys(lote).forEach(function (k) { if (!(k in fila)) fila[k] = lote[k]; }); clearTimeout(timer); timer = setTimeout(enviar, 15000); }
    }, function () { Object.keys(lote).forEach(function (k) { if (!(k in fila)) fila[k] = lote[k]; }); clearTimeout(timer); timer = setTimeout(enviar, 15000); });
  }
  /* não perde a última alteração quando a aluna fecha o app */
  addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden" && Object.keys(fila).length) { clearTimeout(timer); enviar(); } });
  addEventListener("online", function () { if (Object.keys(fila).length) enviar(); });

  /* ---------- traz os dados da nuvem (no login e ao abrir o app) ---------- */
  function puxar() {
    if (!uid) return Promise.resolve(false);
    return sb.from("dados_aluno").select("chave,valor").then(function (r) {
      if (r.error) return false;
      var nuvem = {}; (r.data || []).forEach(function (l) { nuvem[l.chave] = l.valor; });
      aplicando = true;
      SINC.forEach(function (k) {
        if (k in nuvem) lsSet(k, nuvem[k]);
        else if (ls(k) !== null) { aplicando = false; try { agendar(k, JSON.parse(ls(k))); } catch (e) {} aplicando = true; } /* primeiro login: sobe o que já estava no aparelho */
      });
      aplicando = false;
      return true;
    });
  }

  function erroAmigavel(e) {
    var m = String((e && e.message) || e || "");
    if (/invalid login credentials/i.test(m)) return "E-mail ou senha incorretos.";
    if (/email not confirmed/i.test(m)) return "Confirme o seu e-mail pelo link que enviamos.";
    if (/rate limit|too many/i.test(m)) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
    if (/password.*(short|least|characters)|weak/i.test(m)) return "A senha precisa ter pelo menos 8 caracteres, com letras e números.";
    if (/same.*password|different from the old/i.test(m)) return "A nova senha precisa ser diferente da anterior.";
    if (/fetch|network|failed to/i.test(m)) return "Sem conexão. Verifique a internet e tente de novo.";
    return "Não foi possível concluir. Tente de novo em instantes.";
  }
  function temAcesso() {
    return sb.rpc("tem_acesso").then(function (r) { if (r.error) throw r.error; return r.data === true; });
  }

  window.CONTA = {
    ativo: ativo,
    link: linkInfo,
    sincroniza: SINC,
    pronto: pronto,
    agendar: agendar,
    puxar: puxar,
    erro: erroAmigavel,
    /* entra com e-mail e senha e confere se a compra está aprovada */
    entrar: function (email, senha) {
      return sb.auth.signInWithPassword({ email: email, password: senha }).then(function (r) {
        if (r.error) throw r.error;
        uid = r.data.user.id;
        return temAcesso().then(function (ok) {
          if (!ok) return sb.auth.signOut().then(function () { uid = null; throw new Error("SEM_COMPRA"); });
          return { email: r.data.user.email };
        });
      });
    },
    /* "primeiro acesso" e "esqueci a senha": manda o link por e-mail (não diz se o e-mail existe) */
    enviarLink: function (email) {
      var volta = location.origin + location.pathname;
      return sb.auth.resetPasswordForEmail(email, { redirectTo: volta }).then(function (r) { if (r.error) throw r.error; });
    },
    definirSenha: function (senha) {
      return sb.auth.updateUser({ password: senha }).then(function (r) {
        if (r.error) throw r.error;
        uid = r.data.user.id;
        return temAcesso().then(function (ok) { if (!ok) return sb.auth.signOut().then(function () { throw new Error("SEM_COMPRA"); }); return { email: r.data.user.email }; });
      });
    },
    /* ao abrir o app: a sessão continua válida e a compra continua aprovada? (offline = deixa entrar) */
    verificar: function () {
      return pronto.then(function (s) {
        if (!s) return sb.auth.getSession().then(function (r) { return r.data.session ? "ok" : "sair"; });
        return temAcesso().then(function (ok) { return ok ? "ok" : "sair"; }, function (e) { return /fetch|network|failed/i.test(String(e && e.message)) ? "offline" : "ok"; });
      });
    },
    sair: function () {
      clearTimeout(timer);
      return (Object.keys(fila).length ? enviar() : Promise.resolve()).then(function () { return sb.auth.signOut(); }, function () { return sb.auth.signOut(); })
        .then(function () { uid = null; SINC.forEach(function (k) { lsSet(k, null); }); });
    },
    /* "Apagar todos os meus dados" também apaga da nuvem */
    apagarTudo: function () {
      clearTimeout(timer); fila = {};
      if (!uid) return Promise.resolve();
      return sb.from("dados_aluno").delete().eq("user_id", uid).then(function () { return sb.auth.signOut(); });
    }
  };
})();
