// =====================================================================
// Webhook de compra · roda no servidor do Supabase (Edge Function)
//
// Kiwify/Hotmart avisam aqui quando uma compra é aprovada ou reembolsada.
//   aprovada    → registra a compra e manda o e-mail "crie sua senha"
//   reembolso,  → registra; o banco corta o acesso na hora (tem_acesso)
//   chargeback,
//   cancelada
//
// Segredos (NUNCA no código, só em "supabase secrets set"):
//   WEBHOOK_SEGREDO  token do webhook da Kiwify ou o hottok da Hotmart (mín. 16 caracteres)
//   SITE_URL         ex.: https://dimitrifergus.github.io/kit-doce-natal
// O Supabase injeta sozinho SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (a chave
// secreta fica só no servidor e nunca chega ao navegador).
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { autenticado, interpretar } from "./regras.ts";

const SEGREDO = Deno.env.get("WEBHOOK_SEGREDO") ?? "";
const SITE_URL = (Deno.env.get("SITE_URL") ?? "").replace(/\/+$/, "");
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const resposta = (status: number, msg: string) =>
  new Response(JSON.stringify({ ok: status < 300, msg }), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return resposta(405, "use POST");
  if (SEGREDO.length < 16) return resposta(500, "WEBHOOK_SEGREDO não configurado");

  const tamanho = Number(req.headers.get("content-length") ?? "0");
  if (tamanho > 200_000) return resposta(413, "corpo grande demais");
  const corpo = await req.text();
  if (corpo.length > 200_000) return resposta(413, "corpo grande demais");

  const url = new URL(req.url);
  const ok = await autenticado(SEGREDO, corpo, url.searchParams.get("signature"), req.headers.get("x-hotmart-hottok"), req.headers.get("x-webhook-segredo"));
  if (!ok) return resposta(401, "não autorizado");

  let dados: unknown;
  try { dados = JSON.parse(corpo); } catch { return resposta(400, "JSON inválido"); }
  const ev = interpretar(dados);
  if (!ev) return resposta(200, "evento ignorado"); // boleto gerado, pix pendente, recusado...

  const { error } = await admin.from("compras").upsert(
    { email: ev.email, status: ev.status, plataforma: ev.plataforma, transacao: ev.transacao, produto: ev.produto, atualizado_em: new Date().toISOString() },
    { onConflict: "plataforma,transacao" },
  );
  if (error) { console.error("compras.upsert", error.message); return resposta(500, "falha ao registrar"); }

  if (ev.status === "aprovada") {
    // Convida (cria a conta e manda o e-mail para criar a senha). Se a pessoa já tem conta, só registra a compra.
    const { error: e2 } = await admin.auth.admin.inviteUserByEmail(ev.email, { redirectTo: SITE_URL ? SITE_URL + "/membros/" : undefined });
    if (e2 && !/already|registered|exists/i.test(e2.message)) { console.error("convite", e2.message); return resposta(500, "compra registrada, convite falhou"); }
  }
  console.log("compra", ev.plataforma, ev.status); // sem e-mail no log
  return resposta(200, "ok");
});
