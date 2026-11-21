import { describe, expect, it } from 'vitest';
import { computeTargetSize } from '../../src/engine/dimensions';

const BIG = 1e12;

describe('taille de sortie', () => {
  it('garde la taille d’origine par défaut', () => {
    expect(computeTargetSize(4032, 3024, null, BIG, 16384)).toEqual({
      width: 4032,
      height: 3024,
      limitedByDevice: false,
    });
  });

  it('réduit au côté le plus long demandé sans déformer', () => {
    expect(computeTargetSize(4032, 3024, 1920, BIG, 16384)).toMatchObject({
      width: 1920,
      height: 1440,
    });
    expect(computeTargetSize(3024, 4032, 1920, BIG, 16384)).toMatchObject({
      width: 1440,
      height: 1920,
    });
  });

  it('n’agrandit jamais', () => {
    expect(computeTargetSize(800, 600, 3840, BIG, 16384)).toMatchObject({
      width: 800,
      height: 600,
    });
  });

  it('réduit une photo 48 Mpx pour la limite de canvas iOS', () => {
    const size = computeTargetSize(8064, 6048, null, 16_777_216, 16384);
    expect(size.limitedByDevice).toBe(true);
    expect(size.width * size.height).toBeLessThanOrEqual(16_777_216);
    expect(size.width / size.height).toBeCloseTo(8064 / 6048, 2);
  });

  it('respecte le côté maximal du canvas', () => {
    const size = computeTargetSize(20000, 1000, null, BIG, 16384);
    expect(size.width).toBeLessThanOrEqual(16384);
    expect(size.limitedByDevice).toBe(true);
  });
});
