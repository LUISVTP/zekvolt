// ─── src/components/layout/Screen.tsx ──────────────────────────────────
// Pantallas base con estilos consistentes

import React from 'react';
import { View, ScrollView, SafeAreaView, StyleProp, ViewStyle, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useTheme } from '@/styles/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  keyboardAvoid?: boolean;
  safeArea?: boolean;
  statusBarStyle?: 'light' | 'dark';
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
  contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
}

export const Screen = React.forwardRef<ScrollView, ScreenProps>(
  (
    {
      children,
      style,
      contentContainerStyle,
      scroll = true,
      keyboardAvoid = false,
      safeArea = true,
      statusBarStyle = 'light',
      showsVerticalScrollIndicator = false,
      keyboardShouldPersistTaps = 'handled',
      contentInsetAdjustmentBehavior = 'automatic',
      ...props
    },
    ref
  ) => {
    const { theme, dark: darkMode } = useTheme();

    const content = (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: theme.bg,
          },
          style,
        ]}
      >
        {scroll ? (
          <ScrollView
            ref={ref}
            contentContainerStyle={[
              {
                flexGrow: 1,
                paddingBottom: 20,
              },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
            {...props}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </View>
    );

    if (keyboardAvoid) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
          style={{ flex: 1, backgroundColor: theme.bg }}
        >
          {safeArea ? (
            <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView>
          ) : (
            content
          )}
        </KeyboardAvoidingView>
      );
    }

    if (safeArea) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          {content}
        </SafeAreaView>
      );
    }

    return <>{content}</>;
  }
);

Screen.displayName = 'Screen';