// ─── src/components/ui/Button.tsx ─────────────────────────────────────
// Botón reutilizable con variantes

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/styles/theme';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; border: string; text: string }> = {
  primary: { bg: 'cyan', border: 'transparent', text: 'bg' },
  ghost: { bg: 'cyanDim', border: 'cyanMid', text: 'cyan' },
  danger: { bg: 'redDim', border: 'redMid', text: 'red' },
};

const sizeStyles: Record<ButtonSize, { px: number; py: number; fontSize: number; gap: number }> = {
  sm: { px: 12, py: 8, fontSize: 13, gap: 6 },
  md: { px: 20, py: 14, fontSize: 15, gap: 8 },
  lg: { px: 24, py: 16, fontSize: 16, gap: 10 },
};

export const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      style,
      textStyle,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const v = variantStyles[variant];
    const s = sizeStyles[size];

    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          {
            width: fullWidth ? '100%' : 'auto',
            paddingHorizontal: s.px,
            paddingVertical: s.py,
            borderRadius: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: s.gap,
            backgroundColor: theme[v.bg as keyof typeof theme],
            borderWidth: v.border === 'transparent' ? 0 : 1,
            borderColor: theme[v.border as keyof typeof theme],
            opacity: isDisabled ? 0.5 : 1,
          },
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme[v.text as keyof typeof theme]} />
        ) : (
          <>
            {leftIcon}
            <Text
              style={[
                {
                  color: theme[v.text as keyof typeof theme],
                  fontSize: s.fontSize,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// Helper para texto de botón (compatibilidad)
export const BtnText = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: ButtonVariant }) => {
  const { theme } = useTheme();
  const textColors = { primary: theme.bg, ghost: theme.cyan, danger: theme.red };
  return <Text style={{ color: textColors[variant], fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }}>{children}</Text>;
};