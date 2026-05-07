import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';
import { useRouter } from 'expo-router';
import SearchBar from '../../src/components/common/searchbar';

export default function AdminPanel() {
  const router = useRouter();

  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const users = [
    { id: 1, email: 'guru1@mail.com', role: 'guru' },
    { id: 2, email: 'siswa1@mail.com', role: 'siswa' },
    { id: 3, email: 'guru2@mail.com', role: 'guru' },
  ];

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const getRoleIcon = (role: string) => {
    return role === 'guru' ? 'school-outline' : 'person-outline';
  };

  const getRoleColor = (role: string) => {
    return role === 'guru' ? COLORS.primary : COLORS.success;
  };

  const handleEditUser = (user: any) => {
    router.push({
      pathname: '/admin/editUser',
      params: user,
    });
  };

  const handleDetailUser = (user: any) => {
    router.push({
      pathname: '/admin/detailUser',
      params: user,
    });
  };

  const handleDeleteUser = (id: number) => {
    setSelectedUser(id);
    setShowDeleteModal(true);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftSection}>
            <Image
              source={require('@/assets/images/lucia.png')}
              style={styles.iconImage}
            />
          </View>

          <View style={styles.centerSection}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.subtitle}>User Management</Text>
          </View>

          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => console.log('logout')}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Cari user..."
        />
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        {['all', 'guru', 'siswa'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterChip,
              roleFilter === item && styles.filterChipActive,
            ]}
            onPress={() => setRoleFilter(item)}
          >
            {item !== 'all' && (
              <Ionicons
                name={item === 'guru' ? 'school-outline' : 'person-outline'}
                size={16}
                color={roleFilter === item ? COLORS.white : COLORS.textSub}
                style={styles.filterIcon}
              />
            )}
            <Text
              style={[
                styles.filterText,
                roleFilter === item && styles.filterTextActive,
              ]}
            >
              {item === 'all' ? 'Semua' : item === 'guru' ? 'Guru' : 'Siswa'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleDetailUser(item)}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: `${getRoleColor(item.role)}20` },
                ]}
              >
                <Ionicons
                  name={getRoleIcon(item.role)}
                  size={28}
                  color={getRoleColor(item.role)}
                />
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.roleBadge}>
                  <Text
                    style={[
                      styles.roleText,
                      { color: getRoleColor(item.role) },
                    ]}
                  >
                    {item.role === 'guru' ? 'Guru' : 'Siswa'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEditUser(item)}>
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* 🔥 MODAL DELETE */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Hapus User</Text>
            <Text style={styles.modalText}>
              Apakah kamu yakin ingin menghapus user ini?
            </Text>

            <View style={styles.modalActions}>

              {/* BATAL */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>

              {/* HAPUS */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  console.log('Deleted user', selectedUser);
                  setShowDeleteModal(false);
                }}
              >
                <Text style={styles.deleteText}>Hapus</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
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
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftSection: {
    width: 40,
  },

  iconImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  centerSection: {
    flex: 1,
    alignItems: 'center',
  },

  rightIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: COLORS.red,
    borderWidth: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  filterIcon: {
    marginRight: 4,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSub,
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
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardLeft: {
    flexDirection: 'row',
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
  },

  roleBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.l,
  },

  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },

  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 12,
  },

  actionButton: {
    padding: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },

  modalText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },

  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
});