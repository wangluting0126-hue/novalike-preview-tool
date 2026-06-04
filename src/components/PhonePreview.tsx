import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type {
  PreviewConfig,
  LikeButtonAsset,
  LikeStickerAsset,
  ParsedAnimationSequence,
  VideoAsset,
} from '../types';
import TikTokScreenShell from './TikTokScreenShell';
import EffectOverlay from './EffectOverlay';

interface PhonePreviewProps {
  config: PreviewConfig;
  likeButton: LikeButtonAsset | null;
  sticker: LikeStickerAsset | null;
  animation: ParsedAnimationSequence | null;
  video: VideoAsset | null;
}

/**
 * Full-screen TikTok feed preview container.
 * Design base: iPhone 390×844, scaled to fit the right panel.
 * Three layers: Video → Effect → TikTok UI Shell
 */
const PhonePreview: React.FC<PhonePreviewProps> = ({
  config,
  likeButton,
  sticker,
  animation,
  video,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const animIntervalRef = useRef<ReturnType<typeof setInterval> | 0>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [effectVisible, setEffectVisible] = useState(false);
  const [stickerAnimPhase, setStickerAnimPhase] = useState<'in' | 'out' | 'none'>('none');
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Container dimensions — iPhone 9:19.5 aspect ratio
  const SCREEN_W = 280;
  const SCREEN_H = Math.round(SCREEN_W * (844 / 390)); // ~606

  // Draw placeholder
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!video) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#333';
      ctx.font = (SCREEN_W * 0.04) + 'px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload a video to preview', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#555';
      ctx.font = (SCREEN_W * 0.032) + 'px -apple-system, sans-serif';
      ctx.fillText('9:16 ratio recommended', canvas.width / 2, canvas.height / 2 + 12);
    }
  }, [video, SCREEN_W]);

  const cleanup = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = 0; }
    if (animIntervalRef.current) { clearInterval(animIntervalRef.current); animIntervalRef.current = 0; }
    setIsPlaying(false);
    setIsLiked(false);
    setEffectVisible(false);
    setStickerAnimPhase('none');
    setCurrentFrameIndex(0);
  }, []);

  const triggerLikeEffect = useCallback(() => {
    setIsLiked(true);
    if (config.version === 'sticker' && sticker) {
      setEffectVisible(true);
      setStickerAnimPhase('in');
      setTimeout(() => {
        setStickerAnimPhase('out');
        setTimeout(() => { setEffectVisible(false); setStickerAnimPhase('none'); }, 300);
      }, 2000);
    } else if (config.version === 'animation' && animation && animation.frames.length > 0) {
      setEffectVisible(true);
      setCurrentFrameIndex(0);
      const fps = config.animationFps;
      let idx = 0;
      animIntervalRef.current = setInterval(() => {
        idx++;
        setCurrentFrameIndex(idx);
        if (idx >= animation.frames.length - 1) {
          clearInterval(animIntervalRef.current);
          animIntervalRef.current = 0;
          if (config.animationEndMode === 'hide') {
            setTimeout(() => setEffectVisible(false), 300);
          }
        }
      }, 1000 / fps);
    }
  }, [config, sticker, animation]);

  const startPlayback = useCallback(() => {
    if (!videoRef.current || !video) return;
    cleanup();
    const vid = videoRef.current;
    vid.currentTime = 0;
    vid.play().then(() => {
      setIsPlaying(true);
      startTimeRef.current = performance.now();
      let liked = false;
      const renderLoop = () => {
        if (!vid || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        if (elapsed >= config.previewDuration) { cleanup(); return; }
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(vid, 0, 0, canvasRef.current.width, canvasRef.current.height);
        if (elapsed >= config.triggerTime && !liked) { liked = true; triggerLikeEffect(); }
        animFrameRef.current = requestAnimationFrame(renderLoop);
      };
      animFrameRef.current = requestAnimationFrame(renderLoop);
    }).catch(() => {});
  }, [video, config, cleanup, triggerLikeEffect]);

  const handleLikeClick = useCallback(() => {
    if (!isPlaying) return;
    if (animIntervalRef.current) { clearInterval(animIntervalRef.current); animIntervalRef.current = 0; }
    setEffectVisible(false);
    setStickerAnimPhase('none');
    setCurrentFrameIndex(0);
    setIsLiked(false);
    setTimeout(() => triggerLikeEffect(), 50);
  }, [isPlaying, triggerLikeEffect]);

  const handleReplay = () => startPlayback();
  const handleReset = () => {
    cleanup();
    if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause(); }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (video && videoRef.current) videoRef.current.src = video.url;
  }, [video]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* ─── Full-screen TikTok Feed Container ─── */}
      <div
        className="tiktok-screen"
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
        }}
      >
        {/* Layer 1: Video (Canvas) */}
        <video ref={videoRef} muted playsInline preload="auto" style={{ display: 'none' }} />
        <canvas
          ref={canvasRef}
          width={SCREEN_W}
          height={SCREEN_H}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        />

        {/* Layer 2: Effect Overlay */}
        <EffectOverlay
          containerWidth={SCREEN_W}
          config={config}
          sticker={sticker}
          animation={animation}
          visible={effectVisible}
          animPhase={stickerAnimPhase}
          currentFrameIndex={currentFrameIndex}
        />

        {/* Layer 3: TikTok UI Shell */}
        <TikTokScreenShell
          containerWidth={SCREEN_W}
          containerHeight={SCREEN_H}
          isLiked={isLiked}
          likeButton={likeButton}
          onLikeClick={handleLikeClick}
        />
      </div>

      {/* External controls (outside the screen) */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-secondary" onClick={handleReplay} disabled={!video}>
          <Play size={14} /> Play
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
};

export default PhonePreview;
