import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, dimensions, fonts } from '../../theme';

type Props = {
  title: string;
  /** Default: navigation.goBack() */
  onBackPress?: () => void;
};

/**
 * Geri + mərkəzləşdirilmiş başlıq — səbət, checkout, profil alt ekranları üçün DRY.
 */
export function ScreenHeader({ title, onBackPress }: Props) {
  const navigation = useNavigation();
  const goBack = onBackPress ?? (() => navigation.goBack());

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        <Pressable
          onPress={goBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Geri">
          <MaterialIcons
            name="arrow-back"
            size={dimensions.headerIcon}
            color={colors.text}
          />
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  side: {
    width: dimensions.headerSide,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
  },
});
