import { describe, it, expect } from 'vitest';
import { version } from '../src';

describe('lensjs placeholder suite', () => {
  it('should have a version', () => {
    expect(version).toBe('1.0.0');
  });
});
