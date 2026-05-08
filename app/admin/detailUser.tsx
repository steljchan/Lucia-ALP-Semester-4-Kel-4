import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/theme';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

export default function DetailUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const role = params.role as string;
  const [openPairs, setOpenPairs] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // 🔥 DATA
  const student = {
    name: 'Budi Santoso',
    email: 'budi@mail.com',
    nis: '12345',
    kelas: '10A',
    xp: 1200,
    totalQuiz: 15,
    avgScore: 85,
  };

  const [teacher, setTeacher] = useState({
    name: 'Pak Andi',
    email: 'andi@mail.com',
    nik: '1234567890',
    waliKelas: '10A',
    pairs: [
      { kelas: '10A', subject: 'Matematika' },
      { kelas: '11B', subject: 'Fisika' },
    ],
  });

  const classOptions = ['10A', '10B', '11A'];
  const subjectOptions = ['Matematika', 'Fisika', 'Kimia'];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔥 HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Detail User</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* 🔵 PERSONAL */}
        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>

          <Row label="Nama" value={role === 'guru' ? teacher.name : student.name} isFirst />
          <Row label="Email" value={role === 'guru' ? teacher.email : student.email} />

          {role === 'guru' && (
            <Row label="NIK" value={teacher.nik} />
          )}

          <Row label="Role" value={role} isLast />
        </View>

        {/* 🔵 SISWA */}
        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>

            <Row label="NIS" value={student.nis} isFirst />
            <Row label="Kelas" value={student.kelas} />
            <Row label="XP" value={student.xp.toString()} />
            <Row label="Total Quiz" value={student.totalQuiz.toString()} />
            <Row label="Rata-rata" value={student.avgScore.toString()} isLast />
          </View>
        )}

        {/* 🔵 GURU */}
        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>

            <Row label="Wali Kelas" value={teacher.waliKelas} isFirst />

            <TouchableOpacity onPress={() => setOpenPairs(!openPairs)}>
              <Row
                label="Kelas & Subject"
                value="Lihat Detail"
                icon={openPairs ? "chevron-up" : "chevron-down"}
              />
            </TouchableOpacity>

            {openPairs && (
              <View style={styles.dropdown}>
                {teacher.pairs.map((item, i) => (
                  <Text key={i} style={styles.dropdownItem}>
                    {item.kelas} - {item.subject}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 🔥 ACTION */}
        <View style={styles.actions}>

          <TouchableOpacity onPress={() => router.push('/admin/editUser')}>
            <Text style={styles.actionPrimary}>Edit User</Text>
          </TouchableOpacity>

          {role === 'guru' && (
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text style={styles.actionPrimary}>Assign Kelas & Subject</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity>
            <Text style={styles.actionDelete}>Hapus User</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* 🔥 MODAL REUSABLE */}
      <AssignPairModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        onSubmit={(data: any) => {
          setTeacher({
            ...teacher,
            pairs: [...teacher.pairs, data],
          });
        }}
      />

    </View>
  );
}

/* ---------- COMPONENT ---------- */

function Row({ label, value, icon, isFirst, isLast }: any) {
  return (
    <View
      style={[
        styles.row,
        isFirst && styles.rowTop,
        isLast && styles.rowBottom,
      ]}
    >
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

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
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

  rowTop: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  rowBottom: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },

  label: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  pairCard: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },

  pairText: {
    fontWeight: '600',
  },

  dropdown: {
    padding: 12,
    backgroundColor: '#F9FAFB',
  },

  dropdownItem: {
    fontSize: 13,
    marginBottom: 6,
  },

  actions: {
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'flex-start',
    gap: 14,
  },

  actionPrimary: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  actionDelete: {
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 40,
  },
});