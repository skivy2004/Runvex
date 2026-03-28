const fs = require('fs');
const path = require('path');

const webhookUrl = process.env.N8N_WEBHOOK_URL;
if (!webhookUrl) {
  console.error('Fout: N8N_WEBHOOK_URL omgevingsvariabele is niet ingesteld');
  process.exit(1);
}

const src  = path.join(__dirname, 'frontend', 'index.html');
const dest = path.join(__dirname, 'dist', 'index.html');

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });

const html = fs.readFileSync(src, 'utf8').replace('${N8N_WEBHOOK_URL}', webhookUrl);
fs.writeFileSync(dest, html);

console.log(`Gebouwd: dist/index.html (webhook: ${webhookUrl})`);
