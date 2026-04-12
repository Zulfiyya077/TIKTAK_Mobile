import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchBasket } from '../../api/basket';
import type { BasketData } from '../../api/types';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import { colors } from '../../theme';

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [basket, setBasket] = useState<BasketData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBasket = useCallback(async () => {
    try {
      const b = await fetchBasket();
      setBasket(b);
    } catch {
      Alert.alert('Xəta', 'Səbət məlumatları yüklənmədi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  const handleComplete = () => {
    Alert.alert(
      'Sifariş tamamlandı',
      'Sifarişiniz uğurla qəbul edildi. Tezliklə sizinlə əlaqə saxlanılacaq.',
      [{ text: 'OK', onPress: () => navigation.navigate('OrderSuccess') }]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Sifarişi tamamla" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Adınız</Text>
            <TextInput style={styles.input} placeholder="Sərxan Rəhimli" />

            <Text style={styles.label}>Unvanınız</Text>
            <TextInput style={styles.input} placeholder="Xətai M. Bakı şəh." />

            <Text style={styles.label}>Telefon</Text>
            <TextInput style={styles.input} placeholder="+994 10 310 38 97" />

            <Text style={styles.label}>Əlavə qeydiniz</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder=""
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.paymentSection}>
            <Pressable
              style={styles.radioRow}
              onPress={() => setPaymentMethod('cash')}>
              <MaterialIcons
                name={paymentMethod === 'cash' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={24}
                color={paymentMethod === 'cash' ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.radioText, paymentMethod === 'cash' && styles.radioActive]}>
                Qapıda nağd
              </Text>
            </Pressable>

            <Pressable
              style={styles.radioRow}
              onPress={() => setPaymentMethod('card')}>
              <MaterialIcons
                name={paymentMethod === 'card' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={24}
                color={paymentMethod === 'card' ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.radioText, paymentMethod === 'card' && styles.radioActive]}>
                Qapıda kart
              </Text>
            </Pressable>
          </View>

          <View style={styles.orderSummary}>
            {basket?.items.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemText}>
                  {item.quantity} x {item.product.title} 1 {item.product.type}
                </Text>
                <Text style={styles.summaryItemPrice}>{item.total_price} AZN</Text>
              </View>
            ))}
            {(!basket || basket.items.length === 0) && !loading && (
              <Text style={styles.summaryItemText}>Səbət boşdur</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.footerLabel}>Ümumi: {basket?.total || '0.00'} AZN</Text>
          <Text style={styles.totalLabel}>Yekun məbləğ:</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.footerLabel}>Çatdırılma: Pulsuz</Text>
          <Text style={styles.totalValue}>{basket?.total || '0.00'} AZN</Text>
        </View>
        <Pressable
          style={styles.orderBtn}
          onPress={handleComplete}
          disabled={!basket || basket.items.length === 0}>
          <Text style={styles.orderBtnText}>Sifarişi tamamla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kav: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  form: {
    gap: 15,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: -8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentSection: {
    marginBottom: 30,
    gap: 15,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  radioActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  orderSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItemText: {
    fontSize: 14,
    color: colors.text,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  footerLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  orderBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
