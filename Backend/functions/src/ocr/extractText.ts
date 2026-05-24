import vision from '@google-cloud/vision';

// Jangan membuat instansi client di sini secara global!

export async function extractTextFromImage(imagePath: string) {
  // Buat instansi client di dalam scope fungsi
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;

  return detections?.[0]?.description || '';
}