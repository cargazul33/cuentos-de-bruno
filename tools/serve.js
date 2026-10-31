// Servidor estático mínimo que imita GitHub Pages: publica el repo bajo /cuentos-de-bruno/.
// Uso: node tools/serve.js [puerto]   →   http://localhost:8080/cuentos-de-bruno/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = '/cuentos-de-bruno/';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

function createServer(log) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let p = decodeURIComponent(url.pathname);
    if (p === BASE.slice(0, -1)) { res.writeHead(301, { Location: BASE }); res.end(); return; }
    const send = (code, body, type) => {
      if (log) log(code, p);
      res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(body);
    };
    if (!p.startsWith(BASE)) return send(404, 'Not found');
    let rel = p.slice(BASE.length) || 'index.html';
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT) || rel.split('/').some((s) => s.startsWith('.') && s !== '.nojekyll')) return send(404, 'Not found');
    fs.readFile(file, (err, data) => {
      if (err) return send(404, 'Not found');
      send(200, data, TYPES[path.extname(file)] || 'application/octet-stream');
    });
  });
}

if (require.main === module) {
  const port = Number(process.argv[2]) || 8080;
  createServer((code, p) => console.log(code, p)).listen(port, () => console.log('Sirviendo en http://localhost:' + port + BASE));
}

module.exports = { createServer, BASE };
