import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { Product } from '../../api/types';
import { colors } from '../../theme';

type Props = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
};

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80';

export function ProductDetailSheet({
  visible,
  product,
  onClose,
  onAddToCart,
}: Props) {
  const { height } = useWindowDimensions();

  if (!product) {
    return null;
  }

  const uri = product.img_url?.trim() ? product.img_url : PLACEHOLDER;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, { maxHeight: height * 0.8 }]}>
          <Pressable style={styles.sheetBody}>
            <View style={styles.handle} />
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.textMuted} />
            </Pressable>

            <ScrollView 
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.favoriteBtn}>
                   <MaterialIcons name="favorite-border" size={24} color={colors.textMuted} />
                </View>
              </View>

              <Image source={{ uri }} style={styles.img} resizeMode="contain" />

              <View style={styles.info}>
                <Text style={styles.title}>
                  {product.title} 1 {product.type}
                </Text>
                <Text style={styles.desc}>
                  Bu məhsul təzə və yüksək keyfiyyətli məhsuldur. Günlük olaraq təmin edilir və müştərilərimiz üçün ən yaxşı seçimdir.
                </Text>
                <Text style={styles.price}>{product.price} AZN</Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.btn,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onAddToCart(product.id)}>
                  <Text style={styles.btnText}>Səbətə əlavə et</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
  },
  sheetBody: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  sheetScroll: {
    width: '100%',
  },
  sheetScrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  favoriteBtn: {
    padding: 8,
  },
  img: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
  info: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 10,
  },
  btn: {
    backgroundColor: colors.primary,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
