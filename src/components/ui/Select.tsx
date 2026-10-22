// ─── src/components/ui/Select.tsx ─────────────────────────────────────
// Select modal picker reutilizable

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import Icon, { IconName } from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  icon?: IconName;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Select = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, SelectProps>(
  (
    {
      label,
      icon,
      value,
      onChange,
      options,
      placeholder = 'Selecciona...',
      error,
      disabled = false,
      style,
      labelStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const hasError = !!error;
    const selected = options.find(o => o.value === value);

    if (disabled) {
      return (
        <View style={[style, { marginBottom: 16 }]}>
          {label && (
            <Text
              style={[
                {
                  color: theme.textMuted,
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                  marginBottom: 8,
                  fontFamily: 'monospace',
                },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}
          <View
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingVertical: 14,
              gap: 10,
              opacity: 0.6,
            }}
          >
            {icon && <Icon name={icon} size={17} color={theme.textMuted} />}
            <Text style={{ flex: 1, color: theme.textMuted, fontSize: 15 }}>
              {selected?.label ?? placeholder}
            </Text>
            <Icon name="chevronDown" size={16} color={theme.textMuted} />
          </View>
        </View>
      );
    }

    return (
      <View style={[style, { marginBottom: 16 }]}>
        {label && (
          <Text
            style={[
              {
                color: theme.textMuted,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase' as const,
                marginBottom: 8,
                fontFamily: 'monospace',
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}
        <TouchableOpacity
          ref={ref}
          onPress={() => setOpen(true)}
          activeOpacity={0.7}
          disabled={disabled}
          style={{
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: hasError ? theme.redMid : theme.border,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 14,
            gap: 10,
            ...props,
          }}
        >
          {icon && <Icon name={icon} size={17} color={hasError ? theme.red : theme.textMuted} />}
          <Text style={{ flex: 1, color: value ? theme.text : theme.textMuted, fontSize: 15 }}>
            {selected?.label ?? placeholder}
          </Text>
          <Icon name="chevronDown" size={16} color={theme.textMuted} />
        </TouchableOpacity>

        <Modal visible={open} transparent animationType="slide">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          >
            <View
              style={{
                backgroundColor: theme.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: '60%',
                paddingBottom: 30,
              }}
            >
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
              </View>
              {label && (
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: '700',
                    paddingHorizontal: 20,
                    marginBottom: 10,
                  }}
                >
                  {label}
                </Text>
              )}
              <FlatList
                data={options.filter(o => o.value !== '')}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { onChange(item.value); setOpen(false); }}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      backgroundColor: item.value === value ? theme.cyanDim : 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: item.value === value ? theme.cyan : theme.text, fontSize: 15 }}>
                      {item.label}
                    </Text>
                    {item.value === value && <Icon name="bolt" size={16} color={theme.cyan} />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        {error && (
          <Text style={{ color: theme.red, fontSize: 12, marginTop: 6, marginLeft: 2 }}>{error}</Text>
        )}
      </View>
    );
  }
);

Select.displayName = 'Select';