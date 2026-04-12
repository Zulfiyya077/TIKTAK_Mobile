import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SearchScreen } from '../screens/SearchScreen';
import { colors, fonts } from '../theme';
import { AccountTabContainer } from './AccountTabContainer';
import { HomeStack } from './HomeStack';
import { LogoutContext } from './LogoutContext';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = {
  onLogout: () => void;
};

type TabIconProps = { color: string; size: number };

function TabIconHome({ color, size }: TabIconProps) {
  return <MaterialIcons name="home" size={size} color={color} />;
}

function TabIconSearch({ color, size }: TabIconProps) {
  return <MaterialIcons name="search" size={size} color={color} />;
}

function TabIconAccount({ color, size }: TabIconProps) {
  return <MaterialIcons name="person" size={size} color={color} />;
}

const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarLabelStyle: { fontSize: 12, fontFamily: fonts.medium },
  tabBarStyle: {
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    minHeight: Platform.OS === 'ios' ? 88 : 64,
  },
};

export function MainTabs({ onLogout }: Props) {
  return (
    <LogoutContext.Provider value={onLogout}>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: 'Əsas',
            tabBarIcon: TabIconHome,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchScreen}
          options={{
            title: 'Axtar',
            tabBarIcon: TabIconSearch,
          }}
        />
        <Tab.Screen
          name="AccountTab"
          component={AccountTabContainer}
          options={{
            title: 'Hesabım',
            tabBarIcon: TabIconAccount,
          }}
        />
      </Tab.Navigator>
    </LogoutContext.Provider>
  );
}
