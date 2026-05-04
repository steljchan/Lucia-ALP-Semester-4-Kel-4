import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, MARGIN_HORIZONTAL, title, caption } from '@/utils/theme';

export default function TokoScreen() {
  const [coinBalance, setCoinBalance] = useState(1200);
  const [heartBalance, setHeartBalance] = useState(5);
  const [isLimitedPurchased, setIsLimitedPurchased] = useState(false);

  const coinPackages = [
  {
    id: 1,
    name: 'Paket Koin Kecil',
    coin: 100,
    price: 10000,
  },
  {
    id: 2,
    name: 'Paket Koin Besar',
    coin: 500,
    price: 45000,
  },
];
  
  const heartPackages = [
  {
    id: 1,
    name: 'Paket Hati Kecil',
    heart: 10,
    price: 5000,
    isUnlimited: false,
  },
  {
    id: 2,
    name: 'Hati Tak Terbatas',
    heart: 50,
    price: 20000,
    isUnlimited: false,
  },
];

  const handlePurchase = (item: any, type: 'coin' | 'heart') => {
    const { coin = 0, heart = 0, price, name } = item;
    Alert.alert(
      'Konfirmasi Pembelian',
      `Beli ${name} seharga Rp${price.toLocaleString()}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Beli',
          onPress: () => {
            setCoinBalance(prev => prev + coin);
            setHeartBalance(prev => prev + heart);
            Alert.alert('Berhasil!', `${name} telah ditambahkan ke akun Anda.`);
          },
        },
      ]
    );
  };

  const handleLimitedPurchase = () => {
    if (isLimitedPurchased) {
      Alert.alert('Maaf', 'Paket terbatas hanya bisa dibeli 1 kali.');
      return;
    }
    Alert.alert(
      'Konfirmasi Paket Terbatas',
      'Beli PAKET COIN DAN HATI (500 Koin + 30 Hati) seharga Rp15.000? Hanya boleh 1 kali.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Beli',
          onPress: () => {
            setCoinBalance(prev => prev + 500);
            setHeartBalance(prev => prev + 30);
            setIsLimitedPurchased(true);
            Alert.alert('Berhasil!', 'Paket terbatas telah dibeli.');
          },
        },
      ]
    );
  };

  return (
     <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      
      <LinearGradient colors={['#EBF7FF', '#C9EAFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={28} color={COLORS.textMain} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Toko</Text>
            <View style={{ width: 40 }} />
        </View>
        <View style={styles.balanceWrapper}>
            <View style={styles.balanceCardSmall}>
                <Text style={{ fontSize: 14 }}>🪙</Text>
                <Text style={styles.balanceText}>{coinBalance}</Text>
            </View>

            <View style={styles.balanceCardSmall}>
                <Text style={{ fontSize: 14 }}>❤️</Text>
                <Text style={styles.balanceText}>{heartBalance}</Text>
            </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.limitedCard}>
          <Text style={styles.limitedTitle}>PAKET TERBATAS</Text>
          <Text style={styles.limitedSubtitle}>PAKET COIN DAN HATI</Text>
          
          <View style={styles.limitedRewardsRow}>
            <View style={styles.rewardCard}>
                <Text style={{ fontSize: 24 }}>🪙</Text>
                <Text style={styles.rewardLabel}>KOIN</Text>
                <Text style={styles.rewardText}>x500</Text>
            </View>

            <View style={styles.rewardCard}>
                <Text style={{ fontSize: 24 }}>❤️</Text>
                <Text style={styles.rewardLabel}>HATI</Text>
                <Text style={styles.rewardText}>x30</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.buyButton, isLimitedPurchased && styles.disabledButton]}
            onPress={handleLimitedPurchase}
            disabled={isLimitedPurchased}
          >
           <Text style={styles.buyButtonText}>
            {isLimitedPurchased
              ? 'TERBELI'
              : `Rp ${Number(15000).toLocaleString('id-ID')}`}
          </Text>
          </TouchableOpacity>
          <Text style={styles.limitedNote}>Hanya boleh 1 kali pembelian</Text>
        </View>

        <View style={styles.sectionDivider}>
            <View style={styles.line} />
            <Text style={styles.sectionText}>KOIN</Text>
            <View style={styles.line} />
        </View>
        
        {coinPackages.map(pkg => (
          <View key={pkg.id} style={styles.packageCard}>
            <Text style={styles.packageIcon}>🪙</Text>        
            <Text style={styles.packageName}>{pkg.name.toUpperCase()}</Text>
            <View style={styles.packageRight}>
              <Text style={styles.packageAmountCoin}>x{pkg.coin}</Text>
              <TouchableOpacity style={styles.smallBuyButton} onPress={() => handlePurchase(pkg, 'coin')}>
                <Text style={styles.smallBuyText}> Rp {Number(pkg.price ?? 0).toLocaleString('id-ID')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.sectionDivider}>
            <View style={styles.line} />
            <Text style={styles.sectionText}>Hati</Text>
            <View style={styles.line} />
        </View>
        
        {heartPackages.map(pkg => (
          <View key={pkg.id} style={styles.packageCard}>
            <Text style={styles.packageIcon}>❤️</Text>
            <Text style={styles.packageName}>{pkg.name.toUpperCase()}</Text>
            <View style={styles.packageRight}>
                <Text style={styles.packageAmountHeart}>{pkg.isUnlimited ? '∞' : `x${pkg.heart}`}</Text>
                <TouchableOpacity style={styles.smallBuyButton} onPress={() => handlePurchase(pkg, 'heart')}>
                <Text style={styles.smallBuyText}>Rp {Number(pkg.price ?? 0).toLocaleString('id-ID')}</Text>
                </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  balanceWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    flexDirection: 'row',
  },
  
  balanceCardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginLeft: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  
  balanceText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  scrollContainer: {
    paddingTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  limitedCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
  },

  limitedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },

  limitedSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.yellow,
    marginBottom: SPACING.md,
  },
  
  limitedRewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '100%',
    marginBottom: SPACING.md,
  },

  rewardCard: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  
  rewardItem: {
    alignItems: 'center',
  },
  
  rewardLabel: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: 'bold',
  },
  
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 2,
  },

  limitedNote: {
    fontSize: 12,
    color: COLORS.error,
    marginBottom: SPACING.md,
    marginTop: 8,
  },

  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.s,
    width: '70%',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: COLORS.gray,
  },

  buyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },

  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMain,
  },
  
  sectionText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    color: COLORS.textMain,
  },

  packageCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  packageIcon: {
    fontSize: 28,
    marginRight: 10,
  },

  packageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  
  },

  packageRight: {
    alignItems: 'flex-end',
  },
  
  packageAmountCoin: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.yellow,
  },

  packageAmountHeart: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.red,
    marginBottom: 4,
  },

  smallBuyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.s,
  },

  smallBuyText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
});