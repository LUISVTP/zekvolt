// ─── src/components/home/ProfilePills.tsx ───────────────────────────────
// Píldoras de información de perfil en Home

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/theme';
import Icon from '@/components/icons/Icon';

interface ProfilePillProps {
  label: string;
  icon: string;
  color: string;
}

interface ProfilePillsProps {
  city: string;
  estrato: number;
  company: string;
  style?: StyleProp<ViewStyle>;
}

const Pill = ({ label, icon, color }: ProfilePillProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Icon name={icon as any} size={14} color={color} />
      <Text style={{ fontSize: 9, color: theme.textMuted, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
};

export const ProfilePills = ({ city, estrato, company, style }: ProfilePillsProps) => {
  const { theme } = useTheme();

  return (
    <View style={[{ flexDirection: 'row', gap: 10, marginBottom: 20 }, style]}>
      <Pill label={city} icon="mapPin" color={theme.textMuted} />
      <Pill label={`Estrato ${estrato}`} icon="home" color={theme.gold} />
      <Pill label={company} icon="zap" color={theme.cyan} />
    </View>
  );
};

export default ProfilePills;