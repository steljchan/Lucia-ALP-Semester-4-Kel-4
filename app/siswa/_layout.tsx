import { Tabs } from 'expo-router';
import NavbarSiswa from '../../src/components/navigation/navbarSiswa';

export default function SiswaLayout() {
  return (
    <Tabs tabBar={(props) => <NavbarSiswa {...props} />}>
      <Tabs.Screen name="index" /> 
      <Tabs.Screen name="game/index" /> {/* Tambahkan /index jika di dalam folder ada file index.tsx */}
      <Tabs.Screen name="leaderboard/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}