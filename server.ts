import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to support base64 fallback attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Native MP4 Video Stream with fast Local Caching & Google Drive Proxy (with 206 Partial Content support)
  app.get('/api/video-stream/:fileId', (req, res) => {
    const { fileId } = req.params;
    if (!fileId || typeof fileId !== 'string') {
      return res.status(400).send('Invalid file ID');
    }

    const fs = require('fs');
    // Map of known IDs to local files
    const localVideoMap: Record<string, string> = {
      '1hKdTUQ4Wm6n5zywo10czirNsVhS6GyyC': path.join(process.cwd(), 'public', 'videos', 'video1.mp4'),
      'video1': path.join(process.cwd(), 'public', 'videos', 'video1.mp4'),
      '1NQ0OwCxJZb6fJFM1tSIDPdgCSHMLXwtj': path.join(process.cwd(), 'public', 'videos', 'video2.mp4'),
      'video2': path.join(process.cwd(), 'public', 'videos', 'video2.mp4'),
      '1dgr8-gsp2VB7SjrP3a6j13h0P7vnkb0s': path.join(process.cwd(), 'public', 'videos', 'video3.mp4'),
      'video3': path.join(process.cwd(), 'public', 'videos', 'video3.mp4'),
    };

    const targetLocal = localVideoMap[fileId] || path.join(process.cwd(), 'public', 'videos', `${fileId}.mp4`);

    if (fs.existsSync(targetLocal) && fs.statSync(targetLocal).size > 100000) {
      const stat = fs.statSync(targetLocal);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(targetLocal, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
          'Access-Control-Allow-Origin': '*',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
        };
        res.writeHead(200, head);
        fs.createReadStream(targetLocal).pipe(res);
      }
      return;
    }

    const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    const clientRange = req.headers.range;

    const requestHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    if (clientRange) {
      requestHeaders['Range'] = clientRange;
    }

    import('https').then((https) => {
      const driveReq = https.get(driveUrl, { headers: requestHeaders }, (driveRes) => {
        const responseHeaders: Record<string, string | string[] | undefined> = {
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
        };

        if (driveRes.headers['content-length']) {
          responseHeaders['Content-Length'] = driveRes.headers['content-length'];
        }
        if (driveRes.headers['content-range']) {
          responseHeaders['Content-Range'] = driveRes.headers['content-range'];
        }

        res.writeHead(driveRes.statusCode || 200, responseHeaders);
        driveRes.pipe(res);
      });

      driveReq.on('error', (err) => {
        console.error('[Video Proxy Error]:', err);
        if (!res.headersSent) {
          res.status(500).send('Streaming error');
        }
      });
    });
  });

  app.post('/api/send-budget', async (req, res) => {
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const toEmail = process.env.RESEND_TO_EMAIL || process.env.TATTOO_ARTIST_EMAIL;

      const data = req.body || {};

      // Sanitize all inputs
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

      // Build structured HTML email
      let emailHtml = `
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
          
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 30px 24px; text-align: center; border-bottom: 2px solid #c5a059;">
              <h1 style="margin: 0; color: #c5a059; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">FELIPE GARAGEM TATTOO</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; letter-spacing: 1px;">NOVA SOLICITAÇÃO DE TATUAGEM</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px;">
              
              <!-- 01. Contato -->
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

              <!-- 02. Sobre a Tatuagem -->
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

              <!-- 03. Planejamento -->
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

              <!-- 04. Referências -->
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

              <!-- Action button in email -->
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

          <!-- Footer -->
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

      // Handle attachments if fallback base64 images were provided
      const attachmentsList: Array<{ filename: string; content: string }> = [];
      if (Array.isArray(data.attachments)) {
        for (const att of data.attachments) {
          if (att && att.content) {
            // Remove data URI prefix if present (e.g. data:image/png;base64,)
            const cleanContent = att.content.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
            attachmentsList.push({
              filename: att.filename || `referencia_${Date.now()}.jpg`,
              content: cleanContent,
            });
          }
        }
      }

      if (!resendKey || !toEmail) {
        console.warn('[Resend Warning] RESEND_API_KEY or RESEND_TO_EMAIL is not configured. Logging payload safely:');
        console.log({ nome: safeData.nome, whatsapp: safeData.whatsapp, ideia: safeData.ideia });
        // Return 200 OK so that client-side flow & WhatsApp redirect are never blocked
        return res.status(200).json({ 
          success: true, 
          emailSent: false, 
          message: 'Form processed (Resend credentials not set on server)' 
        });
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
        console.error('[Resend Error] Failed to send email via Resend:', error);
        // Non-blocking response: return success=true with warning so user UX is preserved
        return res.status(200).json({ 
          success: true, 
          emailSent: false, 
          error: error.message 
        });
      }

      console.log('[Resend Success] Email delivered successfully. ID:', emailData?.id);
      return res.status(200).json({ success: true, emailSent: true, id: emailData?.id });

    } catch (error: any) {
      console.error('[Server Error in /api/send-budget]:', error);
      // Even on unexpected exceptions, return 200 to prevent breaking the client WhatsApp redirect
      return res.status(200).json({ 
        success: true, 
        emailSent: false, 
        error: 'Handled server exception' 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
