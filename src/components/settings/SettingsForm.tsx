// ─── src/components/settings/SettingsForm.tsx ─────────────────────────────
// Formulario de configuración (perfil, tema, contraseña)

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleProp, ViewStyle, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useTheme } from '@/styles/theme';
import { Button, Input, Select } from '@/components/ui';
import { getDepartmentOptions, getStratumOptions, getCompanyOptions } from '@/data/companies';
import { getTariffForStratum, formatCOP } from '@/data/tariffs';
import Icon from '@/components/icons/Icon';
import type { Profile } from '@/types';

interface SettingsFormProps {
  profile: Profile;
  userEmail: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  onSaveProfile: (data: { city: string; estrato: number; company: string }) => Promise<void>;
  onChangePassword: (newPassword: string) => Promise<void>;
  onLogout: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SettingsForm = ({
  profile,
  userEmail,
  darkMode,
  onToggleTheme,
  onSaveProfile,
  onChangePassword,
  onLogout,
  style,
}: SettingsFormProps) => {
  const { theme } = useTheme();

  const [editCity, setEditCity] = useState(profile.city);
  const [editEstrato, setEditEstrato] = useState(String(profile.estrato));
  const [editCompany, setEditCompany] = useState(profile.company);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPwModal, setShowPwModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const companies = editCity ? getCompanyOptions(editCity) : [];
  const canSaveProfile = editCity && editEstrato && editCompany;

  const tariffPreview = canSaveProfile
    ? getTariffForStratum(editCompany, parseInt(editEstrato))
    : 0;

  const handleSaveProfile = async () => {
    if (!canSaveProfile) return;
    setSaving(true);
    try {
      await onSaveProfile({
        city: editCity,
        estrato: parseInt(editEstrato),
        company: editCompany,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error guardando perfil:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setPwSaving(true);
    try {
      await onChangePassword(newPassword);
      setNewPassword('');
      setShowPwModal(false);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 24, paddingBottom: 0 }}>
          {/* Perfil de usuario */}
          <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.cyanDim,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="user" size={24} color={theme.cyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>
                  {profile.city ? 'Perfil configurado' : 'Configurar perfil'}
                </Text>
                <Text style={{ fontSize: 13, color: theme.textMuted }}>{userEmail}</Text>
              </View>
            </View>

            {/* Configuración de tarifa */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'monospace' }}>
                Configuración de tarifa
              </Text>

              <Select
                label="Departamento / Ciudad"
                icon="mapPin"
                value={editCity}
                onChange={v => { setEditCity(v); setEditCompany(''); }}
                options={getDepartmentOptions()}
              />
              <Select
                label="Estrato socioeconómico"
                icon="home"
                value={editEstrato}
                onChange={setEditEstrato}
                options={getStratumOptions()}
              />
              {editCity ? (
                <Select
                  label="Empresa energética"
                  icon="zap"
                  value={editCompany}
                  onChange={setEditCompany}
                  options={[
                    { value: '', label: 'Selecciona tu empresa...' },
                    ...companies,
                  ]}
                />
              ) : null}
            </View>

            {canSaveProfile && (
              <View style={{ marginBottom: 16 }}>
                <View
                  style={{
                    backgroundColor: theme.cyanDim,
                    borderWidth: 1,
                    borderColor: theme.cyanMid,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ color: theme.cyan, fontSize: 13, fontWeight: '600' }}>Tu tarifa aproximada</Text>
                  <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 4 }}>
                    {formatCOP(tariffPreview).replace('COP', '')}
                    <Text style={{ fontSize: 13, fontWeight: '400', color: theme.textMuted }}> / kWh</Text>
                  </Text>
                </View>
                <Button onPress={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Icon name="refreshCw" size={18} color={theme.bg} />
                      <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Guardando...</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="bolt" size={18} color={theme.bg} />
                      <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>{saved ? 'Guardado ✓' : 'Guardar cambios'}</Text>
                    </>
                  )}
                </Button>
              </View>
            )}
          </View>

          {/* Apariencia */}
          <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
              Apariencia
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: darkMode ? theme.cyanDim : theme.goldDim,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={darkMode ? 'moon' : 'sun'} size={20} color={darkMode ? theme.cyan : theme.gold} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
                    {darkMode ? 'Modo oscuro' : 'Modo claro'}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>
                    {darkMode ? 'Activado' : 'Desactivado'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onToggleTheme} style={{ padding: 8 }}>
                <View
                  style={{
                    width: 52,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: darkMode ? theme.cyan : theme.border,
                    padding: 2,
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: theme.bg,
                      marginLeft: darkMode ? 26 : 2,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cuenta */}
          <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
              Cuenta
            </Text>

            <TouchableOpacity
              onPress={() => setShowPwModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.goldDim,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="lock" size={20} color={theme.gold} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>Cambiar contraseña</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>Actualiza tu contraseña</Text>
                </View>
              </View>
              <Icon name="chevronRight" size={18} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.redDim,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="logOut" size={20} color={theme.red} />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.red }}>Cerrar sesión</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>Salir de tu cuenta</Text>
                </View>
              </View>
              <Icon name="chevronRight" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Versión de la app */}
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              Zekvolt v1.0.0
            </Text>
            <Text style={{ color: theme.textSub, fontSize: 11, marginTop: 4 }}>
              Regulación Eléctrica Residencial
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Modal de cambio de contraseña
const ChangePasswordModal = ({
  visible,
  onClose,
  onSubmit,
  saving,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
}) => {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'center' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 8 }}>
            Cambiar contraseña
          </Text>
          <Text style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center', marginBottom: 20 }}>
            Ingresa tu nueva contraseña (mín. 6 caracteres)
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
              Nueva contraseña
            </Text>
            <View
              style={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Input
                type={show ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Mín. 6 caracteres"
                inputStyle={{ flex: 1, color: theme.text, fontSize: 15, paddingVertical: 14 }}
                style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }}
              />
              <TouchableOpacity onPress={() => setShow(!show)} style={{ padding: 4 }}>
                <Icon name={show ? "eyeOff" : "eye"} size={16} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" onPress={onClose} style={{ paddingVertical: 12 }}>
                <Text style={{ color: theme.cyan, fontSize: 15, fontWeight: '700' }}>Cancelar</Text>
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button onPress={onSubmit} disabled={saving || password.length < 6} style={{ paddingVertical: 12 }}>
                {saving ? (
                  <>
                    <Icon name="refreshCw" size={18} color={theme.bg} />
                    <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Guardando...</Text>
                  </>
                ) : (
                  <Text style={{ color: theme.bg, fontSize: 15, fontWeight: '700' }}>Actualizar</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SettingsForm;