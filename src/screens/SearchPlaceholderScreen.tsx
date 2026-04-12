import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function SearchPlaceholderScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Axtar</Text>
      <Text style={styles.sub}>Tezliklə burada axtarış olacaq.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
