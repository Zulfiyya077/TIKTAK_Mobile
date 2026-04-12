import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { colors, fonts } from '../../theme';

export function ProfileEditScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Hesab" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput style={styles.input} placeholder="Ad, Soyad" />

            <Text style={styles.label}>Ünvan</Text>
            <TextInput style={styles.input} placeholder="Ünvan" />

            <Text style={styles.label}>Telefon nömrəsi</Text>
            <TextInput style={styles.input} placeholder="+994 (__) ___ __ __" />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Şifrə</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

            <Text style={styles.label}>Şifrəni təkrar</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

            <Pressable style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Yadda saxla</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kav: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: -8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});
