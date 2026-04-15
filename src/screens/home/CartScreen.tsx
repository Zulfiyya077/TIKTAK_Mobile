import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  addProductToBasket,
  fetchBasket,
  removeOneFromBasket,
} from '../../api/basket';
import type { BasketData } from '../../api/types';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import { getErrorMessage } from '../../utils/error';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80';

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [basket, setBasket] = useState<BasketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadBasket = useCallback(async () => {
    try {
      const b = await fetchBasket();
      setBasket(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  async function handleAdd(productId: number) {
    setBusyId(productId);
    try {
      const b = await addProductToBasket(productId);
      setBasket(b);
      Alert.alert('Uğurlu', 'Sayı artırıldı');
    } catch (error: unknown) {
      Alert.alert('Xəta', getErrorMessage(error, 'Əməliyyat alınmadı'));
    } finally {
      setBusyId(null);
    }
  }

  async function handleMinus(productId: number) {
    setBusyId(productId);
    try {
      const b = await removeOneFromBasket(productId);
      setBasket(b);
      Alert.alert('Məlumat', 'Sayı azaldıldı');
    } catch (error: unknown) {
      Alert.alert('Xəta', getErrorMessage(error, 'Əməliyyat alınmadı'));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isEmpty = !basket || basket.items.length === 0;

  if (isEmpty) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="Səbətim" />
        <View style={styles.emptyContainer}>
           <View style={styles.emptyIconCircle}>
              <MaterialIcons name="close" size={60} color="#E5E7EB" />
           </View>
           <Text style={styles.emptyText}>Səbətinizdə məhsul yoxdur</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Səbətim" />

      <FlatList
        data={basket.items}
        keyExtractor={item => String(item.id)}
        style={styles.flatList}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.product.img_url || PLACEHOLDER }}
              style={styles.itemImg}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.product.title} 1 {item.product.type}</Text>
              <Text style={styles.itemPrice}>{item.product.price} AZN</Text>
            </View>
            <View style={styles.quantityContainer}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => handleMinus(item.product.id)}
                disabled={busyId === item.product.id}>
                <MaterialIcons name={item.quantity > 1 ? "remove" : "delete-outline"} size={20} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => handleAdd(item.product.id)}
                disabled={busyId === item.product.id}>
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ümumi: {basket.total} AZN</Text>
          <Text style={styles.totalLabel}>Yekun məbləğ:</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Çatdırılma: Pulsuz</Text>
          <Text style={styles.totalValue}>{basket.total} AZN</Text>
        </View>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutBtnText}>Sifarişi tamamla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 12,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
