import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, Text, View } from 'react-native';
import { loginRequest } from '../api/auth';
import { AuthFormShell } from '../components/auth/AuthFormShell';
import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthStackParamList } from '../navigation/types';
import { saveTokens } from '../storage/tokens';
import { authScreenStyles } from '../styles/authScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'> & {
  onLoggedIn: () => void;
};

export function LoginScreen({ navigation, onLoggedIn }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!phone.trim() || !password) {
      Alert.alert('Bildiriş', 'Telefon və parolu daxil edin.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginRequest(phone.trim(), password);
      await saveTokens(
        data.tokens.access_token,
        data.tokens.refresh_token,
      );
      onLoggedIn();
    } catch (e) {
      Alert.alert('Xəta', e instanceof Error ? e.message : 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell>
      <Text style={authScreenStyles.title}>Daxil ol</Text>
      <LabeledInput
        label="Telefon"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        placeholder="telefon"
      />
      <LabeledInput
        label="Parol"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholder="parol"
      />
      <PrimaryButton title="Daxil ol" onPress={onSubmit} loading={loading} />
      <View style={authScreenStyles.footerRow}>
        <Text style={authScreenStyles.footerMuted}>Hesabınız yoxdursa </Text>
        <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
          <Text style={authScreenStyles.footerLink}>Qeydiyyatdan keç</Text>
        </Pressable>
      </View>
    </AuthFormShell>
  );
}
