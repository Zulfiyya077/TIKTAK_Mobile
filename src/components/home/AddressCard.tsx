import { StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '../../theme';

type Props = {
  address: string | null;
};

export function AddressCard({ address }: Props) {
  const line = address?.trim() || 'Ünvan əlavə edin (profil)';

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Çatdırılma ünvanı:</Text>
      <Text style={styles.value} numberOfLines={2}>
        {line}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.addressBg,
    borderRadius: layout.cardRadius,
    padding: layout.screenPadding - 4,
    marginBottom: layout.gap,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
});
