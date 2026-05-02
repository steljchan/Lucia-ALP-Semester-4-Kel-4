import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/utils/theme';

export default function NavbarBase({ state, navigation, menuItems }: any) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const TAB_COUNT = menuItems.length;
  const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

  // posisi tengah tab aktif
  const activeIndex = state.index;
  const centerX = TAB_WIDTH * activeIndex + TAB_WIDTH / 2;

  // SVG path dengan cekungan
  const d = `
    M 0 30
    L ${centerX - 40} 30

    C ${centerX - 25} 30, ${centerX - 25} 0, ${centerX} 0
    C ${centerX + 25} 0, ${centerX + 25} 30, ${centerX + 40} 30

    L ${SCREEN_WIDTH} 30
    L ${SCREEN_WIDTH} 150
    L 0 150
    Z
  `;

  return (
    <View style={styles.container}>

      {/* Background atas (abu-abu) */}
      <View style={styles.topBackground} />

      {/* SVG Navbar */}
      <Svg width={SCREEN_WIDTH} height={150} style={styles.svg}>
        <Path d={d} fill={COLORS.secondary} />
      </Svg>

      {/* Menu */}
      <View style={styles.content}>
        {menuItems.map((route: any, index: number) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
              activeOpacity={0.8}
            >

              {/* ICON */}
              <View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    position: 'absolute',
                    top: -25,
                    backgroundColor: COLORS.secondary,
                    borderWidth: 4,
                    borderColor: COLORS.background,
                  },
                ]}
              >
                <Ionicons
                  name={route.icon}
                  size={26}
                  color={COLORS.white}
                  style={{ opacity: isFocused ? 1 : 0.5 }}
                />
              </View>

              {/* LABEL */}
              <Text
                style={[
                  styles.label,
                  {
                    opacity: isFocused ? 1 : 0.6,
                    marginTop: isFocused ? 30 : 5,
                  },
                ]}
              >
                {route.label}
              </Text>
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
    width: '100%',
    height: 150,
  },

  topBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 30,
    backgroundColor: COLORS.background,
    zIndex: 1,
  },

  svg: {
    position: 'absolute',
    bottom: 0,
  },

  content: {
    flexDirection: 'row',
    height: '100%',
    zIndex: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});