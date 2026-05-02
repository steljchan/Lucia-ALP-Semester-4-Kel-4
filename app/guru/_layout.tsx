import { Tabs } from 'expo-router';
import NavbarGuru from '../../src/components/navigation/navbarGuru';

export default function GuruLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavbarGuru {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* app/guru/index.tsx untuk dashboard guru */}
      <Tabs.Screen name="index" /> 
      
      {/*app/guru/upload/index.tsx untuk upload*/}
      <Tabs.Screen name="upload/index" /> 
      
      {/* app/guru/nilaiSiswa/index.tsx untuk nilai siswa*/}
      <Tabs.Screen name="nilaiSiswa/index" />
      
      {/* app/guru/profile/index.tsx untuk profile*/}
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}