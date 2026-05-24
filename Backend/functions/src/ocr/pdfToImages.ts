import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import { fromPath } from 'pdf2pic';

export async function pdfToImages(
  pdfUrl: string
): Promise<string[]> {

  // temp directory
  const tempDir =
    path.join(os.tmpdir(), 'pdf-images');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
      recursive: true
    });
  }

  // temp pdf path
  const pdfPath =
    path.join(
      tempDir,
      `temp-${Date.now()}.pdf`
    );

  // download pdf
  const response =
    await axios.get(pdfUrl, {
      responseType: 'arraybuffer'
    });

  fs.writeFileSync(
    pdfPath,
    response.data
  );

  // converter config
  const convert =
    fromPath(pdfPath, {
      density: 200,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 1200,
      height: 1600
    });

  const imagePaths: string[] = [];

  // convert first 5 pages
  // bisa diubah nanti
  for (let i = 1; i <= 5; i++) {

    try {

      const result =
        await convert(i);

      if (result.path) {
        imagePaths.push(
          result.path
        );
      }

    } catch (error) {

      console.log(
        `Page ${i} not found`
      );

      break;
    }
  }

  return imagePaths;
}