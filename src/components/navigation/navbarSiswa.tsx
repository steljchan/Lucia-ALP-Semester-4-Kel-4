import React from 'react';
import NavbarBase from './navbarBase';

export const menuSiswa = [
  { name: "beranda", label: "Beranda" },
  { name: "game", label: "Game" },
  { name: "leaderboard", label: "Leaderboard" },
  { name: "profil", label: "Profile" }, 
];

export default function NavbarSiswa(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuSiswa} 
    />
  );
}