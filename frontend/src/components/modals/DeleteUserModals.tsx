import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '@/utils/theme';
import { useRouter } from 'expo-router';

// firebase
import { db } from '@/src/config/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function DeleteUserModal({
  visible,
  onClose,
  userId, 
  onConfirm, 
}: any) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      
      onClose(); 
      if (onConfirm) onConfirm(); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal menghapus user");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Hapus User</Text>
          <Text style={styles.text}>
            Apakah kamu yakin ingin menghapus user ini? Data yang dihapus tidak dapat dikembalikan.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },

  text: {
    fontSize: 13,
    color: COLORS.textMain,
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    alignItems: 'center',
  },

  cancelBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  cancelText: {
    color: COLORS.white,
    fontWeight: '700',
  },

  deleteBtn: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  deleteText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});