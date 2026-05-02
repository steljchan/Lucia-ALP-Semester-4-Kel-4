import React from 'react';
import NavbarBase from './navbarBase';

const menuAdmin = [
  { name: 'index', icon: 'home', label: 'Beranda' },
];

export default function NavbarAdmin(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuAdmin} 
    />
  );
}