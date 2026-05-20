import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../utils/theme';

export default function SplashScreen() {
  const router = useRouter();
  
  //animasi masuk
  const progress = useRef(new Animated.Value(0)).current;
  
  //animasi fadeout
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const puddleScale = progress.interpolate({
    inputRange: [0, 0.3, 0.4],
    outputRange: [2, 0.5, 0], 
    extrapolate: 'clamp',
  });

  const mascotScale = progress.interpolate({
    inputRange: [0, 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const mascotTranslateX = progress.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  const textOpacity = progress.interpolate({
    inputRange: [0.7, 1],
    outputRange: [0, 1],
  });

  const textTranslateX = progress.interpolate({
    inputRange: [0.5, 1],
    outputRange: [30, 65],
  });


  useEffect(() => {
    Animated.sequence([
      //animasi portal
      Animated.timing(progress, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),

      // Logo besar ke kecil
      Animated.timing(progress, {
        toValue: 0.6,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(300),

      //logo dari kiri ke kanan + teks muncul
      Animated.timing(progress, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1000),

      //fadeout
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/auth/login');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wrapper, { opacity: fadeOutAnim }]}>
        
        
        <Animated.View style={[
          styles.puddle, 
          { transform: [{ scale: puddleScale }] }
        ]} />

       
        <Animated.View style={[styles.textContainer, { 
          opacity: textOpacity,
          transform: [{ translateX: textTranslateX }] 
        }]}>
          <Image 
            source={require('../../assets/images/textLucia.png')} 
            style={styles.textImage}
            resizeMode="contain"
          />
        </Animated.View>

        
        <Animated.View style={{ 
          transform: [
            { scale: mascotScale },
            { translateX: mascotTranslateX }
          ] 
        }}>
          <Image 
            source={require('../../assets/images/LogoLucia.png')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 160,
    height: 160,
    zIndex: 2, 
  },
  textContainer: {
    position: 'absolute',
    zIndex: 1, 
    marginLeft: 25, 
  },
  textImage: {
    width: 180,
    height: 80,
  },
  puddle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.smoothBlue, 
    zIndex: 0,
  },
});