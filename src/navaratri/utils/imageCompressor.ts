/**
 * Utility for client-side image compression.
 * Compresses Mandapam & Lord Idol photos using HTML5 Canvas
 * to preserve visual quality while dramatically reducing storage size.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export interface CompressResult {
  dataUrl: string;
  blob: Blob;
  originalSizeKB: number;
  compressedSizeKB: number;
  compressionRatioPercent: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File | Blob,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality !== undefined ? options.quality : 0.82;
  const mimeType = options.mimeType || "image/jpeg";

  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get 2D context from canvas."));
          return;
        }

        // Draw image onto canvas with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed."));
              return;
            }
            const compressedSizeKB = Math.round(blob.size / 1024);
            const compressionRatioPercent = originalSizeKB > 0
              ? Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100)
              : 0;

            resolve({
              dataUrl,
              blob,
              originalSizeKB,
              compressedSizeKB,
              compressionRatioPercent: Math.max(0, compressionRatioPercent),
              width,
              height,
            });
          },
          mimeType,
          quality
        );
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error("Empty image file result."));
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Downloads a data URL or image file directly to the device.
 */
export function downloadImage(imageUrl: string, fileName = "Sharan_Navaratri_Darshan.jpg"): void {
  try {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Failed to download image:", err);
    window.open(imageUrl, "_blank");
  }
}
