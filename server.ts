import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/send-budget', async (req, res) => {
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const toEmail = process.env.RESEND_TO_EMAIL;

      if (!resendKey || !toEmail) {
        console.warn('RESEND_API_KEY or RESEND_TO_EMAIL is not configured. Email will be skipped.');
        return res.status(200).json({ success: true, message: 'Simulated success (keys missing)' });
      }

      const resend = new Resend(resendKey);
      const data = req.body;

      let emailHtml = `<h1>Novo Pedido de Orçamento - Felipe Garagem Tattoo</h1>`;
      emailHtml += `<h2>Dados de Contato</h2>`;
      emailHtml += `<p><strong>Nome:</strong> ${data.nome}</p>`;
      emailHtml += `<p><strong>Instagram:</strong> ${data.instagram}</p>`;
      emailHtml += `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>`;
      
      emailHtml += `<h2>Sobre a Tatuagem</h2>`;
      emailHtml += `<p><strong>Ideia:</strong> ${data.ideia}</p>`;
      emailHtml += `<p><strong>Local:</strong> ${data.local}${data.localOutro ? ` - ${data.localOutro}` : ''}</p>`;
      emailHtml += `<p><strong>Lado do corpo:</strong> ${data.lado}</p>`;
      emailHtml += `<p><strong>Tamanho aproximado:</strong> ${data.tamanho}</p>`;
      emailHtml += `<p><strong>Condição da pele:</strong> ${data.condicaoPele}${data.condicaoPeleOutro ? ` - ${data.condicaoPeleOutro}` : ''}</p>`;

      emailHtml += `<h2>Planejamento</h2>`;
      emailHtml += `<p><strong>Quando pretende fazer:</strong> ${data.quando}</p>`;
      emailHtml += `<p><strong>Faixa de investimento:</strong> ${data.investimento}</p>`;
      emailHtml += `<p><strong>Amenizador 3D:</strong> ${data.amenizador}</p>`;
      emailHtml += `<p><strong>Informações extras:</strong> ${data.infosExtras || 'Nenhuma'}</p>`;
      emailHtml += `<p><strong>Como conheceu:</strong> ${data.comoConheceu}${data.comoConheceuOutro ? ` - ${data.comoConheceuOutro}` : ''}</p>`;

      if (data.imagens && data.imagens.length > 0) {
        emailHtml += `<h2>Referências Visuais</h2>`;
        emailHtml += `<ul>`;
        data.imagens.forEach((imgUrl: string) => {
          emailHtml += `<li><a href="${imgUrl}" target="_blank">${imgUrl}</a></li>`;
        });
        emailHtml += `</ul>`;
      }

      const { data: emailData, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Change to verified domain if available, but onboarding works for testing
        to: [toEmail],
        subject: `Novo Orçamento: ${data.nome}`,
        html: emailHtml,
      });

      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error });
      }

      res.status(200).json({ success: true, data: emailData });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
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
