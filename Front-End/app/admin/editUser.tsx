import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

export default function EditUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const role = params.role as string;

  // 🔥 COMMON
  const [name, setName] = useState(params.name as string || 'Nama User');
  const [editingName, setEditingName] = useState(false);

  // 🔥 STUDENT
  const [nis, setNis] = useState(params.nis as string || '');
  const [kelas, setKelas] = useState('10A');
  const [showClass, setShowClass] = useState(false);

  // 🔥 OPTIONS
  const classOptions = ['10A', '10B', '11A'];
  const subjectOptions = ['Matematika', 'Fisika', 'Kimia'];

  // 🔥 TEACHER
  const [waliKelas, setWaliKelas] = useState('None');
  const [showWali, setShowWali] = useState(false);

  const [pairs, setPairs] = useState([
    { kelas: '10A', subject: 'Matematika' },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    console.log({
      name,
      nis,
      kelas,
      waliKelas,
      pairs,
    });
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        {/* 🔥 HEADER (SAMA DENGAN DETAIL) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit User</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* 🔵 PERSONAL */}
        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>

          {!editingName ? (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Row label="Nama" value={name} icon="create-outline" />
            </TouchableOpacity>
          ) : (
            <EditableRow label="Nama" value={name} onChange={setName} />
          )}

          <Row label="Role" value={role} />
        </View>

        {/* 🔵 SISWA */}
        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>

            <EditableRow label="NIS" value={nis} onChange={setNis} />

            <TouchableOpacity onPress={() => setShowClass(!showClass)}>
              <Row
                label="Kelas"
                value={kelas}
                icon={showClass ? 'chevron-up' : 'chevron-down'}
              />
            </TouchableOpacity>

            {showClass &&
              classOptions.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setKelas(c);
                    setShowClass(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{c}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* 🔵 GURU */}
        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>

            {/* WALI KELAS */}
            <TouchableOpacity onPress={() => setShowWali(!showWali)}>
              <Row
                label="Wali Kelas"
                value={waliKelas}
                icon={showWali ? 'chevron-up' : 'chevron-down'}
              />
            </TouchableOpacity>

            {showWali &&
              ['None', ...classOptions].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setWaliKelas(c);
                    setShowWali(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{c}</Text>
                </TouchableOpacity>
              ))}

            {/* PAIRS */}
            <Text style={styles.subTitle}>Kelas & Subject</Text>

            {pairs.map((p, i) => (
              <View key={i} style={styles.pairCard}>
                <Text style={styles.pairText}>
                  {p.kelas} - {p.subject}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setPairs(pairs.filter((_, index) => index !== i))
                  }
                >
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text style={styles.addText}>+ Tambah Pair</Text>
            </TouchableOpacity>

          </View>
        )}

        {/* 🔥 SAVE */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🔥 MODAL REUSABLE */}
      <AssignPairModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        onSubmit={(data: any) => {
          setPairs([...pairs, data]);
        }}
      />
    </View>
  );
}

/* ---------- COMPONENT ---------- */

function Row({ label, value, icon }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.value}>{value}</Text>
        {icon && (
          <Ionicons name={icon} size={16} color="#9CA3AF" style={{ marginLeft: 6 }} />
        )}
      </View>
    </View>
  );
}

function EditableRow({ label, value, onChange }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.input} />
    </View>
  );
}

/* ---------- STYLE ---------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    marginTop: 60,
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },

  section: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    padding: 12,
    fontWeight: '700',
  },

  subTitle: {
    marginTop: 10,
    marginLeft: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  row: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  label: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  pairCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  pairText: {
    fontWeight: '600',
  },

  addText: {
    margin: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },

  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});