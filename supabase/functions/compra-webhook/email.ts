// E-mail de boas-vindas com a senha de acesso (enviado pela Resend: https://resend.com).
// Segredos: RESEND_API_KEY e EMAIL_REMETENTE (ex.: "Natalê <acesso@seudominio.com.br>").

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

/** Monta o e-mail (assunto, HTML e texto puro). Função pura, para dar para testar. */
export function emailBoasVindas(email: string, senha: string, linkMembros: string) {
  const e = esc(email), s = esc(senha), l = esc(linkMembros);
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:28px 22px;background:#faf4ea;border-radius:18px;color:#2a0908">
  <h1 style="font-size:24px;margin:0 0 12px;color:#6e1a17">Bem-vinda ao Natalê! 🎄</h1>
  <p style="font-size:16px;line-height:1.5">Sua compra foi aprovada. Este é o seu acesso à área de membros, com as receitas, a calculadora, os cardápios e os bônus:</p>
  <table role="presentation" style="width:100%;background:#fff;border:1px solid #e8d8bd;border-radius:12px;margin:18px 0;font-size:16px">
    <tr><td style="padding:12px 16px;color:#6b5a55;width:70px">E-mail</td><td style="padding:12px 16px;font-weight:bold;word-break:break-all">${e}</td></tr>
    <tr><td style="padding:12px 16px;color:#6b5a55;border-top:1px solid #f0e4cf">Senha</td><td style="padding:12px 16px;border-top:1px solid #f0e4cf;font-family:'Courier New',monospace;font-size:20px;font-weight:bold;letter-spacing:2px">${s}</td></tr>
  </table>
  <p style="text-align:center;margin:26px 0"><a href="${l}" style="background:#d4af6a;color:#2a0908;font-weight:bold;text-decoration:none;padding:15px 26px;border-radius:999px;display:inline-block">ENTRAR NA ÁREA DE MEMBROS</a></p>
  <p style="font-size:13px;color:#6b5a55">Guarde este e-mail. Se esquecer a senha, abra a área de membros e toque em "Primeiro acesso ou esqueceu a senha?" para criar uma nova.</p>
  <p style="font-size:13px;color:#6b5a55">Não fez esta compra? Ignore este e-mail.</p>
</div>`;
  const texto = `Bem-vinda ao Natalê!\n\nSua compra foi aprovada. Seu acesso à área de membros:\n\nE-mail: ${email}\nSenha: ${senha}\n\nEntre em: ${linkMembros}\n\nSe esquecer a senha, abra a área de membros e toque em "Primeiro acesso ou esqueceu a senha?".`;
  return { assunto: "Natalê: seu acesso à área de membros chegou 🎄", html, texto };
}

/** Envia pela API da Resend. Lança erro se não conseguir (o webhook então desfaz a conta e a plataforma tenta de novo). */
export async function enviarEmail(chave: string, remetente: string, para: string, m: { assunto: string; html: string; texto: string }) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: remetente, to: [para], subject: m.assunto, html: m.html, text: m.texto }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
}
