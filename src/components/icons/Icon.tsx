// ─── src/components/icons/Icon.tsx ─────────────────────────────────────
// Sistema de iconos SVG

import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/theme';

export type IconName =
  | 'bolt'
  | 'home'
  | 'eye'
  | 'eyeOff'
  | 'user'
  | 'mail'
  | 'lock'
  | 'mapPin'
  | 'zap'
  | 'tv'
  | 'cpu'
  | 'plus'
  | 'trash'
  | 'camera'
  | 'chevronRight'
  | 'chevronDown'
  | 'settings'
  | 'activity'
  | 'grid'
  | 'arrowLeft'
  | 'info'
  | 'scan'
  | 'thermometer'
  | 'wind'
  | 'droplet'
  | 'sun'
  | 'moon'
  | 'power'
  | 'tool'
  | 'check'
  | 'close'
  | 'refreshCw'
  | 'alertTriangle'
  | 'image'
  | 'upload'
  | 'clock'
  | 'edit'
  | 'logOut'
  | 'x';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const icons: Record<IconName, React.ReactElement> = {
  bolt: <Path d="M13 10V3L4 14h7v7l9-11h-7z" />,
  home: <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  eye: (
    <G>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </G>
  ),
  eyeOff: (
    <G>
      <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </G>
  ),
  user: (
    <G>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </G>
  ),
  mail: (
    <G>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Polyline points="22,6 12,13 2,6" />
    </G>
  ),
  lock: (
    <G>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0110 0v4" />
    </G>
  ),
  mapPin: (
    <G>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <Circle cx="12" cy="10" r="3" />
    </G>
  ),
  zap: <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  tv: (
    <G>
      <Rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <Polyline points="17 2 12 7 7 2" />
    </G>
  ),
  cpu: (
    <G>
      <Rect x="4" y="4" width="16" height="16" rx="2" />
      <Rect x="9" y="9" width="6" height="6" />
      <Line x1="9" y1="1" x2="9" y2="4" />
      <Line x1="15" y1="1" x2="15" y2="4" />
      <Line x1="9" y1="20" x2="9" y2="23" />
      <Line x1="15" y1="20" x2="15" y2="23" />
      <Line x1="20" y1="9" x2="23" y2="9" />
      <Line x1="20" y1="14" x2="23" y2="14" />
      <Line x1="1" y1="9" x2="4" y2="9" />
      <Line x1="1" y1="14" x2="4" y2="14" />
    </G>
  ),
  plus: (
    <G>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </G>
  ),
  trash: (
    <G>
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </G>
  ),
  camera: (
    <G>
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <Circle cx="12" cy="13" r="4" />
    </G>
  ),
  chevronRight: <Polyline points="9 18 15 12 9 6" />,
  chevronDown: <Polyline points="6 9 12 15 18 9" />,
  settings: (
    <G>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </G>
  ),
  activity: <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  grid: (
    <G>
      <Rect x="3" y="3" width="7" height="7" />
      <Rect x="14" y="3" width="7" height="7" />
      <Rect x="14" y="14" width="7" height="7" />
      <Rect x="3" y="14" width="7" height="7" />
    </G>
  ),
  arrowLeft: (
    <G>
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="12 19 5 12 12 5" />
    </G>
  ),
  info: (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="16" x2="12" y2="12" />
      <Line x1="12" y1="8" x2="12.01" y2="8" />
    </G>
  ),
  scan: (
    <G>
      <Path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M21 9V5a2 2 0 00-2-2h-4M21 15v4a2 2 0 01-2 2h-4" />
      <Line x1="3" y1="12" x2="21" y2="12" />
    </G>
  ),
  thermometer: <Path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />,
  wind: (
    <G>
      <Path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
    </G>
  ),
  droplet: <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
  sun: (
    <G>
      <Circle cx="12" cy="12" r="5" />
      <Line x1="12" y1="1" x2="12" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="23" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1" y1="12" x2="3" y2="12" />
      <Line x1="21" y1="12" x2="23" y2="12" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </G>
  ),
  moon: (
    <G>
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </G>
  ),
  power: (
    <G>
      <Path d="M18.36 6.64a9 9 0 11-12.73 0" />
      <Line x1="12" y1="2" x2="12" y2="12" />
    </G>
  ),
  tool: (
    <G>
      <Path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </G>
  ),
  check: <Polyline points="20 6 9 17 4 12" />,
  close: (
    <G>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </G>
  ),
  refreshCw: (
    <G>
      <Polyline points="23 4 23 10 17 10" />
      <Polyline points="1 20 1 14 7 14" />
      <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </G>
  ),
  alertTriangle: (
    <G>
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </G>
  ),
  image: (
    <G>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Polyline points="21 15 16 10 5 21" />
    </G>
  ),
  upload: (
    <G>
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <Polyline points="17 8 12 3 7 8" />
      <Line x1="12" y1="3" x2="12" y2="15" />
    </G>
  ),
  clock: (
    <G>
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </G>
  ),
  edit: (
    <G>
      <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </G>
  ),
  logOut: (
    <G>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </G>
  ),
  x: (
    <G>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </G>
  ),
};

export const Icon = ({ name, size = 20, color, style }: IconProps) => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.cyan;

  const strokeProps = {
    stroke: resolvedColor,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style} {...strokeProps}>
      {icons[name]}
    </Svg>
  );
};

export default Icon;