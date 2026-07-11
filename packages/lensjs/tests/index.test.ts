import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { version } from '../src';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

describe('lensjs core', () => {
  it('should keep the exported version in sync with package.json', () => {
    expect(version).toBe(pkg.version);
  });
});
