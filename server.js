const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif'
};

const server = http.createServer((request, response) => {
  let relativePath;
  try {
    relativePath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname.slice(1)) || 'index.html';
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const filePath = path.resolve(root, relativePath);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('File not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    response.end(contents);
  });
});

const port = Number(process.env.PORT) || 8000;
server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Presentation ready at http://127.0.0.1:${port}\n`);
});
