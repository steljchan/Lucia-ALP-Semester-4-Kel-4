import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / 4;

export default function NavbarBase({ state, navigation, menuItems }: any) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: false,
      friction: 10,
      tension: 50,
    }).start();
  }, [state.index]);

  // buat navbar dengan gelombang yang bergerak mengikuti tab yang aktif
  const d = `
    M 0 30 
    L ${TAB_WIDTH * 0.15} 30 
    C ${TAB_WIDTH * 0.3} 30 ${TAB_WIDTH * 0.25} 0 ${TAB_WIDTH * 0.5} 0 
    C ${TAB_WIDTH * 0.75} 0 ${TAB_WIDTH * 0.7} 30 ${TAB_WIDTH * 0.85} 30 
    L ${SCREEN_WIDTH} 30 
    L ${SCREEN_WIDTH} 120 
    L 0 120 
    Z
  `;

  return (
    <View style={styles.container}>
      {/* Background Biru Full dengan Gelombang Bergerak */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Svg width={SCREEN_WIDTH * 2} height={120} style={{ marginLeft: -(TAB_WIDTH * 0) }}>
            <Path d={d} fill={COLORS.secondary} />
          </Svg>
        </Animated.View>
       
        <View style={styles.blueFiller} />
      </View>

      {/* Konten Menu */}
      <View style={styles.content}>
        {menuItems.map((route: any, index: number) => {
          const isFocused = state.index === index;
    
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
              activeOpacity={1}
            >
              {/* Ikon Container */}
              <View style={[
                styles.iconContainer, 
                isFocused && styles.iconActive
              ]}>
                <Ionicons
                    name={isFocused ? route.icon : `${route.icon}-outline`}
                    size={26}
                    color={COLORS.white}
                />
              </View>

              {/* Teks Label */}
              <View style={[styles.infoContainer, { marginTop: isFocused ? 10 : -5}]}>
                <Text style={[styles.label, { color: COLORS.white, opacity: isFocused ? 1 : 0.7 }]}>
                  {route.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: 120,
    backgroundColor: 'transparent',
  },
  blueFiller: {
    position: 'absolute',
    top: 30, 
    width: '100%',
    height: 120,
    backgroundColor: COLORS.secondary,
    zIndex: -1,
  },
  content: {
    flexDirection: 'row',
    height: '100%',
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  iconActive: {
    backgroundColor: COLORS.secondary, 
    marginTop: -10,
    borderWidth: 4,
    borderColor: COLORS.background,
    elevation: 4,
  },
  infoContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});