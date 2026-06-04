import type { PreviewConfig, LikeButtonAsset, LikeStickerAsset, ParsedAnimationSequence, ExportProgress } from '../types';

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Export preview video using Canvas + MediaRecorder
 */
export async function exportPreviewVideo(
  video: HTMLVideoElement,
  config: PreviewConfig,
  _likeButton: LikeButtonAsset | null,
  sticker: LikeStickerAsset | null,
  animation: ParsedAnimationSequence | null,
  onProgress: (progress: ExportProgress) => void,
): Promise<Blob> {
  // keep parameter for future UI rendering; avoid TS noUnusedParameters
  void _likeButton;
  const videoWidth = video.videoWidth || 720;
  const videoHeight = video.videoHeight || 1280;
  const canvasWidth = 720;
  const canvasHeight = Math.round(canvasWidth * (videoHeight / videoWidth));

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm;codecs=vp8';

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      onProgress({ stage: 'done', percent: 100, message: 'Export complete!' });
      resolve(blob);
    };
    recorder.onerror = () => {
      onProgress({ stage: 'error', percent: 0, message: 'Export failed' });
      reject(new Error('MediaRecorder error'));
    };

    recorder.start(100);

    const exportVideo = document.createElement('video');
    exportVideo.muted = true;
    exportVideo.playsInline = true;
    exportVideo.src = video.src;
    exportVideo.preload = 'auto';

    exportVideo.onloadeddata = async () => {
      const fps = 30;
      const totalFrames = Math.floor(config.previewDuration * fps);

      onProgress({ stage: 'rendering', percent: 0, message: 'Rendering frames...' });

      for (let frame = 0; frame < totalFrames; frame++) {
        const time = frame * (1 / fps);
        exportVideo.currentTime = time;
        await new Promise<void>((r) => { exportVideo.onseeked = () => r(); });

        const isLiked = time >= config.triggerTime;

        // Clear and draw video
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(exportVideo, 0, 0, canvasWidth, canvasHeight);

        // Draw effect overlay
        if (isLiked && time >= config.triggerTime) {
          const elapsed = time - config.triggerTime;

          if (config.version === 'sticker' && sticker) {
            const stickerDisplayDuration = 2.5;
            if (elapsed < stickerDisplayDuration) {
              const progress = elapsed / 0.4;
              const scale = progress < 1 ? easeOutBack(progress) : 1;
              const opacity = elapsed < 0.1 ? elapsed / 0.1 : 1;
              const stickerW = 320 * config.stickerScale;
              const stickerH = 320 * config.stickerScale;
              const cx = (config.stickerX / 100) * canvasWidth;
              const cy = (config.stickerY / 100) * canvasHeight;
              ctx.save();
              ctx.globalAlpha = opacity;
              ctx.translate(cx, cy);
              ctx.scale(scale, scale);
              ctx.drawImage(sticker.img, -stickerW / 2, -stickerH / 2, stickerW, stickerH);
              ctx.restore();
            }
          } else if (config.version === 'animation' && animation && animation.frames.length > 0) {
            const animFps = config.animationFps;
            const frameIndex = Math.floor(elapsed * animFps);
            if (frameIndex < animation.frames.length) {
              const f = animation.frames[frameIndex];
              const fw = (animation.firstFrameSize?.width || 720) * config.animationScale;
              const fh = (animation.firstFrameSize?.height || 1440) * config.animationScale;
              const cx = (config.stickerX / 100) * canvasWidth;
              const cy = (config.stickerY / 100) * canvasHeight;
              ctx.drawImage(f.img, cx - fw / 2, cy - fh / 2, fw, fh);
            }
          }
        }

        const percent = Math.round(((frame + 1) / totalFrames) * 100);
        onProgress({ stage: 'rendering', percent, message: `Rendering frame ${frame + 1}/${totalFrames}...` });
        await new Promise((r) => setTimeout(r, 1000 / fps));
      }

      await new Promise((r) => setTimeout(r, 200));
      recorder.stop();
    };

    exportVideo.onerror = () => {
      recorder.stop();
      reject(new Error('Failed to load video for export'));
    };

    exportVideo.load();
  });
}
