import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT || 3101);
const OUT_DIR = path.resolve(process.cwd(), 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  let filePath = path.join(OUT_DIR, urlPath === '/' ? 'index.html' : urlPath);

  try {
    let stat = await fs.stat(filePath).catch(() => null);
    if (stat?.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stat = await fs.stat(filePath).catch(() => null);
    }
    if (!stat) {
      // Fallback to 404.html when present in static export
      const notFoundPath = path.join(OUT_DIR, '404.html');
      const notFound = await fs.readFile(notFoundPath).catch(() => null);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(notFound || 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static export server listening on http://127.0.0.1:${PORT}`);
});
