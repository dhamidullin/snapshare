import fs from 'fs'
import multer from 'multer';
import path from 'path';

export class FileService {
  public dataPath: string
  public upload: multer.Multer

  constructor(path: string) {
    try {
      // Check if path exists
      if (!fs.existsSync(path)) {
        throw new Error('Path does not exist')
      }

      // Check if path is a directory
      const stats = fs.statSync(path)
      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory')
      }

      // Check if directory is readable
      try {
        fs.accessSync(path, fs.constants.R_OK)
      } catch {
        throw new Error('Directory is not readable')
      }

      // Check if directory is writable
      try {
        fs.accessSync(path, fs.constants.W_OK)
      } catch {
        throw new Error('Directory is not writable')
      }

      // Store the validated path
      this.dataPath = path
      console.log('Data path:', this.dataPath)

      const storage = multer.diskStorage({
        destination(req, file, cb) {
          cb(null, path)
        },
        filename(req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          const finalFilename = `${uniqueSuffix}.${file.originalname}`
          cb(null, finalFilename)
        }
      })

      this.upload = multer({ storage })
    } catch (error) {
      throw new Error(`Invalid data folder path: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async saveFile(originalName: string, buffer: Buffer): Promise<{ filename: string }> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}.${originalName}`;
    const filePath = path.join(this.dataPath, filename);

    await fs.promises.writeFile(filePath, buffer);

    return {
      filename,
    };
  }
}

if (!process.env.DATA_PATH) {
  throw new Error('DATA_PATH environment variable is required');
}

export const fileService = new FileService(process.env.DATA_PATH);
