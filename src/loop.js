#!/usr/bin/env node

/**
 * Loop Agent - Autonomous AI Infrastructure Creator
 * Plan → Build → Push Loop
 */

import { spawn } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, readFileSync, appendFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __root = join(__dirname, '..');

// Configuration
const GITHUB_ORG = 'yksanjo';
const MAX_ITERATIONS = 10;

// MVP Projects
const mvpProjects = [
  { name: 'agent-waf', language: 'typescript', icon: '🔒', description: 'Web Application Firewall for AI Agents' },
  { name: 'agent-observability', language: 'go', icon: '📊', description: 'Observability platform for AI agent monitoring' },
  { name: 'agent-gateway', language: 'rust', icon: '🌐', description: 'API Gateway for AI agent communication' },
  { name: 'agent-memory-store', language: 'python', icon: '💾', description: 'Distributed memory store for AI agents' },
  { name: 'agent-orchestrator', language: 'typescript', icon: '🎯', description: 'Orchestration engine for multi-agent workflows' },
  { name: 'agent-registry', language: 'go', icon: '📋', description: 'Service registry and discovery for AI agents' },
  { name: 'agent-policy-engine', language: 'rust', icon: '🛡️', description: 'Policy enforcement engine for AI governance' },
  { name: 'agent-cache', language: 'python', icon: '⚡', description: 'Intelligent caching layer for AI responses' },
  { name: 'agent-queue', language: 'typescript', icon: '📨', description: 'Message queue system for AI agents' },
  { name: 'agent-config', language: 'go', icon: '⚙️', description: 'Configuration management for AI deployments' },
];

let currentProjectIndex = 0;
let totalProjectsCreated = 0;
let startTime = null;

/**
 * Plan phase
 */
async function planPhase() {
  const spinner = ora(chalk.cyan('📋 Planning project...')).start();
  
  if (currentProjectIndex >= mvpProjects.length) {
    spinner.succeed(chalk.yellow('All projects completed!'));
    return null;
  }
  
  const project = mvpProjects[currentProjectIndex];
  const repoName = `agent-infra-${project.name}`;
  
  spinner.succeed(chalk.green(`✓ Planned: ${repoName}`));
  return { ...project, repoName, fullName: `${GITHUB_ORG}/${repoName}` };
}

/**
 * Build phase
 */
async function buildPhase(project, dryRun = false) {
  const spinner = ora(chalk.cyan(`  Building ${project.repoName}...`)).start();
  
  if (dryRun) {
    spinner.succeed(chalk.yellow(`  [DRY RUN] ${project.repoName}`));
    return { success: true, repo: project.repoName };
  }
  
  try {
    const projectDir = join(__root, '..', project.repoName);
    
    if (existsSync(projectDir)) {
      rmSync(projectDir, { recursive: true, force: true });
    }
    
    mkdirSync(projectDir, { recursive: true });
    
    // Create package.json
    const packageJson = {
      name: project.repoName,
      version: '1.0.0',
      description: project.description,
      type: 'module',
      main: 'src/index.js',
      scripts: {
        start: 'node src/index.js',
        test: 'node --test',
      },
      keywords: ['ai', 'agent', 'infrastructure', project.name],
      author: 'Yoshi Kondo <yoshi@musicailab.com>',
      license: 'MIT',
      repository: {
        type: 'git',
        url: `https://github.com/${GITHUB_ORG}/${project.repoName}.git`,
      },
    };
    
    writeFileSync(join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    
    // Create src directory
    mkdirSync(join(projectDir, 'src'), { recursive: true });
    
    // Create main file
    const mainFile = `/**
 * ${project.repoName}
 * ${project.description}
 */

console.log('${project.repoName} initialized');
`;
    writeFileSync(join(projectDir, 'src', 'index.js'), mainFile);
    
    // Create README
    const readme = `# ${project.repoName}

${project.description}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT - Yoshi Kondo
`;
    writeFileSync(join(projectDir, 'README.md'), readme);
    
    // Create .gitignore
    writeFileSync(join(projectDir, '.gitignore'), 'node_modules\n.env\n*.log\n');
    
    // Create LICENSE
    writeFileSync(join(projectDir, 'LICENSE'), 'MIT License\n\nCopyright (c) 2026 Yoshi Kondo\n');
    
    spinner.succeed(chalk.green(`  ✓ Built ${project.repoName}`));
    return { success: true, repo: project.repoName };
    
  } catch (error) {
    spinner.fail(chalk.red(`  ✗ Failed ${project.repoName}: ${error.message}`));
    return { success: false, repo: project.repoName, error: error.message };
  }
}

/**
 * Push phase
 */
async function pushPhase(project, dryRun = false) {
  const spinner = ora(chalk.cyan(`  Pushing ${project.repoName}...`)).start();
  
  if (dryRun) {
    spinner.succeed(chalk.yellow(`  [DRY RUN] ${project.repoName}`));
    return { success: true, repo: project.repoName };
  }
  
  try {
    const projectDir = join(__root, '..', project.repoName);
    
    await execCommand('git init', projectDir);
    await execCommand('git add .', projectDir);
    await execCommand(`git commit -m "Initial commit: ${project.description}"`, projectDir);
    await execCommand(`gh repo create ${project.fullName} --public --source=${projectDir} --push`, projectDir);
    
    spinner.succeed(chalk.green(`  ✓ Pushed to https://github.com/${project.fullName}`));
    return { success: true, repo: project.repoName, url: `https://github.com/${project.fullName}` };
    
  } catch (error) {
    spinner.fail(chalk.red(`  ✗ Failed ${project.repoName}: ${error.message}`));
    return { success: false, repo: project.repoName, error: error.message };
  }
}

/**
 * Execute command
 */
function execCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, [], { cwd, stdio: ['ignore', 'pipe', 'pipe'], shell: true });
    let stderr = '';
    proc.stderr.on('data', (data) => { stderr += data.toString(); });
    proc.on('close', (code) => { code === 0 ? resolve() : reject(new Error(stderr || `Exit code: ${code}`)); });
    proc.on('error', reject);
  });
}

/**
 * Log iteration
 */
function logIteration(iteration, project, result, duration) {
  const logFile = join(__root, 'logs.json');
  const logEntry = { timestamp: new Date().toISOString(), iteration, project: project?.repoName, result, duration };
  
  let logs = [];
  if (existsSync(logFile)) {
    try { logs = JSON.parse(readFileSync(logFile, 'utf8')); } catch { logs = []; }
  }
  
  logs.push(logEntry);
  writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

/**
 * Display stats
 */
function displayStats() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  console.log(chalk.cyan('\n' + '='.repeat(60)));
  console.log(chalk.white.bold('  LOOP AGENT STATISTICS'));
  console.log(chalk.cyan('='.repeat(60)));
  console.log(chalk.gray(`  Total Iterations:    ${chalk.white(currentProjectIndex)}/${MAX_ITERATIONS}`));
  console.log(chalk.gray(`  Projects Created:    ${chalk.green(totalProjectsCreated)}`));
  console.log(chalk.gray(`  Elapsed Time:        ${chalk.yellow(`${Math.floor(elapsed/60)}m ${elapsed%60}s`)}`));
  console.log(chalk.gray(`  GitHub Org:          ${chalk.blue(GITHUB_ORG)}`));
  console.log(chalk.cyan('='.repeat(60)) + '\n');
}

/**
 * Main loop
 */
async function runLoop(options = {}) {
  const { dryRun = false } = options;
  startTime = Date.now();
  
  console.log(chalk.cyan('\n' + '█'.repeat(60)));
  console.log(chalk.cyan('█') + chalk.white.bold('  LOOP AGENT - AI INFRASTRUCTURE CREATOR') + chalk.cyan('█'));
  console.log(chalk.cyan('█') + chalk.gray('  Plan → Build → Push (10 Projects)') + chalk.cyan('█'));
  console.log(chalk.cyan('█') + chalk.gray(`  Target: github.com/${GITHUB_ORG}`) + chalk.cyan('█'));
  console.log(chalk.cyan('█'.repeat(60)) + '\n');
  
  if (dryRun) {
    console.log(chalk.yellow('⚠️  DRY RUN MODE\n'));
  }
  
  let shouldStop = false;
  process.on('SIGINT', () => { console.log(chalk.yellow('\nStopping...')); shouldStop = true; });
  
  while (!shouldStop && currentProjectIndex < MAX_ITERATIONS) {
    const iterationStart = Date.now();
    const iterationNum = currentProjectIndex + 1;
    
    console.log(chalk.cyan(`\n${'─'.repeat(60)}`));
    console.log(chalk.white.bold(`ITERATION ${iterationNum}/${MAX_ITERATIONS}`));
    console.log(chalk.cyan('─'.repeat(60)) + '\n');
    
    const project = await planPhase();
    if (!project) break;
    
    console.log(chalk.cyan('\n🔨 Build Phase:'));
    const buildResult = await buildPhase(project, dryRun);
    
    console.log(chalk.cyan('\n🚀 Push Phase:'));
    const pushResult = await pushPhase(project, dryRun);
    
    if (pushResult.success) totalProjectsCreated++;
    currentProjectIndex++;
    
    logIteration(iterationNum, project, pushResult, Date.now() - iterationStart);
    displayStats();
  }
  
  displayStats();
  console.log(chalk.green('✓ Loop completed\n'));
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');
const live = args.includes('--live');

if (!live && !dryRun) {
  console.log(chalk.yellow('Running in dry-run mode. Use --live to create actual repos.\n'));
  dryRun = true;
}

runLoop({ dryRun });
