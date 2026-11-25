// ─── src/components/tutorial/TutorialOverlay.tsx ──────────────────────
// Tutorial guiado de bienvenida: repasa los apartados y funciones de Zekvolt.
// Se muestra la primera vez que el usuario entra y desde Ajustes.

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@/components/ui/AppText';
import { Button } from '@/components/ui';
import Icon, { IconName } from '@/components/icons/Icon';
import { useTheme } from '@/styles/theme';

const STORAGE_KEY = 'zekvolt/tutorial/completed';

interface TutorialStep {
  icon: IconName;
  title: string;
  description: string;
}

const STEPS: TutorialStep[] = [
  {
    icon: 'bolt',
    title: 'Bienvenido a Zekvolt',
    description:
      'Te ayudamos a entender tu consumo eléctrico y a estimar tu factura según tu estrato y tu empresa de energía.',
  },
  {
    icon: 'activity',
    title: 'Inicio',
    description:
      'Aquí ves tu factura estimada, el consumo diario y mensual, y los aparatos que más consumen. Con el botón "Ver gráficas" puedes ver la distribución de tu consumo.',
  },
  {
    icon: 'grid',
    title: 'Aparatos',
    description:
      'Agrega tus electrodomésticos por categoría, escríbelos manualmente o busca el modelo exacto. Puedes ajustar las horas de uso y la cantidad, o eliminar los que ya no tengas.',
  },
  {
    icon: 'camera',
    title: 'Escanear con IA',
    description:
      'Toma una foto de la etiqueta del aparato y la inteligencia artificial leerá su potencia. Si no se lee, te dará un valor estimado y podrás corregirlo.',
  },
  {
    icon: 'zap',
    title: 'Medidor',
    description:
      'Registra la lectura de tu medidor eléctrico. La app la compara con la anterior para mostrarte cuánto consumiste y cuánto costó en el período.',
  },
  {
    icon: 'settings',
    title: 'Ajustes',
    description:
      'Cambia tu perfil, el tema claro u oscuro, el tamaño del texto y el alto contraste. También puedes repetir este tutorial cuando quieras.',
  },
  {
    icon: 'check',
    title: 'Todo listo',
    description:
      'Empieza agregando tu primer electrodoméstico en Aparatos o escaneando uno con la cámara. ¡Bienvenido!',
  },
];

interface TutorialContextValue {
  openTutorial: () => void;
  closeTutorial: () => void;
  showTutorialIfNeeded: (userId?: string) => Promise<void>;
  isVisible: boolean;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [storageKey, setStorageKey] = useState(STORAGE_KEY);

  const openTutorial = useCallback(() => {
    setStep(0);
    setVisible(true);
  }, []);

  const closeTutorial = useCallback(() => {
    AsyncStorage.setItem(storageKey, 'true').catch(() => {});
    setVisible(false);
    setStep(0);
  }, [storageKey]);

  const showTutorialIfNeeded = useCallback(async (userId?: string) => {
    const key = userId ? `${STORAGE_KEY}/${userId}` : STORAGE_KEY;
    setStorageKey(key);
    try {
      const seen = await AsyncStorage.getItem(key);
      if (seen !== 'true') {
        setStep(0);
        setVisible(true);
      }
    } catch {
      setStep(0);
      setVisible(true);
    }
  }, []);

  const value = { openTutorial, closeTutorial, showTutorialIfNeeded, isVisible: visible };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      <TutorialModal
        visible={visible}
        step={step}
        onStepChange={setStep}
        onClose={closeTutorial}
      />
    </TutorialContext.Provider>
  );
}

export function useTutorial(): TutorialContextValue {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial debe usarse dentro de TutorialProvider');
  }
  return context;
}

function TutorialModal({
  visible,
  step,
  onStepChange,
  onClose,
}: {
  visible: boolean;
  step: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      onClose();
    } else {
      onStepChange(step + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: 420,
            backgroundColor: theme.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 24,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              accessibilityLiveRegion="polite"
              style={{ fontSize: 12, color: theme.textMuted }}
            >
              Paso {step + 1} de {STEPS.length}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Omitir tutorial"
              hitSlop={8}
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.textMuted }}>Omitir</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 16 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: theme.cyanDim,
                borderWidth: 1,
                borderColor: theme.cyanMid,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={current.icon} size={34} color={theme.cyan} />
            </View>
          </View>

          <Text style={{ fontSize: 21, fontWeight: '800', color: theme.text, textAlign: 'center' }}>
            {current.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.textMuted,
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 21,
            }}
          >
            {current.description}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === step ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: index === step ? theme.cyan : theme.border,
                }}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            {step > 0 && (
              <Button
                variant="ghost"
                onPress={() => onStepChange(step - 1)}
                fullWidth={false}
                accessibilityLabel="Paso anterior"
                style={{ flex: 1, paddingVertical: 12 }}
              >
                <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Anterior</Text>
              </Button>
            )}
            <Button
              onPress={next}
              fullWidth={false}
              accessibilityLabel={isLast ? 'Terminar tutorial' : 'Siguiente paso'}
              style={{ flex: 1, paddingVertical: 12 }}
            >
              <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>
                {isLast ? 'Empezar' : 'Siguiente'}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default TutorialProvider;
