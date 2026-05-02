import React from 'react';
import NavbarBase from './navbarBase';

const menuGuru = [
  { name: 'index', icon: 'home', label: 'Beranda' },
  { name: 'upload/index', icon: 'document-text', label: 'Upload' },
  { name: 'nilaiSiswa/index', icon: 'document-text', label: 'Nilai Siswa' },
  { name: 'profile/index', icon: 'person', label: 'Profil' },
];

export default function NavbarGuru(props: any) {
  return (
    <NavbarBase 
      {...props} 
      menuItems={menuGuru} 
    />
  );
}