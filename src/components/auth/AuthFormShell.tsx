import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';

type Props = {
  children: ReactNode;
};

/**
 * Login / SignUp: ağ fon, KAV + ScrollView, safe area — təkrarlanan layout (DRY).
 * Android: `behavior` yalnız iOS; Android üçün `adjustResize` manifestdə tövsiyə olunur.
 */
export function AuthFormShell({ children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}>
      <ScrollView
        style={styles.scrollOuter}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollOuter: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});
