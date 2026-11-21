import { describe, expect, it } from 'vitest';
import { ConversionError, toErrorCode } from '../../src/engine/errors';

describe('erreurs', () => {
  it('conserve le code d’une ConversionError', () => {
    expect(toErrorCode(new ConversionError('canvas-too-large'))).toBe('canvas-too-large');
  });

  it('reconnaît un code transmis par un worker (objet simple)', () => {
    expect(toErrorCode({ code: 'corrupt', message: 'x' })).toBe('corrupt');
    expect(toErrorCode({ code: 'n-importe-quoi' })).toBe('unknown');
  });

  it('traduit les erreurs du navigateur', () => {
    expect(toErrorCode(new RangeError('Array buffer allocation failed'))).toBe('out-of-memory');
    expect(
      toErrorCode(new DOMException('The source image cannot be decoded.', 'InvalidStateError')),
    ).toBe('corrupt');
    expect(toErrorCode('bizarre')).toBe('unknown');
  });
});
