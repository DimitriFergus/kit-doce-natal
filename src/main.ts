/* Kit Doce Natal — interações e animações */

// Troque pelo link do seu checkout (Hotmart, Kiwify, etc.)
const CHECKOUT_URL = "";

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Checkout: repassa UTMs da URL ---------- */
function setupCheckout(): void {
  if (!CHECKOUT_URL) return;
  const url = new URL(CHECKOUT_URL);
  new URLSearchParams(location.search).forEach((v, k) => url.searchParams.set(k, v));
  $$<HTMLAnchorElement>(".js-checkout").forEach((a) => (a.href = url.toString()));
}

/* ---------- Header encolhe + CTA fixo ---------- */
function setupScrollUI(): void {
  const header = $<HTMLElement>("#header");
  const sticky = $<HTMLElement>("#stickyCta");
  const offer = $<HTMLElement>("#oferta");
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 30);
    if (sticky && offer) {
      const r = offer.getBoundingClientRect();
      const offerOnScreen = r.top < innerHeight && r.bottom > 0;
      sticky.classList.toggle("is-visible", y > innerHeight * 0.9 && !offerOnScreen);
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Menu mobile ---------- */
function setupMenu(): void {
  const burger = $<HTMLButtonElement>("#burger");
  const nav = $<HTMLElement>("#nav");
  if (!burger || !nav) return;
  const toggle = (open: boolean) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggle(!nav.classList.contains("is-open")));
  $$<HTMLAnchorElement>("a", nav).forEach((a) => a.addEventListener("click", () => toggle(false)));
}

/* ---------- Reveal ao rolar (com escalonamento) ---------- */
function setupReveal(): void {
  const items = $$<HTMLElement>(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  // escalona elementos irmãos
  items.forEach((el) => {
    const siblings = el.parentElement ? $$<HTMLElement>(":scope > .reveal", el.parentElement) : [];
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", `${Math.min(i * 0.08, 0.5)}s`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

/* ---------- Contadores numéricos ---------- */
function animateCount(el: HTMLElement): void {
  const target = Number(el.dataset.count ?? 0);
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const duration = 1600;
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setupCounters(): void {
  const els = $$<HTMLElement>("[data-count]");
  if (reduceMotion) {
    els.forEach((el) => (el.textContent = `${el.dataset.prefix ?? ""}${el.dataset.count}${el.dataset.suffix ?? ""}`));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target as HTMLElement); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
}

/* ---------- Carrossel arrastável com inércia ---------- */
class DragCarousel {
  private track: HTMLElement;
  private x = 0;
  private velocity = 0;
  private startX = 0;
  private lastX = 0;
  private dragging = false;
  private moved = false;
  private raf = 0;
  private autoplay: boolean;
  private hovering = false;

  constructor(private root: HTMLElement) {
    this.track = $<HTMLElement>(".carousel__track", root)!;
    this.autoplay = root.hasAttribute("data-autoplay") && !reduceMotion;
    root.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerup", this.onUp);
    root.addEventListener("pointerenter", () => (this.hovering = true));
    root.addEventListener("pointerleave", () => (this.hovering = false));
    root.addEventListener("click", (e) => { if (this.moved) e.preventDefault(); }, true);
    window.addEventListener("resize", () => this.clamp());
    this.loop();
  }

  private get min(): number {
    return Math.min(0, this.root.clientWidth - this.track.scrollWidth);
  }

  private clamp(): void {
    this.x = Math.max(this.min, Math.min(0, this.x));
    this.render();
  }

  private render(): void {
    this.track.style.transform = `translate3d(${this.x}px,0,0)`;
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = true;
    this.moved = false;
    this.startX = this.lastX = e.clientX;
    this.velocity = 0;
    this.root.classList.add("is-dragging");
  };

  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    if (Math.abs(e.clientX - this.startX) > 5) this.moved = true;
    this.lastX = e.clientX;
    this.velocity = dx;
    const next = this.x + dx;
    // resistência elástica nas bordas
    this.x = next > 0 || next < this.min ? this.x + dx * 0.35 : next;
    this.render();
  };

  private onUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.root.classList.remove("is-dragging");
  };

  private loop = () => {
    if (!this.dragging) {
      if (this.autoplay && !this.hovering && Math.abs(this.velocity) < 0.5) {
        this.x -= 0.5;
        if (this.x <= this.min) this.x = 0;
      } else {
        this.x += this.velocity;
        this.velocity *= 0.94;
      }
      // volta suave para os limites
      if (this.x > 0) this.x += (0 - this.x) * 0.15;
      if (this.x < this.min) this.x += (this.min - this.x) * 0.15;
      this.render();
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}

/* ---------- Tilt 3D no mockup ---------- */
function setupTilt(): void {
  if (reduceMotion || matchMedia("(hover: none)").matches) return;
  $$<HTMLElement>(".tilt").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

/* ---------- Parallax leve no hero ---------- */
function setupParallax(): void {
  if (reduceMotion) return;
  const floaties = $$<HTMLElement>(".floaties span");
  const content = $<HTMLElement>(".hero__content");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > innerHeight) return;
    floaties.forEach((f, i) => (f.style.translate = `0 ${y * (0.15 + i * 0.06)}px`));
    if (content) {
      content.style.translate = `0 ${y * 0.25}px`;
      content.style.opacity = String(1 - y / (innerHeight * 0.9));
    }
  }, { passive: true });
}

/* ---------- FAQ com abertura suave ---------- */
function setupFaq(): void {
  const all = $$<HTMLDetailsElement>(".faq details");
  all.forEach((d) => {
    const summary = $<HTMLElement>("summary", d)!;
    const body = document.createElement("div");
    body.className = "faq__body";
    while (summary.nextSibling) body.appendChild(summary.nextSibling);
    d.appendChild(body);

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        body.style.height = `${body.scrollHeight}px`;
        requestAnimationFrame(() => (body.style.height = "0px"));
        body.addEventListener("transitionend", () => (d.open = false), { once: true });
      } else {
        all.forEach((o) => { if (o !== d && o.open) $<HTMLElement>("summary", o)?.click(); });
        d.open = true;
        body.style.height = "0px";
        requestAnimationFrame(() => (body.style.height = `${body.scrollHeight}px`));
        body.addEventListener("transitionend", () => (body.style.height = "auto"), { once: true });
      }
    });
  });
}

/* ---------- Contagem regressiva para o Natal ---------- */
function setupCountdown(): void {
  const ids = ["cd-d", "cd-h", "cd-m", "cd-s"].map((id) => document.getElementById(id));
  if (ids.some((el) => !el)) return;
  const now = new Date();
  let target = new Date(now.getFullYear(), 11, 25);
  if (now > target) target = new Date(now.getFullYear() + 1, 11, 25);
  const pad = (n: number) => String(n).padStart(2, "0");

  const tick = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    const parts = [
      Math.floor(diff / 864e5),
      Math.floor((diff / 36e5) % 24),
      Math.floor((diff / 6e4) % 60),
      Math.floor((diff / 1e3) % 60),
    ];
    parts.forEach((v, i) => (ids[i]!.textContent = pad(v)));
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Neve caindo ---------- */
function setupSnow(): void {
  const canvas = $<HTMLCanvasElement>("#neve");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || reduceMotion) return;

  type Flake = { x: number; y: number; r: number; vy: number; vx: number; a: number };
  let flakes: Flake[] = [];
  let w = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, w / 18));
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2.4 + 0.8, vy: Math.random() * 0.6 + 0.3,
      vx: Math.random() * 0.4 - 0.2, a: Math.random() * Math.PI * 2,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.8)";
    for (const f of flakes) {
      f.a += 0.01;
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.a) * 0.3;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener("resize", resize);
  draw();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
  setupCheckout();
  setupScrollUI();
  setupMenu();
  setupReveal();
  setupCounters();
  setupTilt();
  setupParallax();
  setupFaq();
  setupCountdown();
  setupSnow();
  $$<HTMLElement>("[data-carousel]").forEach((el) => new DragCarousel(el));
});
