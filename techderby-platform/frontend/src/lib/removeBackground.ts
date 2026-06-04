/**
 * Browser-side background removal using @huggingface/transformers + MODNet.
 *
 * - Library licence: Apache-2.0
 * - Model (`Xenova/modnet`): MIT (port of MODNet)
 * - Runs entirely in the browser via ONNX Runtime Web (WASM / WebGPU).
 *
 * The model weights are fetched from the Hugging Face CDN on first use
 * (~25 MB) and cached by the browser thereafter. Inference takes a few
 * seconds on a typical laptop CPU.
 */

// Cache the model + processor across calls so we only download / initialise
// once per page load.
type ModnetModel = Awaited<ReturnType<typeof loadModnet>>['model'];
type ModnetProcessor = Awaited<ReturnType<typeof loadModnet>>['processor'];

let initPromise: Promise<{ model: ModnetModel; processor: ModnetProcessor }> | null = null;

async function loadModnet() {
  const transformers = await import('@huggingface/transformers');
  const { AutoModel, AutoProcessor, env } = transformers;

  // We always pull models from the hub; do not try to load from disk.
  env.allowLocalModels = false;

  const [model, processor] = await Promise.all([
    AutoModel.from_pretrained('Xenova/modnet', { dtype: 'fp32' }),
    AutoProcessor.from_pretrained('Xenova/modnet'),
  ]);

  return { model, processor };
}

function ensureLoaded() {
  if (!initPromise) initPromise = loadModnet();
  return initPromise;
}

/** Optional progress callback. Currently only fires for the broad phases. */
export type ProgressFn = (phase: 'loading' | 'processing' | 'compositing') => void;

/**
 * Remove the background from an image and return a PNG Blob with a
 * transparent background.
 */
export async function removeBackground(
  source: Blob | File,
  onProgress?: ProgressFn,
): Promise<Blob> {
  onProgress?.('loading');
  const { model, processor } = await ensureLoaded();
  const { RawImage } = await import('@huggingface/transformers');

  onProgress?.('processing');
  const url = URL.createObjectURL(source);
  let image: InstanceType<typeof RawImage>;
  try {
    image = await RawImage.fromURL(url);
  } finally {
    URL.revokeObjectURL(url);
  }

  // The processor resizes / normalises the image into the tensor MODNet
  // expects. The model output is a single-channel alpha mask in [0, 1].
  const { pixel_values } = await processor(image);
  const output = await model({ input: pixel_values });

  // Different transformers builds expose the output tensor under either
  // `output` or as the first positional value. Handle both.
  const maskTensor =
    'output' in output
      ? (output as { output: { data: Float32Array; dims: number[] } }).output
      : (Object.values(output)[0] as { data: Float32Array; dims: number[] });

  // Build a RawImage from the mask tensor and resize it back to the source
  // dimensions so we can use it as the alpha channel.
  const maskRaw = new RawImage(
    new Uint8ClampedArray(maskTensor.data.length),
    maskTensor.dims[3] ?? maskTensor.dims[2],
    maskTensor.dims[2] ?? maskTensor.dims[1],
    1,
  );
  for (let i = 0; i < maskTensor.data.length; i++) {
    maskRaw.data[i] = Math.max(0, Math.min(255, Math.round(maskTensor.data[i] * 255)));
  }
  const resizedMask = await maskRaw.resize(image.width, image.height);

  onProgress?.('compositing');

  // Composite original RGB with the predicted alpha onto a new canvas.
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context for background removal output');

  ctx.drawImage(image.toCanvas(), 0, 0);
  const pixels = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < resizedMask.data.length; i++) {
    pixels.data[i * 4 + 3] = resizedMask.data[i];
  }
  ctx.putImageData(pixels, 0, 0);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode background-removed image as PNG'));
    }, 'image/png');
  });
}
