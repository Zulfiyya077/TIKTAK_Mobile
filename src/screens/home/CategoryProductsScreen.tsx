import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  addProductToBasket,
  fetchBasket,
  removeOneBasketLine,
} from '../../api/basket';
import { fetchCategories, fetchProducts } from '../../api/catalog';
import type { BasketData, Category, Product } from '../../api/types';
import { ProductCard } from '../../components/home/ProductCard';
import type { HomeStackParamList } from '../../navigation/types';
import { colors, layout } from '../../theme';
import { ProductDetailSheet } from '../../components/home/ProductDetailSheet';

export function CategoryProductsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'CategoryProducts'>>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { categoryId, categoryName } = route.params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState(categoryId);
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketData>({
    items: [],
    total: '0.00',
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const pad = layout.screenPadding;
  const gap = layout.gap;
  const tileW = (width - pad * 2 - gap) / 2;

  const loadBasket = useCallback(async () => {
    const b = await fetchBasket();
    setBasket(b);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchProducts({ categoryId: selectedId });
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  useEffect(() => {
    const c = categories.find(x => x.id === selectedId);
    navigation.setOptions({
      title: c?.name ?? categoryName,
    });
  }, [selectedId, categories, navigation, categoryName]);

  const basketMap = useCallback(() => {
    const map = new Map<number, BasketData['items'][0]>();
    basket.items.forEach(i => map.set(i.product.id, i));
    return map;
  }, [basket.items]);

  const lineFor = (productId: number) => basketMap().get(productId);

  async function handleAdd(productId: number) {
    setBusyId(productId);
    try {
      const b = await addProductToBasket(productId);
      setBasket(b);
      Alert.alert('Uğurlu', 'Məhsul səbətə əlavə edildi!');
    } catch (err: any) {
      Alert.alert('Xəta', err.message || 'Səbətə əlavə olunmadı');
    } finally {
      setBusyId(null);
    }
  }

  async function handleMinus(productId: number) {
    const line = lineFor(productId);
    if (!line) {
      return;
    }
    setBusyId(productId);
    try {
      const b = await removeOneBasketLine(line.id);
      setBasket(b);
      Alert.alert('Məlumat', 'Məhsulun sayı azaldıldı');
    } catch (err: any) {
      Alert.alert('Xəta', err.message || 'Əməliyyat alınmadı');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBlock}>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.btnBack, pressed && styles.pressed]}
          onPress={() => navigation.popToTop()}>
          <MaterialIcons name="grid-view" size={22} color="#FFFFFF" />
          <Text style={styles.btnBackText}>Əsas kateqoriyalara bax</Text>
        </Pressable>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {categories.map(c => {
            const active = c.id === selectedId;
            return (
              <Pressable
                key={c.id}
                onPress={() => setSelectedId(c.id)}
                style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.listWrap}>
        {loading ? (
          <ActivityIndicator style={styles.center} color={colors.primary} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.row2}
            style={styles.list}
            contentContainerStyle={{
              paddingHorizontal: pad,
              paddingBottom: insets.bottom + 120,
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <MaterialIcons name="close" size={60} color="#E5E7EB" />
                </View>
                <Text style={styles.emptyText}>Bu kateqoriyada məhsul yoxdur</Text>
              </View>
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                line={lineFor(item.id)}
                width={tileW}
                busy={busyId === item.id}
                onAdd={() => handleAdd(item.id)}
                onMinus={() => handleMinus(item.id)}
                onPress={() => setSelectedProduct(item)}
              />
            )}
          />
        )}
      </View>

      {basket.count > 0 && (
        <Pressable
          style={styles.basketBar}
          onPress={() => navigation.navigate('Cart')}>
          <View style={styles.basketBarLeft}>
            <View style={styles.basketBadge}>
              <Text style={styles.basketBadgeText}>{basket.count}</Text>
            </View>
            <Text style={styles.basketBarTitle}>Sifarişlər</Text>
          </View>
          <Text style={styles.basketBarPrice}>₼ {basket.total}</Text>
        </Pressable>
      )}

      <ProductDetailSheet
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={productId => {
          handleAdd(productId);
          setSelectedProduct(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listWrap: {
    flex: 1,
  },
  topBlock: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 12,
    gap: 12,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: layout.cardRadius,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.92,
  },
  btnBackText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  chips: {
    paddingVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.chipInactive,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  center: {
    marginTop: 48,
  },
  list: {
    flex: 1,
  },
  row2: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
  },
  basketBar: {
    position: 'absolute',
    bottom: layout.screenPadding + 20,
    left: layout.screenPadding,
    right: layout.screenPadding,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  basketBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  basketBadge: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  basketBarTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  basketBarPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
