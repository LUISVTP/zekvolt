// ─── src/components/logo/ZekvoltLogo.tsx ───────────────────────────────
// Logo de Zekvolt con fallback SVG

import React, { useState } from 'react';
import { View, Image, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/styles/theme';

export const LOGO_IMAGE_URL = 'https://pbs.twimg.com/media/HFuakavWIAACpKz?format=jpg&name=small';

interface ZekvoltLogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const ZekvoltLogo = ({ size = 60, style }: ZekvoltLogoProps) => {
  const { theme } = useTheme();
  const [imgError, setImgError] = useState(false);
  const r = size * 0.22;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: theme.bg,
          borderRadius: r,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          shadowColor: theme.cyan,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: size * 0.4,
          elevation: 8,
        },
        style,
      ]}
    >
      {!imgError ? (
        <Image
          source={{ uri: LOGO_IMAGE_URL }}
          style={{ width: size, height: size, borderRadius: r }}
          onError={() => setImgError(true)}
        />
      ) : (
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 60 60">
          <Path d="M8 10 L40 10 L40 18 L16 18 L40 42 L40 50 L8 50 L8 42 L32 42 L8 18 Z" fill={theme.cyan} opacity={0.9} />
          <Path d="M28 8 L18 30 L26 30 L22 52 L36 26 L28 26 Z" fill={theme.gold} />
        </Svg>
      )}
    </View>
  );
};

export default ZekvoltLogo;