#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_SRC_DIR = join(__dirname, '../src');

const REGION_START = '// #region css-tokens';
const REGION_END = '// #endregion css-tokens';

function getComponentDirs(dir) {
  const entries = readdirSync(dir);
  const components = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && entry !== '__mocks__' && entry !== 'lib') {
      const indexPath = join(fullPath, 'index.ts');
      if (existsSync(indexPath)) {
        components.push({ name: entry, dir: fullPath, indexPath });
      }
    }
  }

  return components;
}

function findStyleFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && (entry.endsWith('.scss') || (entry.endsWith('.css') && !entry.startsWith('index')))) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractCssVariables(content) {
  const variables = {
    definitions: new Map(),
    usages: new Map()
  };

  const defRegex = /--([\w-]+)\s*:/g;
  let match;
  while ((match = defRegex.exec(content)) !== null) {
    const varName = `--${match[1]}`;
    const lineStart = content.lastIndexOf('\n', match.index) + 1;
    const lineEnd = content.indexOf('\n', match.index);
    const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();

    const valueMatch = line.match(new RegExp(`${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`));
    const value = valueMatch ? valueMatch[1].trim() : '';

    variables.definitions.set(varName, value);
  }

  const usageRegex = /var\(\s*--([\w-]+)/g;
  while ((match = usageRegex.exec(content)) !== null) {
    const varName = `--${match[1]}`;
    const startIdx = match.index + match[0].length;

    let fallback = '';
    if (content[startIdx] === ',') {
      let depth = 1;
      let i = startIdx + 1;
      let fallbackStart = i;

      while (i < content.length && depth > 0) {
        if (content[i] === '(') depth++;
        else if (content[i] === ')') depth--;
        i++;
      }

      if (depth === 0) {
        fallback = content.slice(fallbackStart, i - 1).trim();
      }
    }

    if (!variables.usages.has(varName) || (fallback && !variables.usages.get(varName))) {
      variables.usages.set(varName, fallback);
    }
  }

  return variables;
}

function detectComponentPrefix(variables, componentName) {
  const prefix = `--${componentName}-`;
  const allVars = [...variables.definitions.keys(), ...variables.usages.keys()];
  const count = allVars.filter((v) => v.startsWith(prefix)).length;
  return count > 0 ? prefix : null;
}

function filterComponentVars(variables, prefix) {
  const filtered = [];

  const allVars = new Set([...variables.definitions.keys(), ...variables.usages.keys()]);

  for (const varName of allVars) {
    if (!varName.startsWith(prefix) || varName.includes('-internal-')) {
      continue;
    }
    const defaultValue = variables.definitions.get(varName) || variables.usages.get(varName) || '';
    filtered.push({ name: varName, defaultValue });
  }

  filtered.sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}

function generateTokenComment(componentName, vars, prefix) {
  const lines = [];
  lines.push('/**');
  lines.push(` * CSS Tokens for ${componentName}`);
  lines.push(` * Prefix: \`${prefix}\``);
  lines.push(' *');
  lines.push(' * | Token | Default |');
  lines.push(' * |-------|---------|');

  for (const v of vars) {
    const escapedValue = (v.defaultValue || '-').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const truncatedValue = escapedValue.length > 50 ? escapedValue.slice(0, 47) + '...' : escapedValue;
    lines.push(` * | \`${v.name}\` | \`${truncatedValue}\` |`);
  }

  lines.push(' */');

  return lines.join('\n');
}

function updateIndexFile(indexPath, tokenComment) {
  let content = readFileSync(indexPath, 'utf-8');

  const regionStartIdx = content.indexOf(REGION_START);
  const regionEndIdx = content.indexOf(REGION_END);

  const newRegion = `${REGION_START}\n${tokenComment}\n${REGION_END}`;

  if (regionStartIdx !== -1 && regionEndIdx !== -1) {
    const before = content.slice(0, regionStartIdx);
    const after = content.slice(regionEndIdx + REGION_END.length);
    content = before + newRegion + after;
  } else {
    content = newRegion + '\n\n' + content;
  }

  return content;
}

function removeTokenRegion(indexPath) {
  let content = readFileSync(indexPath, 'utf-8');

  const regionStartIdx = content.indexOf(REGION_START);
  const regionEndIdx = content.indexOf(REGION_END);

  if (regionStartIdx !== -1 && regionEndIdx !== -1) {
    const before = content.slice(0, regionStartIdx);
    const after = content.slice(regionEndIdx + REGION_END.length);
    content = (before + after).replace(/^\n+/, '');
    return content;
  }

  return null;
}

function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes('--check');

  const components = getComponentDirs(UI_SRC_DIR);
  let hasChanges = false;
  const results = [];
  const skipped = [];

  for (const { name, dir, indexPath } of components) {
    const styleFiles = findStyleFiles(dir);

    if (styleFiles.length === 0) {
      continue;
    }

    const variables = { definitions: new Map(), usages: new Map() };

    for (const file of styleFiles) {
      const content = readFileSync(file, 'utf-8');
      const extracted = extractCssVariables(content);

      for (const [varName, value] of extracted.definitions) {
        variables.definitions.set(varName, value);
      }

      for (const [varName, fallback] of extracted.usages) {
        if (!variables.usages.has(varName) || (fallback && !variables.usages.get(varName))) {
          variables.usages.set(varName, fallback);
        }
      }
    }

    const prefix = detectComponentPrefix(variables, name);

    if (!prefix) {
      const removedContent = removeTokenRegion(indexPath);
      if (removedContent) {
        const currentContent = readFileSync(indexPath, 'utf-8');
        if (checkMode) {
          if (removedContent !== currentContent) {
            console.error(`Should remove tokens: ${relative(process.cwd(), indexPath)}`);
            hasChanges = true;
          }
        } else {
          writeFileSync(indexPath, removedContent);
        }
      }
      skipped.push(name);
      continue;
    }

    const filteredVars = filterComponentVars(variables, prefix);

    if (filteredVars.length === 0) {
      skipped.push(name);
      continue;
    }

    const tokenComment = generateTokenComment(name, filteredVars, prefix);
    const updatedContent = updateIndexFile(indexPath, tokenComment);
    const currentContent = readFileSync(indexPath, 'utf-8');

    if (checkMode) {
      if (updatedContent !== currentContent) {
        console.error(`Outdated: ${relative(process.cwd(), indexPath)}`);
        hasChanges = true;
      }
    } else {
      if (updatedContent !== currentContent) {
        writeFileSync(indexPath, updatedContent);
        results.push({ component: name, tokens: filteredVars.length, prefix });
      }
    }
  }

  if (checkMode) {
    if (hasChanges) {
      console.error('\nRun `pnpm run tokens` to update token documentation.');
      process.exit(1);
    } else {
      console.log('Token documentation is up to date.');
    }
  } else {
    if (results.length > 0) {
      console.log('Updated token documentation:');
      for (const r of results.sort((a, b) => a.component.localeCompare(b.component))) {
        console.log(`  ${r.component}: ${r.tokens} tokens (${r.prefix}*)`);
      }
    } else {
      console.log('All token documentation already up to date.');
    }

    if (skipped.length > 0) {
      console.log(`\nSkipped (no component prefix): ${skipped.join(', ')}`);
    }
  }
}

main();
