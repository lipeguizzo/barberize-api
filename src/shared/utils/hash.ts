import { BinaryLike, createHash } from 'crypto';
import { Readable } from 'stream';

export async function hashMd5(data: BinaryLike | Readable): Promise<string> {
  const hash = createHash('md5');

  if (data instanceof Readable) {
    for await (const element of data) {
      hash.update(element);
    }
  } else {
    hash.update(data);
  }

  return hash.digest('hex');
}
