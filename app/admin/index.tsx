import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS} from '@/utils/theme';

export default function AdminPanel() {
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    { id: 1, email: 'guru1@mail.com', role: 'guru' },
    { id: 2, email: 'siswa1@mail.com', role: 'siswa' },
    { id: 3, email: 'guru2@mail.com', role: 'guru' },
  ];

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((u) => u.role === roleFilter);

  const getRoleIcon = (role: string) => {
    return role === 'guru' ? 'school-outline' : 'person-outline';
  };

  const getRoleColor = (role: string) => {
    return role === 'guru' ? COLORS.primary : COLORS.success;
  };

  const handleAddUser = () => {
    console.log('Tambah user');
  };

  const handleEditUser = (id: number) => {
    console.log('Edit user', id);
  };

  const handleDeleteUser = (id: number) => {
    console.log('Hapus user', id);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white}/>
      <View style={styles.header}>
        <View style={styles.headerRow}>

          <View style={styles.leftSection}>
            <Image source={require('@/assets/images/lucia.png')} style={styles.iconImage}/>
          </View>

          <View style={styles.centerSection}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.subtitle}>User Management</Text>
          </View>

          <TouchableOpacity style={styles.rightIcon} onPress={() => console.log('logout')}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterChip, roleFilter === 'all' && styles.filterChipActive]} onPress={() => setRoleFilter('all')}>
          <Text style={[styles.filterText, roleFilter === 'all' && styles.filterTextActive]}>Semua</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.filterChip, roleFilter === 'guru' && styles.filterChipActive]} onPress={() => setRoleFilter('guru')}>
          <Ionicons
            name="school-outline"
            size={16}
            color={roleFilter === 'guru' ? COLORS.white : COLORS.textSub}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, roleFilter === 'guru' && styles.filterTextActive]}>Guru</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, roleFilter === 'siswa' && styles.filterChipActive]} onPress={() => setRoleFilter('siswa')}>
          <Ionicons
            name="person-outline"
            size={16}
            color={roleFilter === 'siswa' ? '#FFFFFF' : '#6B7280'}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, roleFilter === 'siswa' && styles.filterTextActive]}>Siswa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: `${getRoleColor(item.role)}20` },
                ]}
              >
                <Ionicons name={getRoleIcon(item.role)} size={28} color={getRoleColor(item.role)}/>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
                    {item.role === 'guru' ? 'Guru' : 'Siswa'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditUser(item.id)}
              >
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteUser(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 0,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },

  iconImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightSection: {
    width: 40, 
  },

  rightIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderColor: COLORS.red,
    borderWidth: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 2,
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    gap: 12,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 40,
    gap: 6,
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  filterIcon: {
    marginRight: 2,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },

  filterTextActive: {
    color: COLORS.white,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  userInfo: {
    flex: 1,
  },

  email: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.l,
  },

  roleText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
});