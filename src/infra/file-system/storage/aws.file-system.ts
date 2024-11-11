import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IFileAdapter } from '../domain/interfaces/file-adapter.interface';

export class AwsFileSystem {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async put(file: IFileAdapter): Promise<void> {
    const params = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${file.relativePath}/${file.name}`,
      Body: file.content,
      ContentType: file.contentType,
    });

    await this.s3.send(params);
  }

  async get(relativePath: string, fileName: string): Promise<IFileAdapter> {
    const params = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${relativePath}/${fileName}`,
    });

    const { Body, ContentType, ContentLength } = await this.s3.send(params);

    return {
      name: fileName,
      relativePath: relativePath,
      content: Buffer.from(await Body.transformToByteArray()),
      contentType: ContentType,
      length: ContentLength,
    };
  }

  async delete(key: string): Promise<void> {
    const params = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await this.s3.send(params);
  }
}
