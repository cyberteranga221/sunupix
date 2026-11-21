/// <reference lib="webworker" />
/**
 * Worker de conversion : reçoit un fichier, renvoie l'image convertie.
 * Plusieurs workers tournent en parallèle (voir worker-pool.ts).
 */
import { toErrorCode } from './errors';
import { convertImage } from './pipeline';
import type { ConvertRequest, WorkerResponse } from './protocol';

declare const self: DedicatedWorkerGlobalScope;

async function heapBytes(): Promise<number> {
  // Ne charge pas libheif juste pour mesurer : l'import est déjà résolu s'il a servi.
  const { heicHeapBytes } = await import('./decoders/heic');
  return heicHeapBytes();
}

self.onmessage = async (event: MessageEvent<ConvertRequest>) => {
  const { jobId, job } = event.data;
  let response: WorkerResponse;
  try {
    const output = await convertImage(job);
    response = { type: 'result', jobId, output, heapBytes: await heapBytes() };
  } catch (error) {
    response = {
      type: 'error',
      jobId,
      code: toErrorCode(error),
      message: error instanceof Error ? error.message : String(error),
      heapBytes: await heapBytes(),
    };
  }
  self.postMessage(response);
};
