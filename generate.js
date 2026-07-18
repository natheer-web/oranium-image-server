// api/generate.js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const { put } = require('@vercel/blob');

function buildHtml({ line1, line2, line3, line4 }) {
  return `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
  <style>
    html, body { margin: 0; padding: 0; }
    .canvas {
      width: 1080px;
      height: 1080px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      box-sizing: border-box;
      padding: 80px;
    }
    .heart { position: absolute; top: 220px; left: 260px; font-size: 42px; }
    .lines { display: flex; flex-direction: column; align-items: center; gap: 55px; }
    .line {
      font-family: 'Aref Ruqaa', serif;
      font-weight: 700;
      font-size: 64px;
      color: #1a1a1a;
      text-align: center;
      white-space: nowrap;
    }
  </style>
  </head>
  <body>
    <div class="canvas">
      <div class="heart">&#10084;&#65039;</div>
      <div class="lines">
        <div class="line">${line1 || ''}</div>
        <div class="line">${line2 || ''}</div>
        <div class="line">${line3 || ''}</div>
        <div class="line">${line4 || ''}</div>
      </div>
    </div>
  </body>
  </html>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    const { line1, line2, line3, line4 } = req.body;
    const html = buildHtml({ line1, line2, line3, line4 });

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1080, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const imageBuffer = await page.screenshot({ type: 'png' });
    await browser.close();

    // Upload the generated image to Vercel Blob and get a public URL
    const filename = `dua-${Date.now()}.png`;
    const blob = await put(filename, imageBuffer, {
      access: 'public',
      contentType: 'image/png',
    });

    // This is what n8n / Instagram will use
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
