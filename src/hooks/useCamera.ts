// ─── src/hooks/useCamera.ts ───────────────────────────────────────────
// Hook para manejo de cámara y galería

import { useState, useCallback, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export type CameraStep = 'idle' | 'scanning' | 'processing' | 'result' | 'manual';

interface UseCameraResult {
  cameraRef: React.RefObject<CameraView | null>;
  cameraPermission: ImagePicker.PermissionResponse | null;
  requestCameraPermission: () => Promise<void>;
  cameraStep: CameraStep;
  setCameraStep: (step: CameraStep) => void;
  showFullscreenCamera: boolean;
  setShowFullscreenCamera: (show: boolean) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  takePicture: () => Promise<void>;
  pickFromGallery: () => Promise<void>;
  resetCamera: () => void;
}

export function useCamera(): UseCameraResult {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraStep, setCameraStep] = useState<CameraStep>('idle');
  const [showFullscreenCamera, setShowFullscreenCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
      if (photo?.base64) {
        setCapturedImage(photo.base64);
        setShowFullscreenCamera(false);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo capturar la imagen: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar imágenes.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        setCapturedImage(result.assets[0].base64 ?? null);
      }
    } catch (err) {
      Alert.alert(
        'Librería no disponible',
        'Instala expo-image-picker:\n  npx expo install expo-image-picker'
      );
    }
  }, []);

  const resetCamera = useCallback(() => {
    setCameraStep('idle');
    setShowFullscreenCamera(false);
    setCapturedImage(null);
  }, []);

  return {
    cameraRef,
    cameraPermission,
    requestCameraPermission,
    cameraStep,
    setCameraStep,
    showFullscreenCamera,
    setShowFullscreenCamera,
    capturedImage,
    setCapturedImage,
    takePicture,
    pickFromGallery,
    resetCamera,
  };
}