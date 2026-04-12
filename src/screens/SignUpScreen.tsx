import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, Text, View } from 'react-native';
import { signupRequest } from '../api/auth';
import { AuthFormShell } from '../components/auth/AuthFormShell';
import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthStackParamList } from '../navigation/types';
import { authScreenStyles } from '../styles/authScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!fullName.trim() || !phone.trim() || !password) {
      Alert.alert('Bildiriş', 'Bütün mətn sahələrini doldurun.');
      return;
    }
    setLoading(true);
    try {
      await signupRequest(fullName.trim(), phone.trim(), password);
      Alert.alert('Uğurlu', 'Qeydiyyat tamamlandı. İndi daxil olun.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      Alert.alert('Xəta', e instanceof Error ? e.message : 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell>
      <Text style={authScreenStyles.title}>Qeydiyyatdan keç</Text>
      <LabeledInput
        label="Ad, soyad"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        placeholder="ad soyad"
      />
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
      <PrimaryButton title="Qeydiyyat" onPress={onSubmit} loading={loading} />
      <View style={authScreenStyles.footerRow}>
        <Text style={authScreenStyles.footerMuted}>Hesabınız varsa </Text>
        <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
          <Text style={authScreenStyles.footerLink}>Daxil olun</Text>
        </Pressable>
      </View>
    </AuthFormShell>
  );
}
