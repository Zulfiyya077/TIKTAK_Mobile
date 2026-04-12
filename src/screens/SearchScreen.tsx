import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { searchProducts } from '../api/catalog';
import type { Product } from '../api/types';
import { colors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80';

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchProducts(text);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TIK TAK</Text>
        <Pressable onPress={() => navigation.navigate('Cart')}>
           <MaterialIcons name="shopping-cart" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Alma"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      )}

      <FlatList
        data={results}
        keyExtractor={item => String(item.id)}
        style={styles.flatList}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => {
              // Usually navigation to details or category
              // For now, let's just log or open a modal if integrated
            }}>
            <Image
              source={{ uri: item.img_url || PLACEHOLDER }}
              style={styles.itemImg}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title} 1 {item.type}</Text>
              <Text style={styles.itemPrice}>{item.price} AZN</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading && query.length >= 2 ? (
            <Text style={styles.empty}>Məhsul tapılmadı</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
  },
  searchBar: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  loader: {
    marginTop: 20,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  itemImg: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
