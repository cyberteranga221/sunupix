import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const fixture = (name: string): Uint8Array =>
  new Uint8Array(readFileSync(join(import.meta.dirname, '..', 'fixtures', name)));
