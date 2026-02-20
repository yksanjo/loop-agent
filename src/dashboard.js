#!/usr/bin/env node

/**
 * Loop Agent Dashboard
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __root = join(__dirname, '..');
const LOG_FILE = join(__root, 'logs.json');

const projects = [
  { name: 'agent-waf', language: 'typescript', icon: '🔒' },
  { name: 'agent-observability', language: 'go', icon: '📊' },
  { name: 'agent-gateway', language: 'rust', icon: '🌐' },
  { name: 'agent-memory-store', language: 'python', icon: '💾' },
  { name: 'agent-orchestrator', language: 'typescript', icon: '🎯' },
  { name: 'agent-registry', language: 'go', icon: '📋' },
  { name: 'agent-policy-engine', language: 'rust', icon: '🛡️' },
  { name: 'agent-cache', language: 'python', icon: '⚡' },
  { name: 'agent-queue', language: 'typescript', icon: '📨' },
  { name: 'agent-config', language: 'go', icon: '⚙️' },
];

function getProgress() {
  if (!existsSync(LOG_FILE)) return { iterations: 0, projects: [] };
  try { return { iterations: JSON.parse(readFileSync(LOG_FILE, 'utf8')).length, projects: JSON.parse(readFileSync(LOG_FILE, 'utf8')) }; }
  catch { return { iterations: 0, projects: [] }; }
}

function render() {
  const progress = getProgress();
  const completed = Math.min(progress.iterations, 10);
  
  console.clear();
  console.log(chalk.cyan('\n' + '═'.repeat(60)));
  console.log(chalk.cyan('║') + chalk.white.bold('  🚀 LOOP AGENT DASHBOARD') + chalk.cyan(' '.repeat(32) + '║'));
  console.log(chalk.cyan('║') + chalk.gray(`  Target: github.com/yksanjo`) + chalk.cyan(' '.repeat(34) + '║'));
  console.log(chalk.cyan('╠' + '═'.repeat(59) + '╣'));
  console.log(chalk.cyan('║') + chalk.white.bold('  PROGRESS') + chalk.cyan(' '.repeat(49) + '║'));
  
  const percent = Math.round((completed / 10) * 100);
  const bar = '█'.repeat(percent / 5) + '░'.repeat(20 - percent / 5);
  console.log(chalk.cyan('║') + `  ${bar} ${percent}%` + chalk.cyan(' '.repeat(15) + '║'));
  console.log(chalk.cyan('║') + chalk.gray(`  Completed: ${completed}/10`) + chalk.cyan(' '.repeat(42) + '║'));
  console.log(chalk.cyan('╠' + '═'.repeat(59) + '╣'));
  console.log(chalk.cyan('║') + chalk.white.bold('  PROJECTS') + chalk.cyan(' '.repeat(49) + '║'));
  console.log(chalk.cyan('╠' + '═'.repeat(59) + '╣'));
  
  projects.forEach((p, i) => {
    const status = progress.projects[i];
    const icon = status ? (status.result?.success ? chalk.green('✓') : chalk.red('✗')) : chalk.gray('○');
    const text = status ? (status.result?.success ? chalk.green('DONE') : chalk.red('FAIL')) : chalk.gray('PENDING');
    console.log(chalk.cyan('║') + `  ${icon} ${p.icon} ${p.name.padEnd(25)} ${text}` + chalk.cyan(' '.repeat(20) + '║'));
  });
  
  console.log(chalk.cyan('╚' + '═'.repeat(59) + '╝') + '\n');
}

render();
