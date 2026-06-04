/**
 * TikTok Full-Screen Feed Layout Configuration
 *
 * Design base: iPhone 14/15 Pro — 390 × 844 pt
 * All values in pt (points). Components scale proportionally to container size.
 *
 * Reference: Real TikTok iPhone screenshot (For You feed page)
 * Every value here can be fine-tuned to match the screenshot more precisely.
 */

export interface TikTokScreenLayout {
  screen: {
    /** Design base width (pt) */
    width: number;
    /** Design base height (pt) */
    height: number;
    /** Top safe area (status bar + notch/dynamic island) */
    safeTop: number;
    /** Bottom safe area (home indicator) */
    safeBottom: number;
  };

  statusBar: {
    /** Y offset from top */
    top: number;
    /** Left margin for time */
    left: number;
    /** Font size for time */
    timeFontSize: number;
    /** Font size for status icons */
    iconFontSize: number;
  };

  topNav: {
    /** Y position (from top of screen) */
    top: number;
    /** Left margin */
    left: number;
    /** Right margin */
    right: number;
    /** Tab font size */
    fontSize: number;
    /** Active tab font weight */
    activeFontWeight: number;
    /** Gap between tabs */
    tabGap: number;
    /** "For You" underline indicator: width as % of text */
    indicatorWidthPct: number;
    /** Indicator offset below text baseline */
    indicatorOffsetY: number;
    /** Indicator thickness */
    indicatorHeight: number;
    /** LIVE icon size */
    liveIconSize: number;
    /** Search icon size */
    searchIconSize: number;
  };

  rightRail: {
    /** Right margin from screen edge */
    right: number;
    /** Y position of avatar center (from top) */
    avatarY: number;
    /** Vertical gap between items */
    itemGap: number;
    /** Icon touch target size */
    iconSize: number;
    /** Actual icon render size (inside touch target) */
    iconRenderSize: number;
    /** Gap between icon and count label */
    labelGap: number;
    /** Count label font size */
    labelFontSize: number;
    /** Avatar diameter */
    avatarSize: number;
    /** Avatar border width */
    avatarBorderWidth: number;
    /** Plus badge diameter */
    plusBadgeSize: number;
    /** Music disc diameter */
    discSize: number;
    /** Music disc border width */
    discBorderWidth: number;
    /** Music disc rotation period (seconds) */
    discRotationDuration: number;
  };

  bottomMeta: {
    /** Left margin */
    left: number;
    /** Bottom edge position (from screen bottom) */
    bottom: number;
    /** Max width as % of screen */
    maxWidthPct: number;
    /** Username font size */
    usernameFontSize: number;
    /** Username font weight */
    usernameFontWeight: number;
    /** Caption font size */
    captionFontSize: number;
    /** "See original" / music font size */
    secondaryFontSize: number;
    /** Line height multiplier */
    lineHeight: number;
    /** Gap between username and caption */
    usernameCaptionGap: number;
    /** Gap between caption and "See original" */
    captionSeeOriginalGap: number;
    /** Gap between "See original" and music */
    seeOriginalMusicGap: number;
  };

  bottomTabBar: {
    /** Total bar height (including safe area) */
    height: number;
    /** Icon size */
    iconSize: number;
    /** Label font size */
    labelFontSize: number;
    /** Gap between icon and label */
    iconLabelGap: number;
    /** Center create button: width */
    createButtonWidth: number;
    /** Center create button: height */
    createButtonHeight: number;
    /** Create button border radius */
    createButtonRadius: number;
    /** Create button border width */
    createButtonBorderWidth: number;
    /** Notification dot diameter */
    notificationDotSize: number;
    /** Notification dot offset from icon center */
    notificationDotOffset: number;
  };

  effectLayer: {
    /** Top offset (below top nav) as % of screen height */
    topPct: number;
    /** Bottom offset (above bottom meta) as % of screen height */
    bottomPct: number;
    /** Left offset as % of screen width */
    leftPct: number;
    /** Right offset as % of screen width */
    rightPct: number;
  };
}

export const TIKTOK_SCREEN_LAYOUT: TikTokScreenLayout = {
  // ─── Screen ────────────────────────────────────────────────────
  screen: {
    width: 390,
    height: 844,
    safeTop: 59,   // iOS status bar + dynamic island
    safeBottom: 34, // home indicator
  },

  // ─── Status Bar ────────────────────────────────────────────────
  // Time at top-left, signal/wifi/battery at top-right
  statusBar: {
    top: 14,
    left: 24,
    timeFontSize: 15,
    iconFontSize: 14,
  },

  // ─── Top Navigation ───────────────────────────────────────────
  // LIVE | Explore | Following | For You | Search
  topNav: {
    top: 59,
    left: 16,
    right: 16,
    fontSize: 17,
    activeFontWeight: 700,
    tabGap: 20,
    indicatorWidthPct: 100,
    indicatorOffsetY: 4,
    indicatorHeight: 2.5,
    liveIconSize: 16,
    searchIconSize: 22,
  },

  // ─── Right Action Rail ────────────────────────────────────────
  // Avatar → Like → Comment → Bookmark → Share → Music Disc
  rightRail: {
    right: 12,
    avatarY: 380,
    itemGap: 20,
    iconSize: 44,
    iconRenderSize: 26,
    labelGap: 3,
    labelFontSize: 12,
    avatarSize: 48,
    avatarBorderWidth: 2,
    plusBadgeSize: 20,
    discSize: 44,
    discBorderWidth: 8,
    discRotationDuration: 4,
  },

  // ─── Bottom Metadata ──────────────────────────────────────────
  // Username → Caption → See original → Music info
  bottomMeta: {
    left: 16,
    bottom: 130, // above tab bar + safe area
    maxWidthPct: 65,
    usernameFontSize: 15,
    usernameFontWeight: 700,
    captionFontSize: 14,
    secondaryFontSize: 13,
    lineHeight: 1.3,
    usernameCaptionGap: 6,
    captionSeeOriginalGap: 4,
    seeOriginalMusicGap: 8,
  },

  // ─── Bottom Tab Bar ────────────────────────────────────────────
  // Home | Friends | [+] Create | Inbox | Profile
  bottomTabBar: {
    height: 83,
    iconSize: 24,
    labelFontSize: 10,
    iconLabelGap: 2,
    createButtonWidth: 48,
    createButtonHeight: 30,
    createButtonRadius: 8,
    createButtonBorderWidth: 2,
    notificationDotSize: 8,
    notificationDotOffset: 4,
  },

  // ─── Effect Layer (Novalike sticker/animation) ────────────────
  effectLayer: {
    topPct: 8,
    bottomPct: 18,
    leftPct: 0,
    rightPct: 0,
  },
};

/**
 * Scale a layout value from design base to actual container size.
 */
export function scaleLayout(
  value: number,
  designBase: number,
  actualSize: number,
): number {
  return (value / designBase) * actualSize;
}
