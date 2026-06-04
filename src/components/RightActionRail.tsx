import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { TIKTOK_SCREEN_LAYOUT } from '../config/tiktokScreenLayout';
import type { LikeButtonAsset } from '../types';

interface RightActionRailProps {
  containerWidth: number;
  containerHeight: number;
  isLiked: boolean;
  likeButton: LikeButtonAsset | null;
  onLikeClick: () => void;
}

const RightActionRail: React.FC<RightActionRailProps> = ({
  containerWidth,
  containerHeight,
  isLiked,
  likeButton,
  onLikeClick,
}) => {
  const L = TIKTOK_SCREEN_LAYOUT;
  const sx = containerWidth / L.screen.width;
  const sy = containerHeight / L.screen.height;

  const right = L.rightRail.right * sx;
  const avatarY = L.rightRail.avatarY * sy;
  const itemGap = L.rightRail.itemGap * sy;
  const iconSize = L.rightRail.iconSize * sx;
  const iconRender = L.rightRail.iconRenderSize * sx;
  const labelGap = L.rightRail.labelGap * sy;
  const labelFont = L.rightRail.labelFontSize * sx;
  const avatarSize = L.rightRail.avatarSize * sx;
  const avatarBorder = L.rightRail.avatarBorderWidth * sx;
  const plusSize = L.rightRail.plusBadgeSize * sx;
  const discSize = L.rightRail.discSize * sx;
  const discBorder = L.rightRail.discBorderWidth * sx;

  // Music disc rotation
  const [discRotation, setDiscRotation] = useState(0);
  const animRef = useRef<number>(0);
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setDiscRotation((r) => (r + (360 / L.rightRail.discRotationDuration) * dt) % 360);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [L.rightRail.discRotationDuration]);

  // Item Y positions
  const likeY = avatarY + avatarSize / 2 + itemGap;
  const commentY = likeY + iconSize + itemGap;
  const bookmarkY = commentY + iconSize + itemGap;
  const shareY = bookmarkY + iconSize + itemGap;
  const discY = shareY + iconSize + itemGap;

  const iconStroke = Math.max(1.5, sx * 1.8);

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: right + iconSize,
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          position: 'absolute',
          top: avatarY - avatarSize / 2,
          right,
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: avatarBorder + 'px solid white',
          overflow: 'visible',
        }}
      >
        {/* Plus badge */}
        <div
          style={{
            position: 'absolute',
            bottom: -plusSize * 0.2,
            right: -plusSize * 0.2,
            width: plusSize,
            height: plusSize,
            borderRadius: '50%',
            background: '#FE2C55',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: plusSize * 0.65,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            border: '2px solid #000',
            boxSizing: 'border-box',
          }}
        >
          +
        </div>
      </div>

      {/* Like */}
      <div
        style={{
          position: 'absolute',
          top: likeY,
          right: right,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: labelGap,
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
        onClick={onLikeClick}
      >
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLiked && likeButton ? (
            <img src={likeButton.url} alt="like" style={{ width: iconRender * 0.9, height: iconRender * 0.9, objectFit: 'contain' }} />
          ) : (
            <Heart size={iconRender} fill={isLiked ? '#FE2C55' : 'none'} color="white" strokeWidth={iconStroke} />
          )}
        </div>
        <span style={{ fontSize: labelFont, color: 'white', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {isLiked ? '99.9K' : '8.2K'}
        </span>
      </div>

      {/* Comment */}
      <div style={{ position: 'absolute', top: commentY, right, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: labelGap }}>
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={iconRender} color="white" fill="none" strokeWidth={iconStroke} />
        </div>
        <span style={{ fontSize: labelFont, color: 'white', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>184</span>
      </div>

      {/* Bookmark */}
      <div style={{ position: 'absolute', top: bookmarkY, right, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: labelGap }}>
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bookmark size={iconRender} color="white" fill="none" strokeWidth={iconStroke} />
        </div>
        <span style={{ fontSize: labelFont, color: 'white', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>8,291</span>
      </div>

      {/* Share */}
      <div style={{ position: 'absolute', top: shareY, right, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: labelGap }}>
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Share2 size={iconRender} color="white" fill="none" strokeWidth={iconStroke} />
        </div>
        <span style={{ fontSize: labelFont, color: 'white', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>33.3K</span>
      </div>

      {/* Music Disc */}
      <div
        style={{
          position: 'absolute',
          top: discY,
          right: right,
          width: discSize,
          height: discSize,
          borderRadius: '50%',
          border: discBorder + 'px solid #282828',
          overflow: 'hidden',
          transform: 'rotate(' + discRotation + 'deg)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: discSize * 0.25, height: discSize * 0.25, borderRadius: '50%', background: '#333' }} />
        </div>
      </div>
    </div>
  );
};

export default RightActionRail;
