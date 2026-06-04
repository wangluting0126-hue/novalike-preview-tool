import React from 'react';
import type { PreviewConfig, LikeStickerAsset, ParsedAnimationSequence } from '../types';

interface EffectOverlayProps {
  containerWidth: number;
  config: PreviewConfig;
  sticker: LikeStickerAsset | null;
  animation: ParsedAnimationSequence | null;
  visible: boolean;
  animPhase: 'in' | 'out' | 'none';
  currentFrameIndex: number;
}

const EffectOverlay: React.FC<EffectOverlayProps> = ({
  containerWidth,
  config,
  sticker,
  animation,
  visible,
  animPhase,
  currentFrameIndex,
}) => {
  if (!visible) return null;

  const effectScale = config.version === 'sticker' ? config.stickerScale : config.animationScale;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Sticker */}
      {config.version === 'sticker' && sticker && (
        <div
          className={'sticker-overlay ' + (animPhase === 'in' ? 'animate-in' : animPhase === 'out' ? 'animate-out' : '')}
          style={{
            left: config.stickerX + '%',
            top: config.stickerY + '%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            src={sticker.url}
            alt="sticker"
            style={{
              width: 320 * effectScale * (containerWidth / 390),
              height: 320 * effectScale * (containerWidth / 390),
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Animation */}
      {config.version === 'animation' && animation && animation.frames.length > 0 && (
        <div
          className="sticker-overlay"
          style={{
            left: config.stickerX + '%',
            top: config.stickerY + '%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            src={animation.frames[Math.min(currentFrameIndex, animation.frames.length - 1)]?.url}
            alt="animation"
            style={{
              width: (animation.firstFrameSize?.width || 720) * effectScale * (containerWidth / 720),
              height: (animation.firstFrameSize?.height || 1440) * effectScale * (containerWidth / 720),
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EffectOverlay;
