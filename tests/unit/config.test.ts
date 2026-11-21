import { describe, expect, it } from 'vitest';
import { FEATURES, LIMITS } from '../../src/config';

describe('configuration', () => {
  it('respecte les limites du cahier des charges', () => {
    expect(LIMITS.maxFiles).toBe(400);
    expect(LIMITS.maxFileBytes).toBe(50 * 1024 * 1024);
    expect(LIMITS.minConcurrency).toBeLessThanOrEqual(LIMITS.maxConcurrency);
  });

  it('désactive la monétisation par défaut', () => {
    expect(FEATURES.ads).toBe(false);
    expect(FEATURES.donate).toBe(false);
  });
});
