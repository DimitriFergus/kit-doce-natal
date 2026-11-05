/* ===========================================================
   KIT DOCE NATAL — service worker do app (PWA)
   Troque VERSAO sempre que publicar mudanças na área de membros:
   o celular baixa os arquivos novos e apaga o cache antigo.
   =========================================================== */
var VERSAO = "kdn-2026-11-04b";
var CACHE = VERSAO + "-app", CACHE_IMG = "kdn-img-v1";

/* o mínimo para o app abrir offline (cerca de 300 KB) */
var ESSENCIAL = [
  "./", "./index.html", "./app.js", "./membros.css", "./manifest.webmanifest",
  "./data/receitas.js", "./data/conteudo.js",
  "./icons/icon-192.png", "./icons/apple-touch-icon.png",
  "../assets/js/kit.js", "../assets/css/base.css", "../assets/fonts/fonts.css",
  "../assets/fonts/poppins-400.woff2", "../assets/fonts/poppins-500.woff2", "../assets/fonts/poppins-600.woff2",
  "../assets/fonts/poppins-700.woff2", "../assets/fonts/poppins-800.woff2",
  "../assets/fonts/playfairdisplay-i600.woff2", "../assets/fonts/caveat-700.woff2",
  "../assets/img/membros/banner-boas-vindas.webp"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ESSENCIAL.map(function (u) {
      return fetch(new Request(u, { cache: "reload" })).then(function (r) {
        if (!r.ok) throw new Error("não baixou " + u);
        return c.put(u, r);
      });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE && k !== CACHE_IMG; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function ehImagemOuFonte(url) { return /\.(webp|png|jpe?g|svg|woff2)$/i.test(url.pathname); }

self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  // só cuida de GET do próprio site; o resto passa direto
  if (req.method !== "GET" || url.origin !== location.origin) return;

  // páginas: tenta a rede (até 4 s) e cai no cache quando está offline ou lento
  if (req.mode === "navigate") {
    e.respondWith(new Promise(function (ok) {
      var feito = false;
      var t = setTimeout(function () { caches.match("./index.html", { cacheName: CACHE }).then(function (r) { if (r && !feito) { feito = true; ok(r); } }); }, 4000);
      fetch(req).then(function (r) {
        clearTimeout(t);
        if (r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put("./index.html", cp); }); }
        if (!feito) { feito = true; ok(r); }
      }).catch(function () {
        clearTimeout(t);
        caches.match("./index.html", { cacheName: CACHE }).then(function (r) { if (!feito) { feito = true; ok(r || new Response("Sem conexão", { status: 503 })); } });
      });
    }));
    return;
  }

  // imagens e fontes: cache primeiro (não mudam)
  if (ehImagemOuFonte(url)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (r) {
        if (r.ok) { var cp = r.clone(); caches.open(CACHE_IMG).then(function (c) { c.put(req, cp); }); }
        return r;
      });
    }));
    return;
  }

  // JS, CSS e dados: responde do cache na hora e atualiza em segundo plano
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      var rede = fetch(req).then(function (r) { if (r.ok) c.put(req, r.clone()); return r; }).catch(function () { return hit; });
      if (hit) { e.waitUntil(rede); return hit; }
      return rede;
    });
  }));
});

/* o app pede para guardar o resto das imagens quando o celular está à toa */
self.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.tipo === "aquecer" && Array.isArray(d.urls)) {
    e.waitUntil(caches.open(CACHE_IMG).then(function (c) {
      return d.urls.reduce(function (p, u) {
        var abs = new URL(u, self.registration.scope);
        if (abs.origin !== location.origin) return p;
        return p.then(function () { return c.match(abs).then(function (hit) { return hit || fetch(abs).then(function (r) { if (r.ok) return c.put(abs, r); }).catch(function () {}); }); });
      }, Promise.resolve());
    }));
  }
});
