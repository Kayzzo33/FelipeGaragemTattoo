import { Resend } from 'resend';

function escapeHtml(text?: string | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.RESEND_TO_EMAIL || process.env.TATTOO_ARTIST_EMAIL;

    const data = req.body || {};

    const safeData = {
      nome: escapeHtml(data.nome),
      instagram: escapeHtml(data.instagram),
      whatsapp: escapeHtml(data.whatsapp),
      ideia: escapeHtml(data.ideia),
      local: escapeHtml(data.local),
      localOutro: escapeHtml(data.localOutro),
      lado: escapeHtml(data.lado),
      tamanho: escapeHtml(data.tamanho),
      condicaoPele: escapeHtml(data.condicaoPele),
      condicaoPeleOutro: escapeHtml(data.condicaoPeleOutro),
      quando: escapeHtml(data.quando),
      investimento: escapeHtml(data.investimento),
      amenizador: escapeHtml(data.amenizador),
      infosExtras: escapeHtml(data.infosExtras),
      comoConheceu: escapeHtml(data.comoConheceu),
      comoConheceuOutro: escapeHtml(data.comoConheceuOutro),
    };

    const rawWhatsapp = (data.whatsapp || '').replace(/\D/g, '');
    const whatsappLink = rawWhatsapp ? `https://wa.me/55${rawWhatsapp.replace(/^55/, '')}` : '';

    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Nova Solicitação de Orçamento</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d0d0d; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #141414; border: 1px solid #c5a059; border-radius: 4px; overflow: hidden;">
          <tr>
            <td style="background-color: #000000; padding: 30px 24px; text-align: center; border-bottom: 2px solid #c5a059;">
              <h1 style="margin: 0; color: #c5a059; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">FELIPE GARAGEM TATTOO</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; letter-spacing: 1px;">NOVA SOLICITAÇÃO DE TATUAGEM</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #1c1c1c; border-left: 4px solid #c5a059; padding: 16px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 12px 0; color: #c5a059; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">01. Dados de Contato</h2>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Nome:</strong> ${safeData.nome || 'Não informado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Instagram:</strong> ${safeData.instagram ? `@${safeData.instagram.replace(/^@/, '')}` : 'Não informado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;">
                      <strong>WhatsApp:</strong> ${safeData.whatsapp || 'Não informado'}
                      ${whatsappLink ? `<a href="${whatsappLink}" style="margin-left: 8px; color: #25D366; text-decoration: none; font-weight: bold;">(Abrir WhatsApp)</a>` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #1c1c1c; border-left: 4px solid #c5a059; padding: 16px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 12px 0; color: #c5a059; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">02. Detalhes da Tatuagem</h2>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Ideia / Projeto:</strong></p>
                    <div style="margin: 6px 0 12px 0; padding: 12px; background-color: #121212; border-radius: 4px; font-size: 14px; color: #e5e5e0; line-height: 1.5;">
                      ${safeData.ideia || 'Não informado'}
                    </div>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Local do Corpo:</strong> ${safeData.local}${safeData.localOutro ? ` (${safeData.localOutro})` : ''}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Lado:</strong> ${safeData.lado || 'Não especificado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Tamanho Estimado:</strong> ${safeData.tamanho || 'Não especificado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Condição da Pele:</strong> ${safeData.condicaoPele}${safeData.condicaoPeleOutro ? ` (${safeData.condicaoPeleOutro})` : ''}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #1c1c1c; border-left: 4px solid #c5a059; padding: 16px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 12px 0; color: #c5a059; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">03. Planejamento & Orçamento</h2>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Previsão:</strong> ${safeData.quando || 'Não informado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Investimento Estimado:</strong> ${safeData.investimento || 'Não informado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Amenizador 3D:</strong> ${safeData.amenizador || 'Não informado'}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Como conheceu:</strong> ${safeData.comoConheceu}${safeData.comoConheceuOutro ? ` (${safeData.comoConheceuOutro})` : ''}</p>
                    ${safeData.infosExtras ? `
                    <p style="margin: 8px 0 4px 0; font-size: 14px; color: #f5f5f0;"><strong>Informações Extras:</strong></p>
                    <div style="margin: 4px 0; padding: 10px; background-color: #121212; border-radius: 4px; font-size: 14px; color: #e5e5e0;">
                      ${safeData.infosExtras}
                    </div>` : ''}
                  </td>
                </tr>
              </table>

              ${Array.isArray(data.imagens) && data.imagens.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #1c1c1c; border-left: 4px solid #c5a059; padding: 16px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 12px 0; color: #c5a059; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">04. Referências Visuais (Supabase)</h2>
                    <ul style="margin: 0; padding-left: 20px; color: #f5f5f0; font-size: 14px;">
                      ${data.imagens.map((url: string, idx: number) => `
                        <li style="margin-bottom: 8px;">
                          <a href="${escapeHtml(url)}" target="_blank" style="color: #c5a059; text-decoration: underline;">
                            Ver Imagem de Referência ${idx + 1}
                          </a>
                        </li>
                      `).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${whatsappLink ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${whatsappLink}" style="display: inline-block; background-color: #c5a059; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; border-radius: 2px;">
                      Responder Cliente no WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 16px; text-align: center; border-top: 1px solid #222222; font-size: 12px; color: #777777;">
              Enviado automaticamente pelo formulário oficial de felipegaragemtattoo.com.br
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const attachmentsList: Array<{ filename: string; content: string }> = [];
    if (Array.isArray(data.attachments)) {
      for (const att of data.attachments) {
        if (att && att.content) {
          const cleanContent = att.content.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
          attachmentsList.push({
            filename: att.filename || `referencia_${Date.now()}.jpg`,
            content: cleanContent,
          });
        }
      }
    }

    if (!resendKey || !toEmail) {
      console.warn('[Resend Warning] RESEND_API_KEY or RESEND_TO_EMAIL is not set.');
      return res.status(200).json({ success: true, emailSent: false });
    }

    const resend = new Resend(resendKey);
    const emailPayload: any = {
      from: 'onboarding@resend.dev',
      to: [toEmail],
      subject: `Nova Solicitação de Tatuagem: ${safeData.nome || 'Cliente'}`,
      html: emailHtml,
    };

    if (attachmentsList.length > 0) {
      emailPayload.attachments = attachmentsList;
    }

    const { data: emailData, error } = await resend.emails.send(emailPayload);
    if (error) {
      console.error('[Resend Error]:', error);
      return res.status(200).json({ success: true, emailSent: false, error: error.message });
    }

    return res.status(200).json({ success: true, emailSent: true, id: emailData?.id });
  } catch (error: any) {
    console.error('[API Error in send-budget]:', error);
    return res.status(200).json({ success: true, emailSent: false, error: 'Internal handled error' });
  }
}
