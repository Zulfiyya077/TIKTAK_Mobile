import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '../../theme';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80';

type Props = {
  title: string;
  imageUri?: string | null;
};

export function CampaignBanner({ title, imageUri }: Props) {
  const uri = imageUri?.trim() || FALLBACK_IMG;

  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri }}
        style={styles.img}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View style={styles.textCol}>
        <Text style={styles.promoText}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.bannerPurple,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    minHeight: 118,
    marginBottom: layout.gap + 4,
  },
  img: {
    width: 130,
    minHeight: 118,
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  promoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    textTransform: 'uppercase',
  },
});
