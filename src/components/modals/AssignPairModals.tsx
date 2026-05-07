import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/theme';

export default function AssignPairModal({
  visible,
  onClose,
  onSubmit,
  classOptions,
  subjectOptions,
}: any) {
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.title}>Assign Pair</Text>

            <View style={{ width: 20 }} />
          </View>

          {/* CLASS */}
          <Text style={styles.label}>Kelas</Text>
          {classOptions.map((c: string) => {
            const active = selectedClass === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.item, active && styles.active]}
                onPress={() => setSelectedClass(c)}
              >
                <Text style={[active && styles.activeText]}>{c}</Text>
              </TouchableOpacity>
            );
          })}

          {/* SUBJECT */}
          <Text style={[styles.label, { marginTop: 10 }]}>Subject</Text>
          {subjectOptions.map((s: string) => {
            const active = selectedSubject === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.item, active && styles.active]}
                onPress={() => setSelectedSubject(s)}
              >
                <Text style={[active && styles.activeText]}>{s}</Text>
              </TouchableOpacity>
            );
          })}

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSubmit({ kelas: selectedClass, subject: selectedSubject });
              onClose();
            }}
          >
            <Text style={styles.btnText}>Tambah</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: '700' },
  label: { marginTop: 10, fontSize: 12, color: '#9CA3AF' },

  item: {
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  active: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});