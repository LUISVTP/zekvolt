// ─── src/screens/auth/SplashScreen.tsx ───────────────────────────────────
// Pantalla de splash con animaciones

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/theme';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';

interface SplashScreenProps {
  onDone: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function SplashScreen({ onDone, style }: SplashScreenProps) {
  const { theme } = useTheme();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const fadeDots = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(24)).current;
  const slideSubtitle = useRef(new Animated.Value(24)).current;
  const slideDots = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Fade up animations staggered
    const fadeUp = (fade: Animated.Value, slide: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 700, delay, useNativeDriver: true }),
      ]);

    Animated.stagger(400, [
      fadeUp(fadeTitle, slideTitle, 800),
      fadeUp(fadeSubtitle, slideSubtitle, 1200),
      fadeUp(fadeDots, slideDots, 1600),
    ]).start();

    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }, style]}>
      <Animated.View style={{ marginBottom: 28, transform: [{ scale: pulseAnim }] }}>
        <ZekvoltLogo size={100} />
      </Animated.View>

      <Animated.Text
        style={{
          fontSize: 38,
          fontWeight: '800',
          color: theme.cyan,
          letterSpacing: -1,
          opacity: fadeTitle,
          transform: [{ translateY: slideTitle }],
        }}
      >
        Zekvolt
      </Animated.Text>

      <Animated.Text
        style={{
          fontSize: 11,
          color: theme.textMuted,
          letterSpacing: 4,
          textTransform: 'uppercase',
          marginTop: 4,
          opacity: fadeSubtitle,
          transform: [{ translateY: slideSubtitle }],
        }}
      >
        Regulación Eléctrica Residencial
      </Animated.Text>

      <Animated.View
        style={{
          marginTop: 60,
          flexDirection: 'row',
          gap: 6,
          opacity: fadeDots,
          transform: [{ translateY: slideDots }],
        }}
      >
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === 0 ? theme.cyan : theme.border,
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}