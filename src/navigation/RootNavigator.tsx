import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getAccessToken } from '../storage/tokens';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

export function RootNavigator() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(false);

  const refreshSession = useCallback(async () => {
    const t = await getAccessToken();
    setSession(!!t);
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setBooting(false));
  }, [refreshSession]);

  if (booting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {session ? (
        <MainTabs onLogout={() => setSession(false)} />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
          <AuthStack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                onLoggedIn={() => setSession(true)}
              />
            )}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
