import React from 'react';
import NavbarBase from './navbarBase';

const menuSiswa = [
  { name: 'index', icon: 'home', label: 'Beranda' }, // Ini app/siswa/index.tsx
  { name: 'game', icon: 'game-controller', label: 'Main' }, // Ini app/siswa/game/index.tsx
  { name: 'leaderboard', icon: 'trophy', label: 'Peringkat' }, // Ini app/siswa/leaderboard/index.tsx
  { name: 'profile', icon: 'person', label: 'Profil' }, // Ini app/siswa/profile/index.tsx
];

export default function NavbarSiswa(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuSiswa} 
    />
  );
}