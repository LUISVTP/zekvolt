// ─── src/components/ui/Input.tsx ──────────────────────────────────────
// Input reutilizable

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import Icon, { IconName } from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';

export type InputType = 'text' | 'email' | 'password' | 'numeric' | 'decimal';

interface InputProps extends Omit<TextInputProps, 'onChange' | 'onChangeText' | 'value' | 'placeholder' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'autoCorrect' | 'returnKeyType' | 'onSubmitEditing' | 'disabled'> {
  label?: string;
  icon?: IconName;
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'default' | 'next' | 'search' | 'done' | 'go';
  onSubmitEditing?: () => void;
  rightElementStyle?: StyleProp<ViewStyle>;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      icon,
      type = 'text',
      value,
      onChange,
      placeholder,
      error,
      disabled = false,
      rightElement,
      style,
      inputStyle,
      labelStyle,
      autoCapitalize = 'none',
      autoCorrect = false,
      returnKeyType = 'default',
      onSubmitEditing,
      rightElementStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const hasError = !!error;

    const secureTextEntry = type === 'password';

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
            borderColor: hasError ? theme.redMid : theme.border,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            gap: 10,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {icon && <Icon name={icon} size={17} color={hasError ? theme.red : theme.textMuted} />}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={theme.textSub}
            secureTextEntry={secureTextEntry}
            keyboardType={type === 'email' ? 'email-address' : type === 'numeric' || type === 'decimal' ? 'numeric' : 'default'}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            editable={!disabled}
            style={[
              {
                flex: 1,
                color: theme.text,
                fontSize: 15,
                paddingVertical: 14,
              },
              inputStyle,
            ]}
            {...props}
          />
          {rightElement && (
            <TouchableOpacity style={rightElementStyle} activeOpacity={0.7}>
              {rightElement}
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text style={{ color: theme.red, fontSize: 12, marginTop: 6, marginLeft: 2 }}>{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';