import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '../screens/AccountScreen';
import { ProfileEditScreen } from '../screens/profile/ProfileEditScreen';
import { OrderHistoryScreen } from '../screens/profile/OrderHistoryScreen';
import { FavoritesScreen } from '../screens/profile/FavoritesScreen';
import type { AccountStackParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<AccountStackParamList>();

type Props = {
  onLogout: () => void;
};

export function AccountStack({ onLogout }: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="ProfileHome">
        {() => <AccountScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}
