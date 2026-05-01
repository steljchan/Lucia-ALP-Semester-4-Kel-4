import React from 'react';
import NavbarBase from './navbarBase';

const menuSiswa = [
  { name: 'index', icon: 'home', label: 'Beranda' },
  { name: 'game/index', icon: 'game-controller', label: 'Main' },
  { name: 'leaderboard/index', icon: 'trophy', label: 'Peringkat' },
  { name: 'profile/index', icon: 'person', label: 'Profil' },
];

export default function NavbarSiswa(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuSiswa} 
    />
  );
}