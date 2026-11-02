/* ===========================================================
   KIT DOCE NATAL — interações das páginas de oferta
   =========================================================== */
(function () {
  var KIT = window.KIT || {};
  var page = document.body.dataset.oferta || "1";

  /* preços vindos da configuração */
  var map = { "data-preco": KIT.preco, "data-preco-completo": KIT.precoCompleto, "data-preco-de": KIT.precoDe, "data-parcelas": KIT.parcelas };
  Object.keys(map).forEach(function (attr) {
    if (!map[attr]) return;
    document.querySelectorAll("[" + attr + "]").forEach(function (el) { el.textContent = map[attr]; });
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.textContent = KIT.emailSuporte; el.href = "mailto:" + KIT.emailSuporte;
  });

  /* checkout com repasse de UTMs */
  var checkout = page === "2" ? KIT.checkoutOferta2 || KIT.checkoutOferta1 : KIT.checkoutOferta1;
  if (checkout) {
    try {
      var url = new URL(checkout);
      new URLSearchParams(location.search).forEach(function (v, k) {
        if (/^(utm_|src|sck|fbclid|gclid|ttclid|xcod)/.test(k)) url.searchParams.set(k, v);
      });
      document.querySelectorAll(".checkout-link").forEach(function (a) { a.href = url.toString(); });
    } catch (err) { console.warn("[Kit] checkout inválido em assets/js/kit.js", err); }
  } else {
    console.warn("[Kit] Configure o link do checkout em assets/js/kit.js");
  }

  /* vídeo */
  var frame = document.querySelector("[data-video]");
  if (frame && KIT.videoEmbed) {
    frame.innerHTML = '<iframe src="' + KIT.videoEmbed + '" title="Demonstração do Kit Doce Natal" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }

  /* carrosséis: duplica os cards para o loop infinito */
  document.querySelectorAll(".carousel-track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var c = card.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });
  });
  document.querySelectorAll(".ribbon-track,.topbar-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* revelação ao rolar */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("visible"); });
  }

  /* barra fixa de compra no celular */
  var sticky = document.querySelector(".sticky-buy");
  var hero = document.querySelector(".hero-direct,.hero-split");
  var offer = document.getElementById("oferta-final");
  if (sticky && hero) {
    var onScroll = function () {
      var pastHero = hero.getBoundingClientRect().bottom < 0;
      var r = offer ? offer.getBoundingClientRect() : null;
      var atOffer = r && r.top < innerHeight && r.bottom > 0;
      sticky.classList.toggle("show", pastHero && !atOffer);
    };
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* neve */
  var snow = document.getElementById("snow");
  if (snow && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var n = innerWidth < 700 ? 14 : 26;
    for (var i = 0; i < n; i++) {
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

  var y = document.getElementById("ano");
  if (y) y.textContent = new Date().getFullYear();
})();
