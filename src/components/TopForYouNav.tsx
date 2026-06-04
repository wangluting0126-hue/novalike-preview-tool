import React from 'react';
import { Search } from 'lucide-react';
import { TIKTOK_SCREEN_LAYOUT } from '../config/tiktokScreenLayout';

interface TopForYouNavProps {
  containerWidth: number;
  containerHeight: number;
}

const TopForYouNav: React.FC<TopForYouNavProps> = ({ containerWidth, containerHeight }) => {
  const L = TIKTOK_SCREEN_LAYOUT;
  const sx = containerWidth / L.screen.width;
  const sy = containerHeight / L.screen.height;
  const top = L.topNav.top * sy;
  const fontSize = L.topNav.fontSize * sx;
  const tabGap = L.topNav.tabGap * sx;
  const right = L.topNav.right * sx;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tabGap,
        padding: `0 ${right}px`,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* LIVE icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 * sx, opacity: 0.9 }}>
        <svg width={L.topNav.liveIconSize * sx} height={L.topNav.liveIconSize * sx} viewBox="0 0 24 24" fill="white">
          <path d="M4 4h16v16H4z" fill="none" stroke="white" strokeWidth="1.5" rx="2" />
          <path d="M9 9l6 3-6 3V9z" fill="white" />
        </svg>
        <span style={{ fontSize: fontSize * 0.7, fontWeight: 600, color: 'white', letterSpacing: '0.02em' }}>LIVE</span>
      </div>

      {/* Explore */}
      <span style={{ fontSize, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>Explore</span>

      {/* Following */}
      <span style={{ fontSize, fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>Following</span>

      {/* For You (active) */}
      <div style={{ position: 'relative' }}>
        <span style={{ fontSize, fontWeight: L.topNav.activeFontWeight, color: 'white' }}>For You</span>
        {/* Underline indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: -(L.topNav.indicatorOffsetY * sy),
            left: 0,
            width: '100%',
            height: L.topNav.indicatorHeight * sy,
            background: 'white',
            borderRadius: 1,
          }}
        />
      </div>

      {/* Search icon */}
      <div style={{ position: 'absolute', right: right, top: '50%', transform: 'translateY(-50%)' }}>
        <Search size={L.topNav.searchIconSize * sx} color="white" strokeWidth={1.8} />
      </div>
    </div>
  );
};

export default TopForYouNav;
