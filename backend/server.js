/**
 * server.js —— 游戏官网静态文件服务器
 * 参照代理后台风格，零依赖，Node 内置 http 模块
 * 启动：node backend/server.js（或双击 启动.bat）
 */

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { exec } = require('node:child_process');
const os = require('node:os');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

// MIME 类型
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
};

// 获取本机局域网 IP
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// 读取静态文件
function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';

  // 安全检查：防止路径穿越
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在，返回 404 页面
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - 页面不存在</title>
        <style>
          body{font-family:system-ui,"Microsoft YaHei",sans-serif;background:#0d1117;color:#e6edf3;
            display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
          .card{text-align:center;}
          h1{font-size:4rem;margin:0;color:#58a6ff;}
          p{color:#8b949e;margin:12px 0 24px;}
          a{color:#58a6ff;text-decoration:none;}
          a:hover{text-decoration:underline;}
        </style></head>
        <body><div class="card">
          <h1>404</h1>
          <p>页面不存在</p>
          <a href="/">← 返回首页</a>
        </div></body></html>
      `);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

// 创建 HTTP 服务
const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    serveStatic(req, res, url.pathname);
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('服务器内部错误');
  }
});

// 启动服务
server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('==============================================');
  console.log('  🎮 模拟人生・微力版 官网 已启动');
  console.log('==============================================');
  console.log(`  本机访问:   http://localhost:${PORT}`);
  console.log(`  局域网访问: http://${localIp}:${PORT}`);
  console.log('==============================================');
  console.log('  按 Ctrl+C 停止服务');
  console.log('==============================================');

  // 自动打开浏览器（本地运行时，云端部署有 PORT 环境变量则不执行）
  if (!process.env.PORT) {
    exec(`start http://localhost:${PORT}`, { shell: true }, () => {});
  }
});
