module.exports = async function handler(req, res) {
  // CORS headers – required for preflight; safe for same-origin too
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('N8N_WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    // Do NOT blindly proxy n8n status – a 404 from n8n would look like
    // a Vercel routing 404 to the browser. Normalise to 200/502.
    if (response.ok) {
      return res.status(200).json({ success: true });
    }

    const text = await response.text().catch(() => '');
    console.error('n8n returned', response.status, text.slice(0, 200));
    return res.status(502).json({ error: 'Webhook error', upstream: response.status });

  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(502).json({ error: 'Webhook niet bereikbaar' });
  }
};
