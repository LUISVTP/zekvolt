// ─── src/components/camera/CameraView.tsx ────────────────────────────────
// Vista de cámara en vivo con overlay

import React from 'react';
import { View, Text, StyleProp, ViewStyle, TouchableOpacity, Image } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/styles/theme';
import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui';

interface CameraViewProps {
  ref?: React.RefObject<ExpoCameraView | null>;
  onTakePicture: () => Promise<void>;
  onGalleryPress: () => void;
  onAnalyzePress: () => void;
  onClose: () => void;
  capturedImage: string | null;
  analyzing: boolean;
  cameraPermission: any;
  style?: StyleProp<ViewStyle>;
  showFullscreen: boolean;
  isRescan?: boolean;
}

export const CameraView = ({
  ref,
  onTakePicture,
  onGalleryPress,
  onAnalyzePress,
  onClose,
  capturedImage,
  analyzing,
  cameraPermission,
  style,
  showFullscreen,
  isRescan,
}: CameraViewProps) => {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted;

  if (!hasPermission && !capturedImage && cameraPermission?.canAskAgain !== false) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg, padding: 20 }}>
        <Icon name="camera" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>
          Permiso de cámara requerido
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }}>
          Necesitamos acceso a la cámara para escanear electrodomésticos.
        </Text>
        <Button onPress={requestPermission} style={{ marginTop: 20, width: '80%' }}>
          <Icon name="camera" size={18} color={theme.bg} />
          <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Permitir cámara</Text>
        </Button>
      </View>
    );
  }

  const aspectRatio = 3 / 4;

  return (
    <View style={[{ flex: 1, backgroundColor: theme.bg }, style]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          <Icon name="arrowLeft" size={20} color={theme.cyan} />
        </TouchableOpacity>
        {isRescan && (
          <View
            style={{
              backgroundColor: theme.goldDim,
              borderWidth: 1,
              borderColor: `${theme.gold}66`,
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              flex: 1,
              marginHorizontal: 16,
            }}
          >
            <Icon name="alertTriangle" size={18} color={theme.gold} />
            <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>
              Rescán para mayor precisión
            </Text>
          </View>
        )}
      </View>

      {/* Preview o imagen capturada */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        {capturedImage ? (
          <View
            style={{
              width: '100%',
              aspectRatio,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: theme.border,
            }}
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
              style={{ flex: 1, resizeMode: 'contain' }}
            />
          </View>
        ) : (
          <ExpoCameraView
            ref={ref}
            style={{
              width: '100%',
              aspectRatio,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: theme.border,
              overflow: 'hidden',
            }}
            facing="back"
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
              <View
                style={{
                  width: '80%',
                  height: '80%',
                  borderWidth: 2,
                  borderColor: theme.cyan,
                  borderRadius: 12,
                  borderStyle: 'dashed',
                }}
              />
            </View>
          </ExpoCameraView>
        )}
      </View>

      {/* Controles */}
      <View style={{ padding: 20, gap: 16 }}>
        {capturedImage ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              variant="ghost"
              onPress={() => onTakePicture()}
              style={{ flex: 1 }}
            >
              <Icon name="x" size={18} color={theme.cyan} />
              <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Nueva foto</Text>
            </Button>
            <Button
              onPress={onAnalyzePress}
              disabled={analyzing}
              style={{ flex: 1 }}
            >
              {analyzing ? (
                <>
                  <Icon name="refreshCw" size={18} color={theme.bg} />
                  <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Analizando...</Text>
                </>
              ) : (
                <>
                  <Icon name="scan" size={18} color={theme.bg} />
                  <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Analizar</Text>
                </>
              )}
            </Button>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button onPress={onTakePicture} style={{ flex: 1 }}>
              <Icon name="camera" size={18} color={theme.bg} />
              <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Tomar foto</Text>
            </Button>
            <Button variant="ghost" onPress={onGalleryPress} style={{ flex: 1 }}>
              <Icon name="image" size={18} color={theme.cyan} />
              <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Galería</Text>
            </Button>
          </View>
        )}

        <Text
          style={{
            fontSize: 10,
            color: theme.textMuted,
            textAlign: 'center',
            lineHeight: 16,
            fontFamily: 'monospace',
            letterSpacing: 0.5,
          }}
        >
          {capturedImage
            ? 'Presiona Analizar para identificar el electrodoméstico.'
            : 'Apunta la cámara a la etiqueta técnica del electrodoméstico.'}
        </Text>
      </View>
    </View>
  );
};

export default CameraView;