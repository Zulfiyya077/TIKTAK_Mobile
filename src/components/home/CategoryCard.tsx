import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { colors, layout } from '../../theme';
import type { Category } from '../../api/types';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1592924357228-91a4daadcabf?w=300&q=80';

type Props = {
  item: Category;
  width: number;
  onPress: () => void;
};

export function CategoryCard({ item, width, onPress }: Props) {
  const uri = item.img_url?.trim() ? item.img_url : PLACEHOLDER;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={onPress}
      style={[styles.card, { width }]}>
      <Image source={{ uri }} style={styles.img} resizeMode="cover" />
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: layout.cardRadius,
    marginBottom: layout.gap,
    paddingBottom: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  img: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.addressBg,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
    minHeight: 36,
  },
});
