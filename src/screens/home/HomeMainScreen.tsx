import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchCampaigns, fetchCategories } from '../../api/catalog';
import { fetchProfile } from '../../api/profile';
import type { Category } from '../../api/types';
import { AddressCard } from '../../components/home/AddressCard';
import { CampaignBanner } from '../../components/home/CampaignBanner';
import { CategoryCard } from '../../components/home/CategoryCard';
import { HomeHeader } from '../../components/home/HomeHeader';
import type { HomeStackParamList } from '../../navigation/types';
import { colors, layout } from '../../theme';

export function HomeMainScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerTitle, setBannerTitle] = useState(
    'MEYVƏLƏRƏ HƏFTƏ SONUNA KİMİ 20% ENDİRİM',
  );
  const [bannerImg, setBannerImg] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pad = layout.screenPadding;
  const gap = layout.gap;
  const tileW = (width - pad * 2 - gap * 2) / 3;

  const load = useCallback(async () => {
    try {
      const [cats, camps, prof] = await Promise.all([
        fetchCategories(),
        fetchCampaigns().catch(() => [] as const),
        fetchProfile().catch(() => null),
      ]);
      setCategories(cats);
      setAddress(prof?.address ?? null);
      if (camps.length > 0) {
        setBannerTitle(camps[0].title);
        setBannerImg(camps[0].img_url);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.root}>
      <HomeHeader onCartPress={() => navigation.navigate('Cart')} />
      <View style={styles.fill}>
        {loading ? (
          <ActivityIndicator style={styles.center} color={colors.primary} />
        ) : (
          <FlatList
          data={categories}
          keyExtractor={item => String(item.id)}
          numColumns={3}
          columnWrapperStyle={styles.row3}
          style={styles.list}
          contentContainerStyle={{
            paddingHorizontal: pad,
            paddingBottom: insets.bottom + 88,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              <AddressCard address={address} />
              <CampaignBanner title={bannerTitle} imageUri={bannerImg} />
            </>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Kateqoriya tapılmadı.</Text>
          }
          renderItem={({ item }) => (
            <CategoryCard
              item={item}
              width={tileW}
              onPress={() =>
                navigation.navigate('CategoryProducts', {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
            />
          )}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  center: {
    marginTop: 48,
  },
  list: {
    flex: 1,
  },
  row3: {
    justifyContent: 'space-between',
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 24,
    fontSize: 15,
  },
});
