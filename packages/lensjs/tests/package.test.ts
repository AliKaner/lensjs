import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

// Release-readiness checks: everything npm publish ships must actually exist
// and the manifest must stay publishable. Run `npm run build` before testing.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function exportTargets(entry: unknown): string[] {
  if (typeof entry === 'string') return [entry];
  if (entry && typeof entry === 'object') return Object.values(entry).flatMap(exportTargets);
  return [];
}

describe('package.json release readiness', () => {
  it('should be the public scoped package', () => {
    expect(pkg.name).toBe('@alikaner/lensjs');
    expect(pkg.publishConfig?.access).toBe('public');
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should point every export to an existing file', () => {
    const targets = exportTargets(pkg.exports);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(existsSync(join(root, target)), `${target} is missing — run npm run build`).toBe(true);
    }
  });

  it('should ship the stylesheet and keep it side-effectful', () => {
    expect(pkg.files).toContain('styles.css');
    expect(existsSync(join(root, 'styles.css'))).toBe(true);
    // Without this, bundlers tree-shake the CSS import away
    expect(pkg.sideEffects).toContain('**/*.css');
  });

  it('should include the license and readme', () => {
    expect(existsSync(join(root, 'LICENSE'))).toBe(true);
    expect(existsSync(join(root, 'README.md'))).toBe(true);
    expect(pkg.license).toBe('MIT');
  });

  it('should keep react a peer dependency, not a hard dependency', () => {
    expect(pkg.peerDependencies?.react).toBeDefined();
    expect(pkg.dependencies).toBeUndefined();
  });

  it('should build before publishing', () => {
    expect(pkg.scripts?.prepublishOnly).toContain('build');
  });
});
