import { Tabs } from 'expo-router';
import NavbarSiswa from '@/src/components/navigation/navbarSiswa';

export default function SiswaLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavbarSiswa {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* app/siswa/index.tsx untuk dashboard siswa */}
      <Tabs.Screen name="beranda" /> 
      
      {/*app/siswa/game/index.tsx untuk game*/}
      <Tabs.Screen name="game" /> 
      
      {/* app/siswa/leaderboard/index.tsx untuk leaderboard*/}
      <Tabs.Screen name="leaderboard" />
      
      {/* app/siswa/profile/index.tsx untuk profile*/}
      <Tabs.Screen name="profil" />
    </Tabs>
  );
}