import React, { useState, useCallback, useRef } from 'react';
import {
  Settings2,
  Film,
  Zap,
  Clock,
  Move,
  Maximize2,
  Timer,
  Gauge,
} from 'lucide-react';
import type {
  VersionType,
  PreviewConfig,
  LikeButtonAsset,
  LikeStickerAsset,
  ParsedAnimationSequence,
  VideoAsset,
  ExportProgress,
} from './types';
import { DEFAULT_CONFIG } from './types';
import {
  loadImageFromFile,
  validateLikeButton,
  validateLikeSticker,
  parseAnimationZipLenient,
  releaseAnimationSequence,
  createVideoFromFile,
  validateVideo,
} from './utils/validation';
import { exportPreviewVideo } from './utils/canvasRenderer';
import UploadZone from './components/UploadZone';
import SegmentedControl from './components/SegmentedControl';
import PhonePreview from './components/PhonePreview';
import ExportPanel from './components/ExportPanel';

const App: React.FC = () => {
  const [config, setConfig] = useState<PreviewConfig>({ ...DEFAULT_CONFIG });
  const [likeButton, setLikeButton] = useState<LikeButtonAsset | null>(null);
  const [sticker, setSticker] = useState<LikeStickerAsset | null>(null);
  const [animation, setAnimation] = useState<ParsedAnimationSequence | null>(null);
  const [video, setVideo] = useState<VideoAsset | null>(null);
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    stage: 'idle',
    percent: 0,
    message: '',
  });
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const exportUrlRef = useRef<string | null>(null);

  // Version change
  const handleVersionChange = useCallback((v: VersionType) => {
    setConfig((prev) => ({ ...prev, version: v }));
  }, []);

  // Handle like button upload
  const handleLikeButtonUpload = useCallback(async (file: File) => {
    try {
      const img = await loadImageFromFile(file);
      const url = URL.createObjectURL(file);
      const validation = validateLikeButton(file, img);
      setLikeButton({ file, url, img, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height, validation });
    } catch (err) {
      console.error('Failed to load like button:', err);
    }
  }, []);

  // Handle sticker upload
  const handleStickerUpload = useCallback(async (file: File) => {
    try {
      const img = await loadImageFromFile(file);
      const url = URL.createObjectURL(file);
      const validation = validateLikeSticker(file, img);
      setSticker({ file, url, img, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height, validation });
    } catch (err) {
      console.error('Failed to load sticker:', err);
    }
  }, []);

  // Handle animation ZIP upload (lenient)
  const handleAnimationUpload = useCallback(async (file: File) => {
    try {
      const result = await parseAnimationZipLenient(file);
      setAnimation(result);
    } catch (err) {
      console.error('Failed to load animation:', err);
    }
  }, []);

  // Handle video upload
  const handleVideoUpload = useCallback(async (file: File) => {
    try {
      const vid = await createVideoFromFile(file);
      const url = URL.createObjectURL(file);
      const validation = validateVideo(file, vid);
      setVideo({ file, url, video: vid, width: vid.videoWidth, height: vid.videoHeight, duration: vid.duration, validation });
    } catch (err) {
      console.error('Failed to load video:', err);
    }
  }, []);

  // Clear handlers (with memory cleanup)
  const clearLikeButton = useCallback(() => {
    if (likeButton) URL.revokeObjectURL(likeButton.url);
    setLikeButton(null);
  }, [likeButton]);

  const clearSticker = useCallback(() => {
    if (sticker) URL.revokeObjectURL(sticker.url);
    setSticker(null);
  }, [sticker]);

  const clearAnimation = useCallback(() => {
    if (animation) releaseAnimationSequence(animation);
    setAnimation(null);
  }, [animation]);

  const clearVideo = useCallback(() => {
    if (video) URL.revokeObjectURL(video.url);
    setVideo(null);
  }, [video]);

  // Export video
  const handleExport = useCallback(async () => {
    if (!video) return;
    if (exportUrlRef.current) {
      URL.revokeObjectURL(exportUrlRef.current);
      exportUrlRef.current = null;
    }
    setExportUrl(null);
    setExportProgress({ stage: 'preparing', percent: 0, message: 'Preparing...' });

    try {
      const blob = await exportPreviewVideo(
        video.video, config, likeButton, sticker, animation, setExportProgress
      );
      const url = URL.createObjectURL(blob);
      exportUrlRef.current = url;
      setExportUrl(url);
    } catch (err) {
      console.error('Export failed:', err);
      setExportProgress({ stage: 'error', percent: 0, message: 'Export failed. Please try again.' });
    }
  }, [video, config, likeButton, sticker, animation]);

  const canExport =
    video?.validation.valid === true &&
    likeButton?.validation.valid === true &&
    (config.version === 'sticker'
      ? sticker?.validation.valid === true
      : animation?.validation.valid === true);

  const updateConfig = useCallback(<K extends keyof PreviewConfig>(key: K, value: PreviewConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border-color)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)' }}>
        <Zap size={20} style={{ color: 'var(--accent)' }} />
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Novalike Preview Tool</h1>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Vibecoding Ad Style Preview</p>
        </div>
      </header>

      {/* Main content */}
      <main style={{ display: 'flex', gap: 32, padding: 24, maxWidth: 1200, margin: '0 auto', alignItems: 'flex-start' }}>
        {/* Left Panel */}
        <div style={{ width: 380, minWidth: 340, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          {/* Version Selection */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Version</label>
            <SegmentedControl
              value={config.version}
              onChange={handleVersionChange}
              options={[
                { label: 'Sticker Version', value: 'sticker' },
                { label: 'Animation Version', value: 'animation' },
              ]}
            />
          </div>

          {/* Like Button Upload */}
          <UploadZone
            label="Like Button"
            description="PNG, 72×72px, transparent"
            accept=".png"
            validation={likeButton?.validation}
            preview={likeButton?.url}
            previewSize={{ width: 72, height: 72 }}
            onFileSelect={handleLikeButtonUpload}
            onClear={clearLikeButton}
            compact
          />

          {/* Sticker / Animation Upload */}
          {config.version === 'sticker' ? (
            <UploadZone
              label="Like Sticker"
              description="PNG, 320×320px, transparent"
              accept=".png"
              validation={sticker?.validation}
              preview={sticker?.url}
              previewSize={{ width: 80, height: 80 }}
              onFileSelect={handleStickerUpload}
              onClear={clearSticker}
            />
          ) : (
            <UploadZone
              label="Like Animation"
              description="Upload a ZIP containing PNG sequence frames"
              accept=".zip"
              validation={animation?.validation}
              preview={animation && animation.frames.length > 0 ? animation.frames[0].url : null}
              previewSize={{ width: 60, height: 120 }}
              onFileSelect={handleAnimationUpload}
              onClear={clearAnimation}
              hint="We will parse and preview the frames automatically. Nested folders are supported."
            />
          )}

          {/* Video Upload */}
          <UploadZone
            label="Background Video"
            description="MP4/WebM, 9:16 ratio recommended"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            validation={video?.validation}
            preview={null}
            onFileSelect={handleVideoUpload}
            onClear={clearVideo}
          />

          {/* Parameters */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Settings2 size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parameters</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Trigger Time */}
              <ParamSlider icon={<Clock size={12} />} label="Like Trigger Time" value={`${config.triggerTime.toFixed(1)}s`} min={0.5} max={4} step={0.1} current={config.triggerTime} onChange={(v) => updateConfig('triggerTime', v)} />

              {/* Position X */}
              <ParamSlider icon={<Move size={12} />} label="Position X" value={`${config.stickerX}%`} min={10} max={90} step={1} current={config.stickerX} onChange={(v) => updateConfig('stickerX', v)} />

              {/* Position Y */}
              <ParamSlider icon={<Move size={12} />} label="Position Y" value={`${config.stickerY}%`} min={5} max={70} step={1} current={config.stickerY} onChange={(v) => updateConfig('stickerY', v)} />

              {/* Scale */}
              <ParamSlider
                icon={<Maximize2 size={12} />}
                label={`${config.version === 'sticker' ? 'Sticker' : 'Animation'} Scale`}
                value={`${(config.version === 'sticker' ? config.stickerScale : config.animationScale).toFixed(2)}x`}
                min={0.1} max={2} step={0.05}
                current={config.version === 'sticker' ? config.stickerScale : config.animationScale}
                onChange={(v) => {
                  if (config.version === 'sticker') updateConfig('stickerScale', v);
                  else updateConfig('animationScale', v);
                }}
              />

              {/* Animation FPS (only for animation version) */}
              {config.version === 'animation' && (
                <ParamSlider icon={<Gauge size={12} />} label="Animation FPS" value={`${config.animationFps} fps`} min={1} max={60} step={1} current={config.animationFps} onChange={(v) => updateConfig('animationFps', v)} />
              )}

              {/* Preview Duration */}
              <ParamSlider icon={<Timer size={12} />} label="Preview Duration" value={`${config.previewDuration.toFixed(1)}s`} min={3} max={10} step={0.5} current={config.previewDuration} onChange={(v) => updateConfig('previewDuration', v)} />
            </div>
          </div>

          {/* Export */}
          <ExportPanel onExport={handleExport} progress={exportProgress} exportUrl={exportUrl} disabled={!canExport} />
        </div>

        {/* Right Panel - Phone Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 16, paddingTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Film size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Live Preview
          </div>

          <PhonePreview config={config} likeButton={likeButton} sticker={sticker} animation={animation} video={video} />

          <p style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 310, lineHeight: 1.5 }}>
            Upload assets and click <strong>Play</strong> to preview.
            Click the <strong>heart</strong> icon to trigger the Novalike effect.
          </p>
        </div>
      </main>
    </div>
  );
};

// ─── Reusable Param Slider ──────────────────────────────────────────
function ParamSlider({ icon, label, value, min, max, step, current, onChange }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {icon} {label}
        </label>
        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={current} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  );
}

export default App;
