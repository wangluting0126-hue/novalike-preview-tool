import JSZip from 'jszip';
import type { AssetValidation, ParsedAnimationSequence, ParsedFrame } from '../types';

/**
 * Load an image from a File and return HTMLImageElement with dimensions
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Check if an image has transparency (checks alpha channel)
 */
export function checkTransparency(img: HTMLImageElement): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 250) return true;
  }
  return false;
}

/**
 * Validate Like Button PNG (strict — used for production asset check)
 */
export function validateLikeButton(file: File, img: HTMLImageElement): AssetValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (!file.name.toLowerCase().endsWith('.png')) {
    errors.push('File must be PNG format');
  }

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w !== 72 || h !== 72) {
    errors.push(`Size must be 72×72px, got ${w}×${h}px`);
  } else {
    info.push(`Size: ${w}×${h}px ✓`);
  }

  if (!checkTransparency(img)) {
    warnings.push('Image may not have transparent background');
  } else {
    info.push('Transparent background ✓');
  }

  return { valid: errors.length === 0, errors, warnings, info: info.join(' | ') };
}

/**
 * Validate Like Sticker PNG (strict)
 */
export function validateLikeSticker(file: File, img: HTMLImageElement): AssetValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (!file.name.toLowerCase().endsWith('.png')) {
    errors.push('File must be PNG format');
  }

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w !== 320 || h !== 320) {
    errors.push(`Size must be 320×320px, got ${w}×${h}px`);
  } else {
    info.push(`Size: ${w}×${h}px ✓`);
  }

  if (!checkTransparency(img)) {
    warnings.push('Image may not have transparent background');
  } else {
    info.push('Transparent background ✓');
  }

  return { valid: errors.length === 0, errors, warnings, info: info.join(' | ') };
}

// ─── Lenient Animation ZIP Parser ──────────────────────────────────

/** Extract the best numeric sequence index from a filename */
function extractSequenceIndex(filename: string): number {
  // Try to find the last sequence of digits in the filename (before extension)
  const baseName = filename.replace(/\.[^.]+$/, ''); // remove extension
  const matches = baseName.match(/(\d+)/g);
  if (!matches || matches.length === 0) return -1;
  // Use the last number found (most likely the frame index)
  return parseInt(matches[matches.length - 1], 10);
}

/** Check if a file should be skipped (hidden, macOS metadata, etc.) */
function shouldSkipFile(path: string): boolean {
  const parts = path.split(/[/\\]/);
  const fileName = parts[parts.length - 1];
  // Skip hidden files (starting with .)
  if (fileName.startsWith('.')) return true;
  // Skip macOS metadata directories
  if (parts.some((p) => p === '__MACOSX' || p.startsWith('._'))) return true;
  // Skip .DS_Store and Thumbs.db
  if (fileName === '.DS_Store' || fileName === 'Thumbs.db') return true;
  return false;
}

/** Load a single image from a Blob, returning null on failure */
async function loadImageFromBlobSafe(blob: Blob, name: string): Promise<ParsedFrame | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({
        name,
        url,
        img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null); // skip bad frames
    };
    img.src = url;
  });
}

/**
 * Leniently parse a ZIP file containing PNG sequence frames.
 *
 * Strategy:
 * - Recursively reads ALL files in the ZIP (including subdirectories)
 * - Skips __MACOSX, hidden files, non-PNG files
 * - Sorts by numeric index in filename; falls back to lexicographic
 * - Skips corrupted/unloadable frames silently
 * - Returns stats (frame count, first frame size, duration, skipped count)
 */
export async function parseAnimationZipLenient(
  file: File,
): Promise<ParsedAnimationSequence> {
  const info: string[] = [];
  const warnings: string[] = [];

  // Basic check: is it a zip?
  if (!file.name.toLowerCase().endsWith('.zip')) {
    return {
      frames: [],
      frameCount: 0,
      suggestedFps: 24,
      duration: 0,
      skippedCount: 0,
      validation: {
        valid: false,
        errors: ['File must be a ZIP archive'],
        warnings: [],
      },
    };
  }

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return {
      frames: [],
      frameCount: 0,
      suggestedFps: 24,
      duration: 0,
      skippedCount: 0,
      validation: {
        valid: false,
        errors: ['Failed to read ZIP file. It may be corrupted.'],
        warnings: [],
      },
    };
  }

  // Collect all PNG file paths (recursively, including subdirectories)
  const pngEntries: string[] = [];
  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    if (shouldSkipFile(relativePath)) return;
    if (relativePath.toLowerCase().endsWith('.png')) {
      pngEntries.push(relativePath);
    }
  });

  if (pngEntries.length === 0) {
    return {
      frames: [],
      frameCount: 0,
      suggestedFps: 24,
      duration: 0,
      skippedCount: 0,
      validation: {
        valid: false,
        errors: ['No PNG files found in the ZIP.'],
        warnings: [],
      },
    };
  }

  // Sort: primary by numeric index, secondary by full path lexicographic
  const sortedEntries = [...pngEntries].sort((a, b) => {
    const numA = extractSequenceIndex(a);
    const numB = extractSequenceIndex(b);
    if (numA >= 0 && numB >= 0 && numA !== numB) return numA - numB;
    if (numA >= 0 && numB < 0) return -1;
    if (numA < 0 && numB >= 0) return 1;
    return a.localeCompare(b);
  });

  // Load all frames, skipping bad ones
  const frames: ParsedFrame[] = [];
  let skippedCount = 0;
  let firstFrameSize: { width: number; height: number } | undefined;

  for (const entryPath of sortedEntries) {
    const zipFile = zip.file(entryPath);
    if (!zipFile) {
      skippedCount++;
      continue;
    }

    const blob = await zipFile.async('blob');
    const frame = await loadImageFromBlobSafe(blob, entryPath);

    if (frame) {
      frames.push(frame);
      if (!firstFrameSize) {
        firstFrameSize = { width: frame.width, height: frame.height };
      }
    } else {
      skippedCount++;
    }
  }

  if (frames.length === 0) {
    return {
      frames: [],
      frameCount: 0,
      suggestedFps: 24,
      duration: 0,
      skippedCount,
      validation: {
        valid: false,
        errors: ['All PNG frames failed to load. The files may be corrupted.'],
        warnings: skippedCount > 0 ? [`Skipped ${skippedCount} unreadable file(s)`] : [],
      },
    };
  }

  const fps = 24;
  const duration = frames.length / fps;

  // Build info string
  info.push(`${frames.length} frames parsed`);
  if (firstFrameSize) {
    info.push(`Frame size: ${firstFrameSize.width}×${firstFrameSize.height}px`);
  }
  info.push(`Duration: ${duration.toFixed(1)}s at ${fps}fps`);
  if (skippedCount > 0) {
    warnings.push(`Skipped ${skippedCount} unreadable file(s)`);
  }

  return {
    frames,
    frameCount: frames.length,
    suggestedFps: fps,
    duration,
    firstFrameSize,
    skippedCount,
    validation: {
      valid: true,
      errors: [],
      warnings,
      info: info.join(' · '),
    },
  };
}

/**
 * Release all object URLs in a ParsedAnimationSequence to prevent memory leaks
 */
export function releaseAnimationSequence(seq: ParsedAnimationSequence): void {
  seq.frames.forEach((f) => URL.revokeObjectURL(f.url));
}

// ─── Legacy strict validator (kept for backward compat) ─────────────

/** @deprecated Use parseAnimationZipLenient instead */
export async function validateAndExtractAnimation(
  file: File
): Promise<{ frames: import('../types').AnimationFrame[]; validation: AssetValidation }> {
  const result = await parseAnimationZipLenient(file);
  return {
    frames: result.frames.map((f, i) => ({
      name: f.name,
      index: i,
      url: f.url,
      img: f.img,
      width: f.width,
      height: f.height,
    })),
    validation: result.validation,
  };
}

// ─── Video validation ───────────────────────────────────────────────

export function validateVideo(file: File, video: HTMLVideoElement): AssetValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
    warnings.push('Recommended format: MP4, WebM, or MOV');
  }

  const w = video.videoWidth;
  const h = video.videoHeight;
  if (w && h) {
    const ratio = w / h;
    if (ratio < 0.5 || ratio > 0.65) {
      warnings.push(
        `Video aspect ratio ${w}×${h} (${ratio.toFixed(2)}) may not be 9:16. Recommended: 1080×1920 or 720×1280`
      );
    }
    info.push(`Size: ${w}×${h}px | Duration: ${video.duration.toFixed(1)}s`);
  }

  if (video.duration < 5) {
    warnings.push('Video is shorter than 5s. Preview duration will be limited.');
  }

  return { valid: errors.length === 0, errors, warnings, info: info.join(' | ') };
}

export function createVideoFromFile(file: File): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load video: ${file.name}`));
    };
    video.src = url;
  });
}
