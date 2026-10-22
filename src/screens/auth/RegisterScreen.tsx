// ─── src/screens/auth/RegisterScreen.tsx ─────────────────────────────────
// Pantalla de registro

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/styles/theme';
import { Button, Input } from '@/components/ui';
import Icon from '@/components/icons/Icon';
import { signUp } from '@/services/auth.service';
import { ZekvoltError } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !pass.trim()) {
      setErrorMsg('Por favor completa todos los campos');
      return;
    }
    if (pass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await signUp(email.trim(), pass);
      if (error) throw error;

      Alert.alert(
        'Cuenta creada',
        'Tu cuenta fue creada exitosamente. Inicia sesión para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      const message = err instanceof ZekvoltError ? err.message : 'Error al crear cuenta';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.bg }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 8 }}>
            <Icon name="arrowLeft" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>Crear cuenta</Text>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginBottom: 28 }}>Únete a Zekvolt y controla tu factura eléctrica</Text>

          {errorMsg ? (
            <View
              style={{
                backgroundColor: theme.redDim,
                borderWidth: 1,
                borderColor: theme.redMid,
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Icon name="info" size={15} color={theme.red} />
              <Text style={{ color: theme.red, fontSize: 13, flex: 1 }}>{errorMsg}</Text>
            </View>
          ) : null}

          <Input label="Nombre completo" icon="user" value={name} onChange={setName} placeholder="Juan García" returnKeyType="next" />
          <Input label="Correo electrónico" icon="mail" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" returnKeyType="next" />
          <Input
            label="Contraseña"
            icon="lock"
            type="password"
            value={pass}
            onChange={setPass}
            placeholder="Mín. 6 caracteres"
            returnKeyType="go"
            onSubmitEditing={handleRegister}
          />

          <View style={{ marginTop: 8, marginBottom: 24 }}>
            <Button onPress={handleRegister} disabled={loading}>
              {loading ? (
                <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Creando cuenta...</Text>
              ) : (
                <>
                  <Icon name="bolt" size={18} color={theme.bg} />
                  <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Crear cuenta</Text>
                </>
              )}
            </Button>
          </View>

          <Text style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', lineHeight: 19 }}>
            Al registrarte aceptas los <Text style={{ color: theme.cyan }}>Términos de uso</Text> y la <Text style={{ color: theme.cyan }}>Política de privacidad</Text> de Zekvolt.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}