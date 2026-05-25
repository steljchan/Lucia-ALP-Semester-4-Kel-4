import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BTN } from '@/utils/theme';
import ClassSelector from '@/src/components/common/admin/classSelector';
import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AssignPairModal({ visible, onClose, onSubmit }: any) {
  const [tingkat, setTingkat] = useState<'SMP' | 'SMA'>('SMP');
  const [kelas, setKelas] = useState('');
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [allSubjects, setAllSubjects] = useState<any[]>([]);

  // Ambil data mapel dari firestore
  useEffect(() => {
    const fetchSubjects = async () => {
      const snap = await getDocs(collection(db, "subject"));
      setAllSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    if (visible) fetchSubjects();
  }, [visible]);

  const handleAdd = () => {
    if (!kelas || !subject) return;
    onSubmit({ tingkat, kelas, classId, subject });
    // Reset setelah submit
    setKelas('');
    setSubject('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Kelas & Mapel</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {/* Pakai ClassSelector yang sama dengan AddUser */}
            <ClassSelector 
              selectedTingkat={tingkat}
              onTingkatChange={(t) => { setTingkat(t); setKelas(''); }}
              selectedKelas={kelas}
              onClassSelect={(name, id) => {
                setKelas(name);
                setClassId(id);
              }}
            />

            <Text style={[styles.label, { marginTop: 15 }]}>Pilih Mata Pelajaran</Text>
            <View style={styles.subjectContainer}>
              {allSubjects
                .filter(s => s.tingkat === tingkat)
                .map((s) => (
                  <TouchableOpacity 
                    key={s.id} 
                    style={[styles.subjectBtn, subject === s.name && styles.subjectActive]}
                    onPress={() => setSubject(s.name)}
                  >
                    <Text style={[styles.subjectText, subject === s.name && { color: 'white' }]}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[BTN.primary.box, { marginTop: 20, opacity: (kelas && subject) ? 1 : 0.5 }]} 
            onPress={handleAdd}
            disabled={!kelas || !subject}
          >
            <Text style={BTN.primary.text}>Tambahkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  modalContainer: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20 
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },

  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textMain 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: COLORS.darkGray 
  },

  subjectContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  subjectBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: COLORS.white, 
    borderWidth: 1, 
    borderColor: COLORS.primary 
  },
  subjectActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  subjectText: { 
    fontSize: 12, 
    color: COLORS.primary,
    fontWeight: '500' 
  }
});