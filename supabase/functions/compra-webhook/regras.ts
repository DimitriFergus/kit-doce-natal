// Regras puras do webhook (sem rede, sem banco): fáceis de testar.
// Reconhece Cakto, Kiwify, Hotmart e um formato próprio ("manual").

export type Status = "aprovada" | "reembolsada" | "chargeback" | "cancelada";
export interface Evento { email: string; status: Status; plataforma: "cakto" | "kiwify" | "hotmart" | "manual"; transacao: string; produto: string | null; }

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9.-]{1,180}\.[a-z]{2,24}$/;

export function emailValido(e: unknown): e is string {
  return typeof e === "string" && e.length <= 254 && EMAIL.test(e);
}
function texto(v: unknown, max: number): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
}

/** Comparação em tempo constante (não vaza, pelo tempo de resposta, quantos caracteres acertou). */
export function iguais(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  let dif = ea.length ^ eb.length;
  const n = Math.max(ea.length, eb.length);
  for (let i = 0; i < n; i++) dif |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return dif === 0;
}

/** HMAC em hexadecimal (a Kiwify assina o corpo com HMAC-SHA1 usando o token do webhook). */
export async function hmacHex(algoritmo: "SHA-1" | "SHA-256", segredo: string, corpo: string): Promise<string> {
  const chave = await crypto.subtle.importKey("raw", new TextEncoder().encode(segredo), { name: "HMAC", hash: algoritmo }, false, ["sign"]);
  const ass = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(corpo));
  return Array.from(new Uint8Array(ass)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** O pedido veio mesmo da plataforma? Aceita: assinatura da Kiwify, hottok da Hotmart ou cabeçalho x-webhook-segredo. */
export async function autenticado(segredo: string, corpo: string, assinaturaKiwify: string | null, hottok: string | null, cabecalho: string | null): Promise<boolean> {
  if (!segredo || segredo.length < 16) return false;
  if (assinaturaKiwify) return iguais((await hmacHex("SHA-1", segredo, corpo)).toLowerCase(), assinaturaKiwify.toLowerCase());
  if (hottok) return iguais(hottok, segredo);
  if (cabecalho) return iguais(cabecalho, segredo);
  const noCorpo = segredoNoCorpo(corpo);
  if (noCorpo) return iguais(noCorpo, segredo);
  return false;
}

/** A Cakto manda a "chave secreta" do webhook dentro do próprio corpo, no campo "secret". */
export function segredoNoCorpo(corpo: string): string | null {
  try { const c = JSON.parse(corpo); return c && typeof c.secret === "string" ? c.secret : null; } catch { return null; }
}

// Senha aleatória: sem 0/O e 1/l/I (para a cliente não confundir ao digitar), sempre com letra e número.
const LETRAS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const NUMEROS = "23456789";
function sorteia(alfabeto: string): string {
  const limite = 256 - (256 % alfabeto.length); // descarta bytes que dariam viés
  const b = new Uint8Array(1);
  do { crypto.getRandomValues(b); } while (b[0] >= limite);
  return alfabeto[b[0] % alfabeto.length];
}
/** Senha aleatória (10 caracteres, ~58 bits) que cumpre a regra do Supabase: letras e números. */
export function gerarSenha(tamanho = 10): string {
  const todos = LETRAS + NUMEROS;
  for (;;) {
    let s = "";
    for (let i = 0; i < tamanho; i++) s += sorteia(todos);
    if (/[a-zA-Z]/.test(s) && /[0-9]/.test(s)) return s;
  }
}

const CAKTO: Record<string, Status> = { purchase_approved: "aprovada", refund: "reembolsada", chargeback: "chargeback", subscription_canceled: "cancelada" };
const KIWIFY: Record<string, Status> = { paid: "aprovada", approved: "aprovada", refunded: "reembolsada", chargedback: "chargeback", chargeback: "chargeback", canceled: "cancelada", cancelled: "cancelada" };
const HOTMART: Record<string, Status> = { PURCHASE_APPROVED: "aprovada", PURCHASE_COMPLETE: "aprovada", PURCHASE_REFUNDED: "reembolsada", PURCHASE_CHARGEBACK: "chargeback", PURCHASE_PROTEST: "chargeback", PURCHASE_CANCELED: "cancelada" };
const MANUAL: Status[] = ["aprovada", "reembolsada", "chargeback", "cancelada"];

/** Transforma o corpo do webhook num evento. Devolve null quando não interessa (boleto gerado, pix pendente, recusado...). */
export function interpretar(c: any): Evento | null {
  if (!c || typeof c !== "object") return null;
  // Cakto (manda "secret" no corpo; vem antes da Hotmart porque também tem event + data)
  if (typeof c.secret === "string" && typeof c.event === "string" && c.data && typeof c.data === "object") {
    const st = CAKTO[c.event]; if (!st) return null; // purchase_refused, boleto/pix gerado... ignorados
    const email = String(c.data.customer?.email ?? "").trim().toLowerCase();
    const tr = texto(c.data.id ?? c.data.refId, 120);
    if (!emailValido(email) || !tr) return null;
    return { email, status: st, plataforma: "cakto", transacao: tr, produto: texto(c.data.product?.name, 200) };
  }
  // Hotmart (webhook 2.0)
  if (typeof c.event === "string" && c.data && typeof c.data === "object") {
    const st = HOTMART[c.event]; if (!st) return null;
    const email = String(c.data.buyer?.email ?? "").trim().toLowerCase();
    const tr = texto(c.data.purchase?.transaction, 120);
    if (!emailValido(email) || !tr) return null;
    return { email, status: st, plataforma: "hotmart", transacao: tr, produto: texto(c.data.product?.name, 200) };
  }
  // Kiwify
  if (c.order_id !== undefined && c.order_status !== undefined) {
    const st = KIWIFY[String(c.order_status).toLowerCase()]; if (!st) return null;
    const email = String(c.Customer?.email ?? c.customer?.email ?? "").trim().toLowerCase();
    const tr = texto(c.order_id, 120);
    if (!emailValido(email) || !tr) return null;
    return { email, status: st, plataforma: "kiwify", transacao: tr, produto: texto(c.Product?.product_name ?? c.product?.name, 200) };
  }
  // Formato próprio (para liberar alguém na mão ou ligar outra plataforma pelo Make/Zapier)
  if (typeof c.email === "string" && typeof c.status === "string") {
    const st = c.status.toLowerCase() as Status; if (!MANUAL.includes(st)) return null;
    const email = c.email.trim().toLowerCase();
    const tr = texto(c.transacao, 120) ?? "manual-" + email;
    if (!emailValido(email)) return null;
    return { email, status: st, plataforma: "manual", transacao: tr, produto: texto(c.produto, 200) };
  }
  return null;
}
