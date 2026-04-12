import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { fetchProfile } from '../api/profile';
import type { UserProfile } from '../api/types';
import { clearTokens } from '../storage/tokens';
import { colors, fonts } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AccountStackParamList } from '../navigation/types';

type Props = {
  onLogout: () => void;
};

export function AccountScreen({ onLogout }: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AccountStackParamList>>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  const menuItems = [
    { id: 'edit', title: 'Hesab məlumatlarım', icon: 'person-outline', route: 'ProfileEdit' as const },
    { id: 'favorites', title: 'Siyahılarım', icon: 'favorite-border', route: 'Favorites' as const },
    { id: 'history', title: 'Sifariş tarixçəsi', icon: 'history', route: 'OrderHistory' as const },
  ];

  const handleLogout = () => {
    clearTokens().then(onLogout);
  };

  return (
    <ScrollView style={[styles.root, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.headerTitle}>Hesabım</Text>

      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <MaterialIcons name="person" size={80} color="#9CA3AF" />
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Sərxan Rəhimli'}</Text>
        <Text style={styles.phone}>{profile?.phone || '+994 10 310 38 97'}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map(item => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={() => navigation.navigate(item.route)}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name={item.icon} size={24} color={colors.text} />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
          </Pressable>
        ))}

        <Pressable
          style={({ pressed }) => [styles.menuItem, styles.logoutItem, pressed && styles.pressed]}
          onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="logout" size={24} color="#EF4444" />
            <Text style={[styles.menuText, styles.logoutText]}>Çıxış</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  name: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  menu: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444',
  },
  pressed: {
    opacity: 0.7,
  },
});
