import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NavbarBase({ state, navigation, menuItems }: any) {
  const TAB_WIDTH = SCREEN_WIDTH / Math.max(menuItems.length, 1);
  const animatedX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
    const toValue = TAB_WIDTH * state.index + TAB_WIDTH / 2;

    Animated.spring(animatedX, {
        toValue,
        useNativeDriver: true, 
        friction: 8,
        tension: 60,
    }).start();
    }, [state.index]);
    
  const activeIndex = state.index;
    const [centerX, setCenterX] = React.useState(0);

        useEffect(() => {
        const id = animatedX.addListener(({ value }) => {
            setCenterX(value);
        });

        return () => {
            animatedX.removeListener(id);
        };
    }, []);
  
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
        <View style={StyleSheet.absoluteFill}>
          <Svg width={SCREEN_WIDTH} height={150}>
              <Path d={d} fill={COLORS.secondary} />
          </Svg>
        </View>

      <View style={styles.content}>
        {menuItems.map((route: any, index: number) => {
          const isFocused = state.index === index;
        
        if (!menuItems || !Array.isArray(menuItems)) {
            return null;
        }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
              activeOpacity={1}
            >

              <View style={[
                styles.iconContainer, 
                isFocused && styles.iconActive
              ]}>
                <Ionicons
                    name={isFocused ? route.icon : route.icon} 
                    size={26}
                    color={COLORS.white}
                    style={{ opacity: isFocused ? 1 : 0.5 }}
                />
              </View>

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
    height: 150,
    backgroundColor: 'transparent',
  },

  blueFiller: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: COLORS.secondary,
  },

  waveWrapper: {
    zIndex: 1,
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
    zIndex: 20,
  },

  iconActive: {
    backgroundColor: COLORS.secondary,
    marginTop: -10,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: COLORS.background,
  },

  infoContainer: {
    alignItems: 'center',
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});