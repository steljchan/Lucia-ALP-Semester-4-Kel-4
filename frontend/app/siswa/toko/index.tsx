import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons} from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, scrollContent, containerHeader } from '@/utils/theme';
import PaymentModal from '@/src/components/toko/paymentModal';
import { ShopItem } from "@/src/types/shop";
import { getShopItems, checkLimitedPurchase } from "@/src/services/shopService";
import { getCurrentUserData } from "@/src/services/userService";
import { auth } from "@/src/config/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { User } from "@/src/types/user";

export default function TokoScreen() {
  const [coinBalance, setCoinBalance] = useState(0);
  const [heartBalance, setHeartBalance] = useState(0);
  const [isLimitedPurchased, setIsLimitedPurchased] = useState(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);

  const activeItems = shopItems.filter(
    item => item.active
  );

  const coinPackages = activeItems.filter(
    item => item.type === "coin"
  );

  const heartPackages = activeItems.filter(
    item => item.type === "heart"
  );

  const limitedPackage = activeItems.find(
    item => item.type === "limited"
  );

  useEffect(() => {
    let mounted = true;
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          try {
            if (!user) {
              router.replace("/auth/login");
              return;
            }
            if (mounted) {
              await loadData();
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

    return () => {
      mounted = false;
      unsubscribe();
    };

  }, []);

  const loadData = async () => {

    try {

      const user =
        await getCurrentUserData();

      setCoinBalance(
        user.coin || 0
      );

      setHeartBalance(
        user.heart || 0
      );

      const items: ShopItem[] = await getShopItems();

      setShopItems(items);
      setUserData(user);

      const limitedItem = items.find(
        (item) => item.type === "limited"
      );

      if (
        limitedItem &&
        auth.currentUser
      ) {

        const purchased =
          await checkLimitedPurchase(

            auth.currentUser.uid,

            limitedItem.id
          );

        setIsLimitedPurchased(
          purchased
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  const handlePurchase = (
    item: ShopItem
  ) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleLimitedPurchase = () => {
    if (!limitedPackage) return;
    setSelectedItem(limitedPackage);
    setModalVisible(true);
  };

  return (
     <View style={[containerHeader, {  alignItems: 'stretch' }]}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[scrollContent, { paddingTop: 20, paddingBottom: 20 }]}>
        
        {limitedPackage && (
            <View style={styles.limitedCard}>
              <Text style={styles.limitedTitle}>PAKET TERBATAS</Text>

              <Text style={styles.limitedSubtitle}>
                {limitedPackage.name}
              </Text>

              <View style={styles.limitedRewardsRow}>
                <View style={styles.rewardCard}>
                  <Text style={{ fontSize: 24 }}>🪙</Text>
                  <Text style={styles.rewardLabel}>KOIN</Text>
                  <Text style={styles.rewardText}>
                    x{limitedPackage.coin ?? 0}
                  </Text>
                </View>

                <View style={styles.rewardCard}>
                  <Text style={{ fontSize: 24 }}>❤️</Text>
                  <Text style={styles.rewardLabel}>HATI</Text>
                  <Text style={styles.rewardText}>
                    x{limitedPackage.heart ?? 0}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.buyButton,
                  isLimitedPurchased && styles.disabledButton
                ]}
                onPress={handleLimitedPurchase}
                disabled={isLimitedPurchased}
              >
                <Text style={styles.buyButtonText}>
                  {isLimitedPurchased
                    ? "TERBELI"
                    : `Rp ${Number(
                        limitedPackage.price
                      ).toLocaleString("id-ID")}`}
                </Text>
              </TouchableOpacity>

              <Text style={styles.limitedNote}>
                Hanya boleh 1 kali pembelian
              </Text>
            </View>
          )}

          <View style={styles.sectionDivider}>
            <View style={styles.line} />
            <Text style={styles.sectionText}>KOIN</Text>
            <View style={styles.line} />
          </View>

          {coinPackages.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              <Text style={styles.packageIcon}>🪙</Text>

              <Text style={styles.packageName}>
                {pkg.name.toUpperCase()}
              </Text>

              <View style={styles.packageRight}>
                <Text style={styles.packageAmountCoin}>
                  x{pkg.coin}
                </Text>

                <TouchableOpacity
                  style={styles.smallBuyButton}
                  onPress={() => handlePurchase(pkg)}
                >
                  <Text style={styles.smallBuyText}>
                    Rp {Number(pkg.price).toLocaleString("id-ID")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.sectionDivider}>
            <View style={styles.line} />
            <Text style={styles.sectionText}>HATI</Text>
            <View style={styles.line} />
          </View>

          {heartPackages.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              <Text style={styles.packageIcon}>❤️</Text>

              <Text style={styles.packageName}>
                {pkg.name.toUpperCase()}
              </Text>

              <View style={styles.packageRight}>
                <Text style={styles.packageAmountHeart}>
                  x{pkg.heart}
                </Text>

                <TouchableOpacity
                  style={styles.smallBuyButton}
                  onPress={() => handlePurchase(pkg)}
                >
                  <Text style={styles.smallBuyText}>
                    Rp {Number(pkg.price).toLocaleString("id-ID")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        <View/>
      </ScrollView>

      <PaymentModal 
        isVisible={modalVisible}
        selectedItem={selectedItem}
        userData={userData}
        onClose={() => setModalVisible(false)}
        onSuccess={loadData}
      />
    </View >
  );
};

const styles = StyleSheet.create({
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
    shadowColor: COLORS.black,
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },

  limitedCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
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
    shadowColor: COLORS.black,
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
    shadowColor: COLORS.black,
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
    color: COLORS.error,
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