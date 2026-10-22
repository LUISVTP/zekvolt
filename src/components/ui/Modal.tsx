// ─── src/components/ui/Modal.tsx ──────────────────────────────────────
// Modal reutilizable con animación slide

import React from 'react';
import { Modal as RNModal, View, ViewStyle, Text, TouchableOpacity, StyleProp, DimensionValue } from 'react-native';
import { useTheme } from '@/styles/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
  maxHeight?: DimensionValue;
  showDragHandle?: boolean;
}

export const Modal = React.forwardRef<RNModal, ModalProps>(
  ({ visible, onClose, children, title, style, maxHeight = '70%', showDragHandle = true, ...props }, ref) => {
    const { theme } = useTheme();

    return (
      <RNModal
        ref={ref}
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        {...props}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={[
              {
                backgroundColor: theme.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight,
                paddingBottom: 30,
                paddingHorizontal: 20,
              },
              style,
            ]}
          >
            {showDragHandle && (
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
              </View>
            )}
            {title && (
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
                {title}
              </Text>
            )}
            {children}
          </View>
        </TouchableOpacity>
      </RNModal>
    );
  }
);

Modal.displayName = 'Modal';