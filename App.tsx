/**
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { fonts } from './src/theme';

const RNText = Text as typeof Text & {
  defaultProps?: { style?: object };
};
const RNTextInput = TextInput as typeof TextInput & {
  defaultProps?: { style?: object };
};
RNText.defaultProps = { ...(RNText.defaultProps ?? {}), style: { fontFamily: fonts.regular } };
RNTextInput.defaultProps = {
  ...(RNTextInput.defaultProps ?? {}),
  style: { fontFamily: fonts.regular },
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: { flex: 1 },
});
