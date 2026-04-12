import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme';
import { IMAGES } from '../assets';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.content}>
        <Image
          source={IMAGES.fruitSplash}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.blurb}>
          Sizə daha əlçatan olması üçün qeydiyyatdan keçərək{"\n"}davam edə bilərsiniz 🥰
        </Text>
      </View>
      
      <View style={styles.footer}>
        <PrimaryButton
          title="Qeydiyyat"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.cta}
        />
        <View style={styles.footerRow}>
          <Text style={styles.footerMuted}>Hesabınız varsa </Text>
          <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
            <Text style={styles.footerLink}>Daxil olun</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  blurb: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 32,
  },
  footer: {
    width: '100%',
  },
  cta: {
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerMuted: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.link,
  },
});
