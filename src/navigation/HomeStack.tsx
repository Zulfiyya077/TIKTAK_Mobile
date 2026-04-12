import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/home/CartScreen';
import { CategoryProductsScreen } from '../screens/home/CategoryProductsScreen';
import { HomeMainScreen } from '../screens/home/HomeMainScreen';
import { CheckoutScreen } from '../screens/home/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/home/OrderSuccessScreen';
import { colors, fonts } from '../theme';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
        headerBackTitleStyle: { fontFamily: fonts.regular },
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({
          headerShown: true,
          title: route.params.categoryName,
          headerBackTitle: 'Geri',
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
