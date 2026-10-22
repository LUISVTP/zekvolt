// ─── src/screens/auth/LoginScreen.tsx ────────────────────────────────────
// Pantalla de inicio de sesión

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/styles/theme';
import { Button, Input } from '@/components/ui';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import Icon from '@/components/icons/Icon';
import { signIn } from '@/services/auth.service';
import { ZekvoltError } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      setErrorMsg('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await signIn(email.trim(), pass);
      if (error) throw error;
      // Navegación automática via auth state change en App
    } catch (err) {
      const message = err instanceof ZekvoltError ? err.message : 'Error al iniciar sesión';
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
        {/* Header */}
        <View
          style={{
            height: 220,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            paddingTop: 20,
          }}
        >
          <ZekvoltLogo size={72} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: theme.cyan }}>Zekvolt</Text>
            <Text style={{ fontSize: 10, color: theme.textMuted, letterSpacing: 3, textTransform: 'uppercase' }}>
              Regulación Eléctrica Residencial
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={{ padding: 24, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text, marginBottom: 6 }}>Bienvenido</Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginBottom: 28 }}>
            Inicia sesión para gestionar tu consumo eléctrico
          </Text>

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

          <Input
            label="Correo electrónico"
            icon="mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="tu@email.com"
            returnKeyType="next"
          />
          <Input
            label="Contraseña"
            icon="lock"
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={setPass}
            placeholder="••••••••"
            rightElement={
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                <Icon name={showPass ? "eyeOff" : "eye"} size={16} color={theme.textMuted} />
              </TouchableOpacity>
            }
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
            <Text style={{ color: theme.cyan, fontSize: 13 }}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button onPress={handleLogin} disabled={loading} style={{ marginBottom: 24 }}>
            {loading ? (
              <>
                <ActivityIndicator size="small" color={theme.bg} />
                <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700', marginLeft: 8 }}>Ingresando...</Text>
              </>
            ) : (
              <>
                <Icon name="bolt" size={18} color={theme.bg} />
                <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Iniciar Sesión</Text>
              </>
            )}
          </Button>

          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: theme.cyan, fontWeight: '600', fontSize: 14 }}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}