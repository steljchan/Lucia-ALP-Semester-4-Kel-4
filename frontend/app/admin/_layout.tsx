import { Tabs } from 'expo-router';
import NavbarAdmin from '../../src/components/navigation/navbarAdmin';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const routeName = props.state.routeNames[props.state.index];

        if (
          routeName === 'addUser' ||
          routeName === 'editUser' ||
          routeName === 'detailUser'
        ) {
          return null;
        }

        return <NavbarAdmin {...props} />;
      }}
    >
      <Tabs.Screen name="index" />

      <Tabs.Screen name="addUser" />
      <Tabs.Screen name="editUser" />
      <Tabs.Screen name="detailUser" />
    </Tabs>
  );
}