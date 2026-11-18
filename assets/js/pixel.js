/* Meta Pixel do Natalê (ID em assets/js/kit.js → pixelMeta).
   PageView em toda página, ViewContent na oferta e InitiateCheckout ao clicar em qualquer botão de compra.
   A Purchase é disparada pela Cakto na página de obrigado (configure o mesmo ID no produto da Cakto).
   O script do Facebook só carrega depois da primeira interação ou 2,5 s após a página abrir, para não pesar no carregamento. */
(function () {
  var K = window.KIT || {}, id = K.pixelMeta;
  if (!id) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    var go = function () { if (go.ok) return; go.ok = 1; (b.head || b.documentElement).appendChild(t); };
    ["scroll", "pointerdown", "touchstart", "keydown"].forEach(function (ev) { addEventListener(ev, go, { once: true, passive: true }); });
    addEventListener("load", function () { setTimeout(go, 2500); });
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  var valor = parseFloat(String(K.preco || "").replace(/[^\d,]/g, "").replace(",", ".")) || undefined;
  var dados = { content_name: K.nome || "Natalê", content_type: "product", currency: "BRL", value: valor };
  fbq("init", id);
  fbq("track", "PageView");
  if (document.documentElement.hasAttribute("data-pixel-oferta")) fbq("track", "ViewContent", dados);

  var enviado = false;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".checkout-link, [data-checkout]");
    if (!a || enviado) return;
    enviado = true; // uma vez por visita de página
    fbq("track", "InitiateCheckout", dados);
  }, true);
})();
