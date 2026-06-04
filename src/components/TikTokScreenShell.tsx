import React from 'react';
import type { LikeButtonAsset } from '../types';
import TopStatusBar from './TopStatusBar';
import TopForYouNav from './TopForYouNav';
import RightActionRail from './RightActionRail';
import BottomMeta from './BottomMeta';
import BottomTabBar from './BottomTabBar';

interface TikTokScreenShellProps {
  containerWidth: number;
  containerHeight: number;
  isLiked: boolean;
  likeButton: LikeButtonAsset | null;
  onLikeClick: () => void;
}

/**
 * Full TikTok feed UI shell — composes all overlay layers.
 * This sits on top of the video/effect layers.
 */
const TikTokScreenShell: React.FC<TikTokScreenShellProps> = ({
  containerWidth,
  containerHeight,
  isLiked,
  likeButton,
  onLikeClick,
}) => {
  return (
    <>
      {/* Bottom gradient for text legibility */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: containerHeight * 0.22,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

      {/* Layer A: iOS Status Bar */}
      <TopStatusBar containerWidth={containerWidth} containerHeight={containerHeight} />

      {/* Layer B: For You Navigation */}
      <TopForYouNav containerWidth={containerWidth} containerHeight={containerHeight} />

      {/* Layer C: Right Action Rail */}
      <RightActionRail
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        isLiked={isLiked}
        likeButton={likeButton}
        onLikeClick={onLikeClick}
      />

      {/* Layer D: Bottom Metadata */}
      <BottomMeta containerWidth={containerWidth} containerHeight={containerHeight} />

      {/* Layer E: Bottom Tab Bar */}
      <BottomTabBar containerWidth={containerWidth} containerHeight={containerHeight} />
    </>
  );
};

export default TikTokScreenShell;
