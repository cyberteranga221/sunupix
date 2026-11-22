import { describe, expect, it } from 'vitest';
import { DEFAULT_OPTIONS, parseOptions } from '../../src/state/options';

describe('réglages mémorisés', () => {
  it('reprend des réglages valides', () => {
    const saved = {
      format: 'png',
      quality: 0.8,
      resize: '1080p',
      customMaxSide: 3000,
      metadata: 'keep-no-gps',
    };
    expect(parseOptions(saved)).toEqual(saved);
  });

  it('ignore les valeurs invalides ou corrompues', () => {
    expect(parseOptions(null)).toEqual(DEFAULT_OPTIONS);
    expect(parseOptions('n’importe quoi')).toEqual(DEFAULT_OPTIONS);
    expect(parseOptions({ format: 'gif', quality: 7, metadata: 'tout' })).toEqual({
      ...DEFAULT_OPTIONS,
      quality: 1,
    });
  });

  it('supprime les métadonnées par défaut', () => {
    expect(DEFAULT_OPTIONS.metadata).toBe('strip');
  });
});
