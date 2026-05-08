import React from 'react';
import NavbarBase from './navbarBase';

export const menuGuru = [
  { name: 'beranda', icon: 'home', label: 'Beranda' },
  { name: 'upload', icon: 'share', label: 'Upload' },
  { name: 'nilaiSiswa', icon: 'document-text', label: 'Nilai Siswa' },
  { name: 'profile', icon: 'person', label: 'Profil' },
];

export default function NavbarGuru(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuGuru} 
    />
  );
}