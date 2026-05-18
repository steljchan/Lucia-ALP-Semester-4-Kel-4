import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/theme';

// firebase
import { db } from '@/src/config/firebase';
import { collection, getDocs, query, where} from 'firebase/firestore';

export default function AssignPairModal({ visible, onClose, onSubmit }: any) {
  const [loading, setLoading] = useState(true);
  const [selectedTingkat, setSelectedTingkat] = useState('SMP');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      
      const qClass = query(collection(db, "class"), where("tingkat", "==", selectedTingkat.toUpperCase()));
      const classSnap = await getDocs(qClass);
      const classList = classSnap.docs.map(doc => doc.data().kelas);
      setClasses(classList);
      setSelectedClass(classList[0] || '');

      const qSubject = query(collection(db, "subject"), where("tinkat", "==", selectedTingkat.toLowerCase()));
      const subjectSnap = await getDocs(qSubject);
      
    
      const subjectList = subjectSnap.docs.map(doc => doc.data().name); 
      setSubjects(subjectList);
      setSelectedSubject(subjectList[0] || '');

    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, selectedTingkat]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { maxHeight: '80%' }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back" size={20} color={COLORS.primary} /></TouchableOpacity>
            <Text style={styles.title}>Assign Pair</Text>
            <View style={{ width: 20 }} />
          </View>

          {/* Selector Tingkat */}
          <Text style={styles.label}>Tingkat</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
            {['SMP', 'SMA'].map((t) => (
              <TouchableOpacity 
                key={t} 
                style={[styles.item, selectedTingkat === t && styles.active, { flex: 1 }]}
                onPress={() => setSelectedTingkat(t)}
              >
                <Text style={[selectedTingkat === t && styles.activeText, { textAlign: 'center' }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Kelas</Text>
              {classes.map((c) => (
                <TouchableOpacity key={c} style={[styles.item, selectedClass === c && styles.active]} onPress={() => setSelectedClass(c)}>
                  <Text style={[selectedClass === c && styles.activeText]}>{c}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.label, { marginTop: 10 }]}>Subject</Text>
              {subjects.map((s) => (
                <TouchableOpacity key={s} style={[styles.item, selectedSubject === s && styles.active]} onPress={() => setSelectedSubject(s)}>
                  <Text style={[selectedSubject === s && styles.activeText]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={[styles.button, (loading || !selectedClass) && { opacity: 0.5 }]}
            disabled={loading || !selectedClass}
            onPress={() => {
              onSubmit({ tingkat: selectedTingkat, kelas: selectedClass, subject: selectedSubject });
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
    backgroundColor:  COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700' 
  },

  label: {
    marginTop: 10,
    fontSize: 12,
    color: '#9CA3AF'
  },

  item: {
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  active: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  activeText: {
    color: COLORS.white,
    fontWeight: '700',
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: COLORS.white,
    fontWeight: '700'
  },
});