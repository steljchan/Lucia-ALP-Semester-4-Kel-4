import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS } from '@/utils/theme';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

export default function DetailUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const role = params.role as string;
  const [openPairs, setOpenPairs] = useState(false);

  const [showModal, setShowModal] = useState(false);

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
        showsVerticalScrollIndicator={false}>

      <AppHeaderSimple
        title="Detail User"
        rightText="Edit"
        onRightPress={() => router.push('/admin/editUser')}
      />

        <View style={styles.card}>
          <Text style={styles.section}>Personal</Text>
          <Row label="Nama" value={role === 'guru' ? teacher.name : student.name} isFirst />
          <Row label="Email" value={role === 'guru' ? teacher.email : student.email} />

          {role === 'guru' && (
            <Row label="NIK" value={teacher.nik} />
          )}

          <Row label="Role" value={role} isLast />
        </View>

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

        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>
            <Row label="Wali Kelas" value={teacher.waliKelas} isFirst />

            <TouchableOpacity onPress={() => setOpenPairs(!openPairs)}>
              <Row
                label="Kelas & Subject"
                value="Lihat Detail"
                icon={openPairs ? "chevron-up" : "chevron-down"}/>
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

        <View style={styles.actions}>
          {role === 'guru' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.primaryButtonText}>
                Assign Kelas & Subject
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Hapus User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: BORDER_RADIUS.s,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 2,
  },

  section: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
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
    borderColor: COLORS.gray,
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
    color: COLORS.textSub,
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
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },

  pairText: {
    fontWeight: '600',
  },

  dropdown: {
    padding: 12,
    backgroundColor: COLORS.gray,
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

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.s,
    width: '100%',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.s,
    width: '100%',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 14,
  },
});