import React from 'react';
import NavbarBase from './navbarBase';

export const menuSiswa = [
  { name: "beranda", label: "Beranda", icon: "home" },
  { name: "game", label: "Game", icon: "game-controller" },
  { name: "leaderboard", label: "Leaderboard", icon: "trophy" },
  { name: "profil", label: "Profile", icon: "person" },
];

export default function NavbarSiswa(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuSiswa} 
    />
  );
}