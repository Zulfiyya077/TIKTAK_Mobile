import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  label: string;
} & TextInputProps;

export function LabeledInput({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
});
