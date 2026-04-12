import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';

type Props = {
  onCartPress: () => void;
  title?: string;
};

export function HomeHeader({ onCartPress, title = 'TIK TAK' }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.brand}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Səbət"
        onPress={onCartPress}
        style={styles.iconBtn}
        hitSlop={12}>
        <MaterialIcons name="shopping-cart" size={26} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.text,
  },
  iconBtn: {
    padding: 4,
  },
});
