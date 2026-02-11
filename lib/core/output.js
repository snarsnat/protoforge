/**
 * ProtoForge Output Handler
 * Manages file creation, directory structure, and ZIP generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parse AI response and extract structured data
 * @param {string} response - Raw AI response
 * @returns {Object} Parsed response object
 */
export function parseAIResponse(response) {
  // Try to extract JSON from markdown code blocks
  let jsonStr = response;
  
  // Remove markdown code block markers
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Clean up the string
  jsonStr = jsonStr.trim();
  
  // Try to find JSON object in the response
  const braceStart = jsonStr.indexOf('{');
  const braceEnd = jsonStr.lastIndexOf('}');
  
  if (braceStart !== -1 && braceEnd !== -1) {
    jsonStr = jsonStr.substring(braceStart, braceEnd + 1);
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // If JSON parsing fails, return raw response
    return {
      rawResponse: response,
      error: 'Failed to parse JSON from response'
    };
  }
}

/**
 * Create project structure from parsed response
 * @param {Object} parsedResponse - Parsed AI response
 * @param {string} projectDir - Project directory path
 * @param {string} originalDescription - Original user description
 * @returns {Promise<Object>} Creation result with file list
 */
export async function generateProjectFromResponse(response, projectDir, originalDescription) {
  const parsed = parseAIResponse(response);

  // Create project structure (ProtoForge standard output)
  await createProjectStructure(projectDir);

  // Write raw prototype spec
  await fs.promises.writeFile(
    path.join(projectDir, 'prototype.json'),
    JSON.stringify(parsed, null, 2),
    'utf-8'
  );

  // Write generated assets
  const files = await writeCodeSnippets(projectDir, parsed);
  await writeDocumentation(projectDir, parsed, originalDescription);
  await generateDiagrams(projectDir, parsed);
  await generateBOM(projectDir, parsed);
  await writeReport(projectDir, parsed, originalDescription);

  return {
    success: true,
    files,
    parsed
  };
}

/**
 * Create directory structure for the project
 * @param {string} projectDir - Project root directory
 * @param {Object} parsed - Parsed response data
 */
async function createProjectStructure(projectDir) {
  // Standard ProtoForge output structure (matches README)
  const dirs = ['code', 'schematics', 'docs'];
  for (const dir of dirs) {
    await fs.promises.mkdir(path.join(projectDir, dir), { recursive: true });
  }
}

/**
 * Write all code snippets to files
 * @param {string} projectDir - Project directory path
 * @param {Object} parsed - Parsed response data
 * @returns {Promise<Array>} List of created files
 */
async function writeCodeSnippets(projectDir, parsed) {
  const files = [];
  const codeSnippets = parsed.codeSnippets || parsed.files || [];

  for (const snippet of codeSnippets) {
    const rawName = snippet.fileName || snippet.filename || snippet.name;
    const code = snippet.code || snippet.content;
    const language = snippet.language || snippet.extension || 'txt';

    if (!rawName || !code) continue;

    // If the model gives a bare filename, place it under code/.
    // If it already includes a directory, respect it.
    const fileName = rawName.includes('/') ? rawName : path.join('code', rawName);
    const filePath = path.join(projectDir, fileName);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, code, 'utf-8');

    files.push({ name: fileName, path: filePath, language });
  }

  return files;
}

/**
 * Write project documentation
 * @param {string} projectDir - Project directory path
 * @param {Object} parsed - Parsed response data
 * @param {string} originalDescription - Original user description
 */
async function writeDocumentation(projectDir, parsed, originalDescription) {
  const overview = parsed.overview || {};
  const techStack = parsed.techStack || {};

  const projectName = overview.projectName || 'ProtoForge Project';
  const description = overview.description || originalDescription;

  // Root README for the generated prototype package (not the ProtoForge tool itself).
  const readme = `# ${projectName}\n\n` +
    `## Overview\n${description}\n\n` +
    `## Category\n${overview.category || 'N/A'}\n\n` +
    `## Difficulty\n${overview.difficulty || 'N/A'}\n\n` +
    `## Estimated Time\n${overview.estimatedTime || 'N/A'}\n\n` +
    `## Tech Stack\n\n` +
    `${formatTechStack(techStack)}\n\n` +
    `## Output Layout\n\n` +
    `- code/ (source code)\n` +
    `- schematics/ (Mermaid diagrams, wiring notes)\n` +
    `- docs/ (build guide, issues, overview)\n` +
    `- bom.csv (bill of materials)\n` +
    `- report.md (single-file summary)\n` +
    `- prototype.json (raw AI output)\n`;

  await fs.promises.writeFile(path.join(projectDir, 'README.md'), readme, 'utf-8');

  // docs/overview.md
  await fs.promises.writeFile(
    path.join(projectDir, 'docs', 'overview.md'),
    `# ${projectName}\n\n${description}\n`,
    'utf-8'
  );

  // docs/tech-stack.md
  await fs.promises.writeFile(
    path.join(projectDir, 'docs', 'tech-stack.md'),
    `# Tech Stack\n\n${formatTechStack(techStack)}\n`,
    'utf-8'
  );

  // docs/build-guide.md
  if (parsed.buildGuide) {
    await fs.promises.writeFile(
      path.join(projectDir, 'docs', 'build-guide.md'),
      `# Build Guide\n\n${formatBuildGuide(parsed.buildGuide)}\n`,
      'utf-8'
    );
  }

  // docs/issues-and-fixes.md
  if (Array.isArray(parsed.issuesAndFixes) && parsed.issuesAndFixes.length) {
    const body = parsed.issuesAndFixes
      .map((i, idx) => {
        const p = i.problem || i.issue || 'Issue';
        const s = i.solution || '—';
        const prev = i.prevention || '—';
        return `## ${idx + 1}. ${p}\n\n**Solution**\n${s}\n\n**Prevention**\n${prev}\n`;
      })
      .join('\n');
    await fs.promises.writeFile(
      path.join(projectDir, 'docs', 'issues-and-fixes.md'),
      `# Issues & Fixes\n\n${body}\n`,
      'utf-8'
    );
  }

  // Optional: 3D description
  if (parsed.threeDDescription) {
    await fs.promises.writeFile(
      path.join(projectDir, 'schematics', '3d-description.md'),
      `# 3D / Enclosure Notes\n\n${format3D(parsed.threeDDescription)}\n`,
      'utf-8'
    );
  }

  // Any extra guides from model
  if (Array.isArray(parsed.guides)) {
    for (const guide of parsed.guides) {
      const title = String(guide.title || 'guide').trim();
      const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const guidePath = path.join(projectDir, 'docs', `${safe || 'guide'}.md`);
      await fs.promises.writeFile(guidePath, `# ${title}\n\n${guide.content || ''}`, 'utf-8');
    }
  }
}

/**
 * Generate and save diagram files
 * @param {string} projectDir - Project directory path
 * @param {Object} parsed - Parsed response data
 */
async function generateDiagrams(projectDir, parsed) {
  // Prompt defines schematic as a Mermaid string; some models may nest it.
  const schematic = parsed.schematic;
  const mermaid =
    typeof schematic === 'string'
      ? schematic
      : schematic?.mermaid || schematic?.diagram || parsed.diagram?.mermaid;

  if (mermaid) {
    await fs.promises.writeFile(
      path.join(projectDir, 'schematics', 'diagram.mmd'),
      String(mermaid).trim() + '\n',
      'utf-8'
    );
    await fs.promises.writeFile(
      path.join(projectDir, 'docs', 'architecture.mmd'),
      String(mermaid).trim() + '\n',
      'utf-8'
    );
  }
}

/**
 * Generate Bill of Materials for hardware projects
 * @param {string} projectDir - Project directory path
 * @param {Object} parsed - Parsed response data
 */
async function generateBOM(projectDir, parsed) {
  const bom = parsed.bom || parsed.billOfMaterials;
  const items = Array.isArray(bom) ? bom : bom?.components || [];

  if (!Array.isArray(items) || items.length === 0) return;

  // Root bom.csv (as README promises)
  const csvHeader = ['partNumber', 'description', 'quantity', 'unitPrice', 'link'];
  const csv = [csvHeader.join(',')]
    .concat(
      items.map((i) =>
        [
          csvEscape(i.partNumber || ''),
          csvEscape(i.description || i.name || ''),
          csvEscape(String(i.quantity ?? 1)),
          csvEscape(i.unitPrice ?? ''),
          csvEscape(i.link || '')
        ].join(',')
      )
    )
    .join('\n');

  await fs.promises.writeFile(path.join(projectDir, 'bom.csv'), csv + '\n', 'utf-8');

  // docs/bom.md (human-friendly)
  const md =
    `# Bill of Materials\n\n` +
    `| # | Part Number | Description | Qty | Unit Price | Link |\n` +
    `|---:|------------|-------------|---:|-----------:|------|\n` +
    items
      .map((i, idx) => {
        const pn = i.partNumber || '';
        const desc = i.description || i.name || '';
        const qty = i.quantity ?? 1;
        const price = i.unitPrice ?? '';
        const link = i.link ? `[link](${i.link})` : '';
        return `| ${idx + 1} | ${pn} | ${desc} | ${qty} | ${price} | ${link} |`;
      })
      .join('\n') +
    `\n`;

  await fs.promises.writeFile(path.join(projectDir, 'docs', 'bom.md'), md, 'utf-8');
}

/**
 * Create a ZIP archive of the project
 * @param {string} projectDir - Project directory path
 * @param {string} outputName - Output filename (without extension)
 * @returns {Promise<string>} Path to created ZIP file
 */
export async function createProjectZip(projectDir, outputName = null) {
  const zip = new JSZip();
  const baseName = outputName || path.basename(projectDir);
  
  // Add all files to ZIP
  await addDirToZip(zip, projectDir, '');
  
  // Generate ZIP file
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const zipPath = `${projectDir}.zip`;
  await fs.promises.writeFile(zipPath, zipBuffer);
  
  return zipPath;
}

/**
 * Recursively add directory contents to ZIP
 * @param {JSZip} zip - JSZip instance
 * @param {string} dir - Directory path
 * @param {string} zipPath - Current path within ZIP
 */
async function addDirToZip(zip, dir, zipPath) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(zipPath, entry.name);
    
    // Skip hidden files and node_modules
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    
    if (entry.isDirectory()) {
      await addDirToZip(zip, fullPath, relativePath);
    } else if (entry.isFile()) {
      const content = await fs.promises.readFile(fullPath);
      zip.file(relativePath, content);
    }
  }
}

/**
 * Get file tree as string
 * @param {string} dir - Directory path
 * @param {string} prefix - Prefix for indentation
 * @returns {string} File tree string
 */
export async function getFileTree(dir, prefix = '') {
  let tree = '';
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  // Sort: directories first, then files, alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  
  for (const entry of entries) {
    // Skip hidden files
    if (entry.name.startsWith('.')) continue;
    
    const fullPath = path.join(dir, entry.name);
    const isLast = entry === entries[entries.length - 1];
    
    if (entry.isDirectory()) {
      tree += `${prefix}${isLast ? '└── ' : '├── '}${entry.name}/\n`;
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree += await getFileTree(fullPath, newPrefix);
    } else {
      tree += `${prefix}${isLast ? '└── ' : '├── '}${entry.name}\n`;
    }
  }
  
  return tree;
}

/**
 * Clean up project output directory
 * @param {string} projectDir - Project directory path
 */
export async function cleanupProject(projectDir) {
  if (fs.existsSync(projectDir)) {
    await fs.promises.rm(projectDir, { recursive: true, force: true });
  }
}

async function writeReport(projectDir, parsed, originalDescription) {
  const overview = parsed.overview || {};
  const name = overview.projectName || 'ProtoForge Project';
  const desc = overview.description || originalDescription;

  const nextSteps = Array.isArray(parsed.nextSteps)
    ? parsed.nextSteps.map((s) => `- ${s}`).join('\n')
    : '';

  const issues = Array.isArray(parsed.issuesAndFixes)
    ? parsed.issuesAndFixes
        .map((i) => `- ${i.problem || i.issue}: ${i.solution || ''}`)
        .join('\n')
    : '';

  const report =
    `# ${name}\n\n` +
    `## Summary\n${desc}\n\n` +
    `## Tech Stack\n${formatTechStack(parsed.techStack || {})}\n\n` +
    `## Files\n- prototype.json\n- bom.csv\n- schematics/diagram.mmd\n- docs/*\n- code/*\n\n` +
    (issues ? `## Issues & Fixes\n${issues}\n\n` : '') +
    (nextSteps ? `## Next Steps\n${nextSteps}\n\n` : '');

  await fs.promises.writeFile(path.join(projectDir, 'report.md'), report, 'utf-8');
}

function formatTechStack(techStack) {
  // Accept both the README-style techStack and any model variants.
  const hw = techStack.hardware || techStack.hw || [];
  const sw = techStack.software || techStack.softwareStack || [];
  const protocols = techStack.protocols || [];
  const tools = techStack.tools || [];

  const lines = [];
  if (Array.isArray(hw) && hw.length) lines.push('### Hardware\n' + hw.map((x) => `- ${x}`).join('\n'));
  if (Array.isArray(sw) && sw.length) lines.push('### Software\n' + sw.map((x) => `- ${x}`).join('\n'));
  if (Array.isArray(protocols) && protocols.length) lines.push('### Protocols\n' + protocols.map((x) => `- ${x}`).join('\n'));
  if (Array.isArray(tools) && tools.length) lines.push('### Tools\n' + tools.map((x) => `- ${x}`).join('\n'));

  return lines.length ? lines.join('\n\n') : '_Not specified_';
}

function formatBuildGuide(buildGuide) {
  if (typeof buildGuide === 'string') return buildGuide;
  if (Array.isArray(buildGuide)) return buildGuide.map((s, i) => `${i + 1}. ${s}`).join('\n');
  if (buildGuide && typeof buildGuide === 'object') {
    // step1/step2... or arbitrary keys
    return Object.entries(buildGuide)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([k, v]) => `## ${k}\n${v}`)
      .join('\n\n');
  }
  return '';
}

function format3D(threeD) {
  if (typeof threeD === 'string') return threeD;
  const enclosure = threeD.enclosure ? `## Enclosure\n${threeD.enclosure}\n` : '';
  const mounting = threeD.mounting ? `## Mounting\n${threeD.mounting}\n` : '';
  return (enclosure + '\n' + mounting).trim();
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export default {
  parseAIResponse,
  generateProjectFromResponse,
  createProjectZip,
  getFileTree,
  cleanupProject
};
