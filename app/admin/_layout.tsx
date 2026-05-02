import { Tabs } from 'expo-router';
import NavbarAdmin from '../../src/components/navigation/navbarAdmin';

export default function AdminLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavbarAdmin {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* app/admin/index.tsx untuk dashboard admin */}
      <Tabs.Screen name="index" /> 
      
    </Tabs>
  );
}