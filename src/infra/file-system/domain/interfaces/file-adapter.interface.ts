import { Readable } from 'stream';

export interface IFileAdapter {
  name: string;
  relativePath: string;
  content: Buffer | Readable;
  length: number;
  contentType: string;
}
