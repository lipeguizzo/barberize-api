import { IFileAdapter } from '../../infra/file-system/domain/interfaces/file-adapter.interface';

export function generateFileAdapterFromUploadFile(
  file: Express.Multer.File,
): IFileAdapter {
  return {
    name: file.originalname,
    relativePath: file.path,
    content: file.buffer,
    contentType: file.mimetype,
    length: file.size,
  };
}

export function generateFileName(fileName: string): string {
  const utcDate = new Date();
  const offset = -3; // São Paulo is UTC-3
  const currentDate: Date = new Date(
    utcDate.getTime() + offset * 60 * 60 * 1000,
  );

  const day: string = String(currentDate.getDate()).padStart(2, '0');
  const month: string = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year: number = currentDate.getFullYear();
  const hours: string = String(currentDate.getHours()).padStart(2, '0');
  const minutes: string = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds: string = String(currentDate.getSeconds()).padStart(2, '0');

  const name: string = getFileName(fileName);
  const extension: string = getFileExtension(fileName);
  return `${name}-${day}-${month}-${year}-${hours}-${minutes}-${seconds}${extension}`;
}

export function getFileExtension(fileName: string): string {
  const extension: string = fileName.slice(fileName.lastIndexOf('.'));
  return extension;
}

export function getFileName(fileName: string): string {
  const name: string = fileName.split('.').slice(0, -1).join('.');
  return name;
}
