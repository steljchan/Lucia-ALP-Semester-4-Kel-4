import React from 'react';
import NavbarBase from './navbarBase';

const menuSiswa = [
  { name: 'beranda', icon: 'home', label: 'Beranda' },
  { name: 'game', icon: 'game-controller', label: 'Game' },
  { name: 'leaderboard', icon: 'trophy', label: 'Peringkat' },
  { name: 'profil', icon: 'person', label: 'Profil' },
];

export default function NavbarSiswa(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuSiswa} 
    />
  );
}