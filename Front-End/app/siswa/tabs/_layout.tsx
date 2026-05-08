import { Tabs } from 'expo-router';
import NavbarBase from '../../../src/components/navigation/navbarBase'; 
import {menuSiswa} from '../../../src/components/navigation/navbarSiswa';

export default function TabLayout() {
  console.log(menuSiswa)
  return (
    <Tabs tabBar={(props) => <NavbarBase {...props} menuItems={menuSiswa} />}>
      <Tabs.Screen name="beranda" options={{ headerShown: false }} />
      <Tabs.Screen name="game" options={{ headerShown: false }} />
      <Tabs.Screen name="leaderboard" options={{ headerShown: false }} />
      <Tabs.Screen name="profil" options={{ headerShown: false }} />
    </Tabs>
  );
}