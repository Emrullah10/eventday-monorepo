#!/usr/bin/env node
/**
 * Concatenates the numbered domain SQL files under db-schemas/ into
 * db-schemas/combined-schema.sql, in filename order. This keeps a single
 * generated file DBA/ops can review or hand to `psql` directly, while each
 * domain's schema stays editable as its own small file.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.join(__dirname, '..', 'db-schemas');
const outputFile = path.join(schemasDir, 'combined-schema.sql');

const run = async () => {
  const entries = await readdir(schemasDir);
  const domainFiles = entries
    .filter((name) => /^\d{2}-.*\.sql$/.test(name))
    .sort();

  const header = [
    '-- GENERATED FILE — do not edit by hand. Run `npm run build:schema` to regenerate.',
    '-- Source of truth: db-schemas/*.sql (numbered, applied in order).',
    '',
  ].join('\n');

  const parts = [];
  for (const file of domainFiles) {
    const content = await readFile(path.join(schemasDir, file), 'utf8');
    parts.push(content.trim());
  }

  await writeFile(outputFile, `${header}\n${parts.join('\n\n')}\n`);
  console.log(`Wrote ${outputFile} from ${domainFiles.length} file(s): ${domainFiles.join(', ')}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
