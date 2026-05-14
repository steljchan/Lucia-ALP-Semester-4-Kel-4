import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, BORDER_RADIUS} from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import AppHeaderSimple from '@/src/components/common/headerAdmin';
import AssignPairModal from '@/src/components/modals/AssignPairModals';

export default function EditUser() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const role = params.role as string;

  const [name, setName] = useState(params.name as string || 'Nama User');
  const [editingName, setEditingName] = useState(false);

  const [nis, setNis] = useState(params.nis as string || '');
  const [kelas, setKelas] = useState('10A');
  const [showClass, setShowClass] = useState(false);

  const classOptions = ['10A', '10B', '11A'];
  const subjectOptions = ['Matematika', 'Fisika', 'Kimia'];

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

       <AppHeaderSimple title="Edit User" />

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

        {role === 'siswa' && (
          <View style={styles.card}>
            <Text style={styles.section}>Academic</Text>

            <EditableRow label="NIS" value={nis} onChange={setNis} />

            <TouchableOpacity onPress={() => setShowClass(!showClass)}>
              <Row
                label="Kelas"
                value={kelas}
                icon={showClass ? 'chevron-up' : 'chevron-down'}/>
            </TouchableOpacity>

            {showClass &&
              classOptions.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setKelas(c);
                    setShowClass(false);
                  }}>
                  <Text style={styles.dropdownItem}>{c}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {role === 'guru' && (
          <View style={styles.card}>
            <Text style={styles.section}>Teaching</Text>

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
                  <Ionicons name="close-circle" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={COLORS.primary}
              />

              <Text style={styles.addText}>Tambah Pair</Text>
            </TouchableOpacity>

          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>

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

function Row({ label, value, icon }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.value}>{value}</Text>
        {icon && (
          <Ionicons name={icon} size={16} color={COLORS.darkGray} style={{ marginLeft: 6 }} />
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


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: BORDER_RADIUS.s,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
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

  label: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: BORDER_RADIUS.s,
    padding: 8,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },

  pairCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor:COLORS.smoothBlue,
  },

  pairText: {
    fontWeight: '600',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
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
    borderRadius: BORDER_RADIUS.s,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});