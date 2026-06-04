import React from 'react';
import { Home, Users, Plus, MessageCircle, User } from 'lucide-react';
import { TIKTOK_SCREEN_LAYOUT } from '../config/tiktokScreenLayout';

interface BottomTabBarProps {
  containerWidth: number;
  containerHeight: number;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ containerWidth, containerHeight }) => {
  const L = TIKTOK_SCREEN_LAYOUT;
  const sx = containerWidth / L.screen.width;
  const sy = containerHeight / L.screen.height;

  const barHeight = L.bottomTabBar.height * sy;
  const iconSize = L.bottomTabBar.iconSize * sx;
  const labelFont = L.bottomTabBar.labelFontSize * sx;
  const iconLabelGap = L.bottomTabBar.iconLabelGap * sy;

  const createW = L.bottomTabBar.createButtonWidth * sx;
  const createH = L.bottomTabBar.createButtonHeight * sy;
  const createR = L.bottomTabBar.createButtonRadius * sx;
  const createBW = L.bottomTabBar.createButtonBorderWidth * sx;

  const dotSize = L.bottomTabBar.notificationDotSize * sx;

  const tabWidth = containerWidth / 5;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: barHeight,
        background: '#000',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: 8 * sy,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* Home */}
      <div style={{ width: tabWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: iconLabelGap }}>
        <Home size={iconSize} color="white" fill="white" strokeWidth={0} />
        <span style={{ fontSize: labelFont, color: 'white', fontWeight: 500 }}>Home</span>
      </div>

      {/* Friends */}
      <div style={{ width: tabWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: iconLabelGap }}>
        <Users size={iconSize} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <span style={{ fontSize: labelFont, color: 'rgba(255,255,255,0.5)' }}>Friends</span>
      </div>

      {/* Create Button */}
      <div style={{ width: tabWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: iconLabelGap, paddingTop: 2 * sy }}>
        <div
          style={{
            width: createW,
            height: createH,
            borderRadius: createR,
            background: 'linear-gradient(90deg, #25F4EE, #FE2C55)',
            padding: createBW,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: createR - createBW,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={iconSize * 0.9} color="#000" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Inbox (with red dot) */}
      <div style={{ width: tabWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: iconLabelGap, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <MessageCircle size={iconSize} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          {/* Red notification dot */}
          <div
            style={{
              position: 'absolute',
              top: -dotSize * 0.3,
              right: -dotSize * 0.3,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: '#FE2C55',
            }}
          />
        </div>
        <span style={{ fontSize: labelFont, color: 'rgba(255,255,255,0.5)' }}>Inbox</span>
      </div>

      {/* Profile */}
      <div style={{ width: tabWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: iconLabelGap }}>
        <User size={iconSize} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <span style={{ fontSize: labelFont, color: 'rgba(255,255,255,0.5)' }}>Profile</span>
      </div>
    </div>
  );
};

export default BottomTabBar;
