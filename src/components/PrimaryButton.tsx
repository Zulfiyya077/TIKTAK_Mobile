import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, loading, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        loading && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
  },
  disabled: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: fonts.medium,
  },
});
