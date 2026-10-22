// ─── src/components/ui/Card.tsx ───────────────────────────────────────
// Card contenedor reutilizable

import React, { ReactNode } from 'react';
import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/styles/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  onPress?: () => void;
}

export const Card = React.forwardRef<View, CardProps>(
  ({ children, style, variant = 'default', padding = 16, onPress, ...props }, ref) => {
    const { theme } = useTheme();

    const baseStyle: ViewStyle = {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: { borderWidth: 1, borderColor: theme.border },
      elevated: {
        ...baseStyle,
        borderWidth: 0,
        shadowColor: theme.cyan,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      outlined: { borderWidth: 2, borderColor: theme.cyanMid },
    };

    const Content = onPress ? TouchableOpacity : View;

    return (
      <Content
        ref={ref}
        onPress={onPress}
        activeOpacity={0.8}
        style={[{ ...baseStyle, ...variantStyles[variant] }, style]}
        {...props}
      >
        {children}
      </Content>
    );
  }
);

Card.displayName = 'Card';