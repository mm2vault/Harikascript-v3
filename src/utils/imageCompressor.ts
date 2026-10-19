/**
 * Utility to compress image files before uploading or storing in Firestore.
 * Prevents Firestore document limit errors (max 1MB per document)
 * by downscaling large smartphone/desktop images to ~40-80 KB lightweight data URLs.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error('Resim verisi boş.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Resim yüklenemedi.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src); // fallback
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
