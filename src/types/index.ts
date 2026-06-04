export type VersionType = 'sticker' | 'animation';
export type AnimationEndMode = 'hold' | 'hide';

export interface AssetValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info?: string;
}

export interface LikeButtonAsset {
  file: File;
  url: string;
  img: HTMLImageElement;
  width: number;
  height: number;
  validation: AssetValidation;
}

export interface LikeStickerAsset {
  file: File;
  url: string;
  img: HTMLImageElement;
  width: number;
  height: number;
  validation: AssetValidation;
}

/** Single frame in a parsed PNG sequence */
export interface ParsedFrame {
  name: string;
  url: string;
  img: HTMLImageElement;
  width: number;
  height: number;
}

/** Lenient parsed animation sequence result */
export interface ParsedAnimationSequence {
  frames: ParsedFrame[];
  frameCount: number;
  suggestedFps: number;
  duration: number;
  firstFrameSize?: { width: number; height: number };
  skippedCount: number;
  /** Validation is always valid for lenient mode, info contains stats */
  validation: AssetValidation;
}

/** @deprecated Use ParsedAnimationSequence instead */
export interface AnimationFrame {
  name: string;
  index: number;
  url: string;
  img: HTMLImageElement;
  width: number;
  height: number;
}

/** @deprecated Use ParsedAnimationSequence instead */
export interface LikeAnimationAsset {
  file: File;
  frames: AnimationFrame[];
  frameCount: number;
  duration: number;
  validation: AssetValidation;
}

export interface VideoAsset {
  file: File;
  url: string;
  video: HTMLVideoElement;
  width: number;
  height: number;
  duration: number;
  validation: AssetValidation;
}

export interface PreviewConfig {
  version: VersionType;
  triggerTime: number;
  stickerX: number;
  stickerY: number;
  stickerScale: number;
  animationScale: number;
  previewDuration: number;
  animationFps: number;
  animationEndMode: AnimationEndMode;
}

export const DEFAULT_CONFIG: PreviewConfig = {
  version: 'sticker',
  triggerTime: 1.0,
  stickerX: 50,
  stickerY: 30,
  stickerScale: 0.6,
  animationScale: 1.0,
  previewDuration: 5.0,
  animationFps: 24,
  animationEndMode: 'hold',
};

export interface ExportProgress {
  stage: 'idle' | 'preparing' | 'rendering' | 'encoding' | 'done' | 'error';
  percent: number;
  message: string;
}

// ─── TikTok UI Layout Config ───────────────────────────────────────
// All values are in percentage (0-100) relative to the phone frame,
// or in "vw" units where 1vw = 1% of the phone frame width.
// This makes the layout fully resolution-independent.

export interface TikTokUILayout {
  /** Phone frame border radius in px (at base width) */
  frameRadius: number;
  /** Phone frame border width in px */
  frameBorder: number;

  /** Right-side action rail */
  rightRail: {
    /** X position from right edge (% of frame width) */
    right: number;
    /** Start Y position (% of frame height from top) */
    startY: number;
    /** Vertical gap between items (% of frame height) */
    itemGap: number;
    /** Icon touch target size (% of frame width) */
    iconSize: number;
    /** Gap between icon and label text (% of frame width) */
    labelGap: number;
    /** Label font size (% of frame width) */
    labelFontSize: number;
  };

  /** Avatar specifics */
  avatar: {
    /** Size (% of frame width) */
    size: number;
    /** Border width (% of frame width) */
    borderWidth: number;
    /** Plus badge size (% of frame width) */
    plusSize: number;
    /** Plus badge offset from bottom-right (% of avatar size) */
    plusOffset: number;
  };

  /** Bottom metadata area */
  bottomMeta: {
    /** Left margin (% of frame width) */
    left: number;
    /** Bottom position (% of frame height from bottom) */
    bottom: number;
    /** Max width for text (% of frame width) */
    maxWidth: number;
    /** Username font size (% of frame width) */
    usernameFontSize: number;
    /** Username font weight */
    usernameFontWeight: number;
    /** Caption font size (% of frame width) */
    captionFontSize: number;
    /** Line gap between caption lines (% of frame width) */
    lineGap: number;
    /** Gap between username and caption (% of frame width) */
    usernameCaptionGap: number;
    /** Gap between caption and music (% of frame width) */
    captionMusicGap: number;
    /** Music font size (% of frame width) */
    musicFontSize: number;
  };

  /** Music disc (rotating album art) */
  musicDisc: {
    /** Diameter (% of frame width) */
    size: number;
    /** Right position (% of frame width from right) */
    right: number;
    /** Bottom position (% of frame height from bottom, aligned with music text) */
    bottom: number;
    /** Border width (% of frame width) */
    borderWidth: number;
    /** Rotation duration in seconds */
    rotationDuration: number;
  };

  /** Bottom gradient overlay */
  bottomGradient: {
    /** Height (% of frame height) */
    height: number;
  };

  /** Effect overlay layer (sticker / animation) */
  effectLayer: {
    /** Default: covers full video area */
    fullCover: boolean;
  };
}
