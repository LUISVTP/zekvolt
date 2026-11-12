// ─── src/components/ui/AppAlert.tsx ───────────────────────────────────
// Diálogo de aviso con el estilo de la app (reemplaza Alert nativo)

import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/styles/theme';

export interface AppAlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AppAlertRequest {
  title: string;
  message?: string;
  buttons: AppAlertButton[];
}

let listener: ((request: AppAlertRequest | null) => void) | null = null;

export function showAppAlert(title: string, message?: string, buttons?: AppAlertButton[]) {
  listener?.({
    title,
    message,
    buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
  });
}

export function AppAlertHost() {
  const { theme } = useTheme();
  const [request, setRequest] = useState<AppAlertRequest | null>(null);

  useEffect(() => {
    listener = setRequest;
    return () => {
      listener = null;
    };
  }, []);

  if (!request) return null;

  const press = (button: AppAlertButton) => {
    setRequest(null);
    button.onPress?.();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => setRequest(null)}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 22,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            {request.title}
          </Text>
          {request.message ? (
            <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 20 }}>{request.message}</Text>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {request.buttons.map((button, index) => {
              const isLast = index === request.buttons.length - 1;
              const color =
                button.style === 'destructive' ? theme.red : button.style === 'cancel' ? theme.textMuted : theme.cyan;
              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  onPress={() => press(button)}
                  activeOpacity={0.7}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    backgroundColor: isLast && button.style !== 'cancel' ? theme.cyanDim : 'transparent',
                  }}
                >
                  <Text style={{ color, fontSize: 15, fontWeight: '700' }}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
