import { Tabs } from 'expo-router';
import NavbarBase from '../../../src/components/navigation/navbarBase'; 
import {menuGuru} from '../../../src/components/navigation/navbarGuru';

export default function TabLayout() {
  console.log(menuGuru)
  return (
    <Tabs tabBar={(props) => <NavbarBase {...props} menuItems={menuGuru} />}>
      <Tabs.Screen name="beranda" options={{ headerShown: false }} />
      <Tabs.Screen name="upload" options={{ headerShown: false }} />
      <Tabs.Screen name="nilaiSiswa" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
