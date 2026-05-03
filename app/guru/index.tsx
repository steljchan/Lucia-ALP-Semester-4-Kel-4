import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return; // tunggu router siap

    router.replace('/guru/beranda');
  }, [rootNavigationState]);

  return <View />;
}