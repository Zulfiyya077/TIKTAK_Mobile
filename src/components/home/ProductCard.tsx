import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, layout } from '../../theme';
import type { BasketItem, Product } from '../../api/types';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80';

type Props = {
  product: Product;
  line: BasketItem | undefined;
  width: number;
  busy: boolean;
  onAdd: () => void;
  onMinus: () => void;
  onPress: () => void;
};

export function ProductCard({
  product,
  line,
  width,
  busy,
  onAdd,
  onMinus,
  onPress,
}: Props) {
  const uri = product.img_url?.trim() ? product.img_url : PLACEHOLDER;
  const unitLabel = `1 ${product.type}`;
  const inBasket = !!line && line.quantity > 0;

  return (
    <View style={[styles.card, { width }]}>
      <Pressable onPress={onPress}>
        <Image source={{ uri }} style={styles.img} resizeMode="contain" />
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.unit}>{unitLabel}</Text>
        <Text style={styles.price}>{product.price} AZN</Text>
      </Pressable>

      {!inBasket ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAdd}
          disabled={busy}
          style={({ pressed }) => [
            styles.btnAdd,
            pressed && styles.btnAddPressed,
            busy && styles.btnDisabled,
          ]}
          hitSlop={10}>
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnAddText}>Səbətə əlavə et</Text>
          )}
        </Pressable>
      ) : (
        <View style={styles.basketBlock}>
          <Text style={styles.totalLine}>
            {line.quantity} {product.type} = {line.total_price} AZN
          </Text>
          <View style={styles.rowActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onMinus}
              disabled={busy}
              style={({ pressed }) => [
                styles.btnMinus,
                pressed && styles.btnMinusPressed,
              ]}
              hitSlop={10}>
              <Text style={styles.minusText}>−</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onAdd}
              disabled={busy}
              style={({ pressed }) => [
                styles.btnPlus,
                pressed && styles.btnPlusPressed,
                busy && styles.btnDisabled,
              ]}
              hitSlop={10}>
              {busy ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.plusText}>+ 1 {product.type}</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: layout.cardRadius,
    padding: 10,
    marginBottom: layout.gap,
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
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    minHeight: 40,
  },
  unit: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  btnAdd: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  btnAddPressed: {
    backgroundColor: colors.primaryPressed,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnAddText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  basketBlock: {
    gap: 8,
  },
  totalLine: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.priceRed,
    textAlign: 'center',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnMinus: {
    flex: 1,
    backgroundColor: colors.priceRed,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMinusPressed: {
    opacity: 0.9,
  },
  minusText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  btnPlus: {
    flex: 1.4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  btnPlusPressed: {
    backgroundColor: colors.primaryPressed,
  },
  plusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
