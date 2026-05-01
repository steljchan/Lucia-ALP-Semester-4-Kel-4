import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../../utils/theme';

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

  // Path SVG untuk lengkungan "lubang" di posisi menu aktif
  const d = `
    M 0 20 
    L ${TAB_WIDTH * 0.1} 20 
    C ${TAB_WIDTH * 0.25} 20 ${TAB_WIDTH * 0.2} 0 ${TAB_WIDTH * 0.5} 0 
    C ${TAB_WIDTH * 0.8} 0 ${TAB_WIDTH * 0.75} 20 ${TAB_WIDTH * 0.9} 20 
    L ${SCREEN_WIDTH} 20 
    L ${SCREEN_WIDTH} 100 
    L 0 100 
    Z
  `;

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Svg width={SCREEN_WIDTH} height={100}>
            <Path d={d} fill="#76CFFF" />
          </Svg>
        </Animated.View>
        <View style={[styles.bgSide, { left: -SCREEN_WIDTH }]} />
        <View style={[styles.bgSide, { right: -SCREEN_WIDTH }]} />
      </View>

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
              {/* Container Ikon */}
              <View style={[styles.iconContainer, isFocused && styles.iconActive]}>
                <Ionicons
                  name={isFocused ? route.icon : `${route.icon}-outline`}
                  size={24}
                  color="white"
                />
              </View>

                <View style={[
                    styles.infoContainer, 
                    { marginTop: isFocused ? 12 : -5 }
                    ]}>
                    <Text style={[styles.label, { opacity: isFocused ? 1 : 0.7 }]}>
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
    height: 100,
  },
  bgSide: {
    position: 'absolute',
    top: 20,
    width: SCREEN_WIDTH,
    height: 80,
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    height: '100%',
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
    marginTop: 15,
  },
  iconActive: {
    backgroundColor: COLORS.primary,
    marginTop: -15, 
    borderWidth: 4,
    borderColor: 'white', 
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 5, 
  },
  label: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});