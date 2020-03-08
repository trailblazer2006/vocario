import { File } from './types';

export default function writeToFile(file: File, data: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const fs = file.createWriteStream({
      contentType: 'audio/mpeg',
      public: true,
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });
    fs.write(data, error => {
      if (error) {
        reject(error);
      } else {
        fs.end(() => resolve());
      }
    });
  });
}
