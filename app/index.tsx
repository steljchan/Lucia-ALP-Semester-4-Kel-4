// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      {/* Loading sederhana sambil menunggu pindah halaman */}
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}