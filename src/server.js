#!/usr/bin/env node

/**
 * Loop Agent Web Server
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __root = join(__dirname, '..');
const PORT = process.env.PORT || 3456;
const LOG_FILE = join(__root, 'logs.json');
const DASHBOARD_FILE = join(__root, 'dashboard.html');

const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json' };

function handleRequest(req, res) {
  if (req.url === '/logs.json') {
    const logs = existsSync(LOG_FILE) ? JSON.parse(readFileSync(LOG_FILE, 'utf8')) : [];
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(logs));
    return;
  }
  
  if (req.url === '/' || req.url === '/dashboard.html') {
    try {
      const content = readFileSync(DASHBOARD_FILE);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
      return;
    } catch { res.writeHead(404); res.end('Not found'); return; }
  }
  
  res.writeHead(404); res.end('Not found');
}

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(chalk.cyan('\n' + '═'.repeat(60)));
  console.log(chalk.cyan('║') + chalk.white.bold('  📊 LOOP AGENT DASHBOARD') + chalk.cyan(' '.repeat(30) + '║'));
  console.log(chalk.cyan('╠' + '═'.repeat(59) + '╣'));
  console.log(chalk.cyan('║') + chalk.gray(`  URL: http://localhost:${PORT}`) + chalk.cyan(' '.repeat(35) + '║'));
  console.log(chalk.cyan('║') + chalk.gray(`  Auto-refresh: 3 seconds`) + chalk.cyan(' '.repeat(31) + '║'));
  console.log(chalk.cyan('╚' + '═'.repeat(59) + '╝') + '\n');
  
  const open = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try { const p = spawn(open, [`http://localhost:${PORT}`], { detached: true, stdio: 'ignore' }); p.unref(); }
  catch {}
});
