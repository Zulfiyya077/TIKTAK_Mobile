import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MOCK_ORDERS = [
  { id: '321321', date: '10.09.2023', total: '35.00', address: 'Zərifə Əliyeva 55, Azər...', status: 'Çatdırıldı' },
  { id: '321322', date: '08.09.2023', total: '12.40', address: 'Xətai M. Bakı şəh.', status: 'Çatdırıldı' },
];

export function OrderHistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Sifariş tarixçəsi" />

      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={item => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.item}>
            <View style={styles.itemRow}>
               <Text style={styles.orderNo}>No #{item.id}</Text>
               <View style={styles.itemRight}>
                  <Text style={styles.address}>{item.address}</Text>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
               </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flatList: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  itemRight: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 10,
  },
  address: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
  },
});
