import { describe, expect, it } from 'vitest';
import { computeConcurrency } from '../../src/engine/device';

describe('parallélisme', () => {
  it('utilise la moitié des cœurs, entre 2 et 4', () => {
    expect(computeConcurrency({ cores: 2, isIOS: false, memoryGB: null })).toBe(2);
    expect(computeConcurrency({ cores: 6, isIOS: false, memoryGB: 8 })).toBe(3);
    expect(computeConcurrency({ cores: 12, isIOS: false, memoryGB: 16 })).toBe(4);
  });

  it('reste prudent sur iPhone et appareils à faible mémoire', () => {
    expect(computeConcurrency({ cores: 6, isIOS: true, memoryGB: null })).toBe(2);
    expect(computeConcurrency({ cores: 8, isIOS: false, memoryGB: 4 })).toBe(2);
  });
});
