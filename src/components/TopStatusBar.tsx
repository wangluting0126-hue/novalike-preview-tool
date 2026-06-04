import React from 'react';
import { TIKTOK_SCREEN_LAYOUT } from '../config/tiktokScreenLayout';

interface TopStatusBarProps {
  containerWidth: number;
  containerHeight: number;
}

const TopStatusBar: React.FC<TopStatusBarProps> = ({ containerWidth, containerHeight }) => {
  const L = TIKTOK_SCREEN_LAYOUT;
  const sx = containerWidth / L.screen.width;
  const sy = containerHeight / L.screen.height;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: L.screen.safeTop * sy,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: `${L.statusBar.top * sy}px ${L.statusBar.left * sx}px 0`,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* Time */}
      <span style={{ fontSize: L.statusBar.timeFontSize * sx, fontWeight: 600, color: 'white' }}>
        14:23
      </span>

      {/* Right side icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 * sx }}>
        {/* Signal bars */}
        <svg width={16 * sx} height={12 * sx} viewBox="0 0 16 12" fill="white">
          <rect x="0" y="9" width="3" height="3" rx="0.5" />
          <rect x="4" y="6" width="3" height="6" rx="0.5" />
          <rect x="8" y="3" width="3" height="9" rx="0.5" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" />
        </svg>
        {/* WiFi */}
        <svg width={15 * sx} height={12 * sx} viewBox="0 0 15 12" fill="white">
          <path d="M7.5 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" transform="translate(0,-2)" />
          <path d="M4.5 8.5C5.5 7.2 6.9 6.5 7.5 6.5s2 .7 3 2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" transform="translate(0,-2)" />
          <path d="M2 6c2-2.5 4-3.5 5.5-3.5S11 3.5 13 6" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" transform="translate(0,-2)" />
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 * sx }}>
          <svg width={25 * sx} height={12 * sx} viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" strokeWidth="1" />
            <rect x="2" y="2" width="15" height="8" rx="1" fill="white" />
            <path d="M23 4v4a2 2 0 000-4z" fill="white" />
          </svg>
          <span style={{ fontSize: 10 * sx, color: 'white', fontWeight: 500 }}>19%</span>
        </div>
      </div>
    </div>
  );
};

export default TopStatusBar;
