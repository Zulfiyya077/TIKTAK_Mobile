import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProducts } from '../../api/catalog';
import { fetchBasket, addProductToBasket, removeOneFromBasket } from '../../api/basket';
import type { BasketData, Product } from '../../api/types';
import { ProductCard } from '../../components/home/ProductCard';
import { ProductDetailSheet } from '../../components/home/ProductDetailSheet';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { colors, layout } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketData>({ items: [], total: '0.00', count: 0 });
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const pad = layout.screenPadding;
  const gap = layout.gap;
  const tileW = (width - pad * 2 - gap) / 2;

  const loadData = useCallback(async () => {
    try {
      // Mocking favorites by fetching some products
      const list = await fetchProducts({ categoryId: 1 }); // Just an example
      setProducts(list.slice(0, 4));
      const b = await fetchBasket();
      setBasket(b);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const lineFor = (productId: number) =>
    basket.items.find(i => i.product.id === productId);

  async function handleAdd(productId: number) {
    setBusyId(productId);
    try {
      const b = await addProductToBasket(productId);
      setBasket(b);
    } finally {
      setBusyId(null);
    }
  }

  async function handleMinus(productId: number) {
    setBusyId(productId);
    try {
      const b = await removeOneFromBasket(productId);
      setBasket(b);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Siyahılarım" />

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row2}
        style={styles.flatList}
        contentContainerStyle={styles.list}
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

       {basket.count > 0 && (
        <Pressable
          style={styles.basketBar}
          onPress={() => navigation.getParent()?.navigate('HomeTab', { screen: 'Cart' })}>
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
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 100,
  },
  flatList: {
    flex: 1,
  },
  row2: {
    justifyContent: 'space-between',
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
