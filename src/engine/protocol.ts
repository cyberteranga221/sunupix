import type { ConvertJob, ConvertOutput, ErrorCode } from './types';

/** Messages échangés entre le thread principal et les workers de conversion. */
export interface ConvertRequest {
  type: 'convert';
  jobId: number;
  job: ConvertJob;
}

export type WorkerResponse =
  | { type: 'result'; jobId: number; output: ConvertOutput; heapBytes: number }
  | { type: 'error'; jobId: number; code: ErrorCode; message: string; heapBytes: number };
