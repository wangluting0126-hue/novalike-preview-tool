import React from 'react';
import { TIKTOK_SCREEN_LAYOUT } from '../config/tiktokScreenLayout';

interface BottomMetaProps {
  containerWidth: number;
  containerHeight: number;
}

const BottomMeta: React.FC<BottomMetaProps> = ({ containerWidth, containerHeight }) => {
  const L = TIKTOK_SCREEN_LAYOUT;
  const sx = containerWidth / L.screen.width;
  const sy = containerHeight / L.screen.height;

  const left = L.bottomMeta.left * sx;
  const bottom = L.bottomMeta.bottom * sy;
  const maxW = L.bottomMeta.maxWidthPct / 100 * containerWidth;
  const usernameFont = L.bottomMeta.usernameFontSize * sx;
  const captionFont = L.bottomMeta.captionFontSize * sx;
  const secondaryFont = L.bottomMeta.secondaryFontSize * sx;
  const lh = L.bottomMeta.lineHeight;
  const uCGap = L.bottomMeta.usernameCaptionGap * sy;
  const cSOGap = L.bottomMeta.captionSeeOriginalGap * sy;
  const somGap = L.bottomMeta.seeOriginalMusicGap * sy;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        bottom,
        maxWidth: maxW,
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      {/* Username */}
      <div style={{ fontSize: usernameFont, fontWeight: L.bottomMeta.usernameFontWeight, color: 'white', lineHeight: lh, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        lucymusic_ly
      </div>

      {/* Caption */}
      <div style={{ marginTop: uCGap, fontSize: captionFont, color: 'rgba(255,255,255,0.9)', lineHeight: lh, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        Today, June 1 Value every second that life gives you 📌 #fyp #foryou #dedi... <span style={{ fontWeight: 600 }}>more</span>
      </div>

      {/* See original */}
      <div style={{ marginTop: cSOGap, fontSize: secondaryFont, color: 'rgba(255,255,255,0.6)', lineHeight: lh }}>
        See original
      </div>

      {/* Music info */}
      <div style={{ marginTop: somGap, display: 'flex', alignItems: 'center', gap: 4 * sx }}>
        <span style={{ fontSize: secondaryFont * 0.9, color: 'white' }}>♫</span>
        <div style={{ fontSize: secondaryFont, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
          Contains: El Beso - Namo...
        </div>
      </div>
    </div>
  );
};

export default BottomMeta;
