import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BTN } from '@/utils/theme';
import { db } from "@/src/config/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

interface ClassSelectorProps {
  selectedTingkat: 'SMP' | 'SMA';
  onTingkatChange: (tingkat: 'SMP' | 'SMA') => void;
  selectedKelas: string;
  onClassSelect: (kelas: string, classId: string) => void;
}

export default function ClassSelector({ 
  selectedTingkat, 
  onTingkatChange, 
  selectedKelas, 
  onClassSelect 
}: ClassSelectorProps) {
  
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddingNewClass, setIsAddingNewClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // 1. Ambil Data Master Kelas
  const fetchClasses = async () => {
    try {
      const classSnap = await getDocs(collection(db, "class"));
      setAllClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Gagal ambil data master:", error);
    }
  };

  useEffect(() => { fetchClasses(); }, []);
  const validateClassName = (name: string, level: 'SMP' | 'SMA') => {
    const classRegex = /^(\d+)([a-zA-Z])$/; 
    const match = name.match(classRegex);
    if (!match) return "Format salah! Harus angka + 1 huruf (contoh: 7A, 10B)";
    const gradeNumber = parseInt(match[1]);
    if (level === 'SMP' && (gradeNumber < 7 || gradeNumber > 9)) return "SMP: Kelas 7, 8, atau 9!";
    if (level === 'SMA' && (gradeNumber < 10 || gradeNumber > 12)) return "SMA: Kelas 10, 11, atau 12!";
    return null; 
  };
  
  const handleAddNewClass = async () => {
    const error = validateClassName(newClassName, selectedTingkat);
    if (error) { Alert.alert("Input Tidak Valid", error); return; }

    try {
      const classRef = collection(db, "class");
      const newDocRef = doc(classRef);
      await setDoc(newDocRef, { kelas: newClassName.toUpperCase(), tingkat: selectedTingkat });
      
      Alert.alert("Berhasil", `Kelas ${newClassName.toUpperCase()} ditambahkan!`);
      await fetchClasses();
      onClassSelect(newClassName.toUpperCase(), newDocRef.id);
      setIsAddingNewClass(false);
      setNewClassName('');
      setShowDropdown(false);
    } catch (e) { Alert.alert("Error", "Gagal menyimpan kelas."); }
  };

  return (
    <View>
      <Text style={styles.label}>Tingkat</Text>
      <View style={styles.roleContainer}>
        {['SMP', 'SMA'].map((t: any) => (
          <TouchableOpacity 
            key={t} 
            style={[styles.roleButton, selectedTingkat === t && styles.roleActive]} 
            onPress={() => { onTingkatChange(t); onClassSelect('', ''); }}
          >
            <Text style={[styles.roleText, selectedTingkat === t && { color: COLORS.white }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Kelas</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDropdown(!showDropdown)}>
        <Text style={{ color: selectedKelas ? COLORS.textMain : COLORS.darkGray }}>
          {selectedKelas || "Pilih Kelas"}
        </Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownBox}>
          {allClasses
            .filter(c => c.tingkat === selectedTingkat)
            .map((c, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.dropdownItem} 
                onPress={() => { onClassSelect(c.kelas, c.id); setShowDropdown(false); }}
              >
                <Text>{c.kelas}</Text>
              </TouchableOpacity>
            ))}

          {isAddingNewClass ? (
            <View style={{ padding: 10, backgroundColor: COLORS.background }}>
              <TextInput 
                placeholder="Ketik Kelas (Contoh: 7A)" 
                value={newClassName} 
                onChangeText={setNewClassName}
                autoCapitalize="characters"
                style={[styles.input, { marginBottom: 8 }]}
              />
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity style={[BTN.primary.box, { flex: 1, padding: 8 }]} onPress={handleAddNewClass}>
                  <Text style={BTN.primary.text}>Simpan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ flex: 1, backgroundColor: COLORS.darkGray, padding: 8, borderRadius: 10, alignItems: 'center' }} 
                  onPress={() => setIsAddingNewClass(false)}
                >
                  <Text style={BTN.primary.text}>Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.dropdownItem, { backgroundColor: COLORS.background, flexDirection: 'row', alignItems: 'center' }]} 
              onPress={() => setIsAddingNewClass(true)}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginLeft: 8 }}>Tambah Kelas {selectedTingkat} Baru</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    label: { 
        fontSize: 13, 
        fontWeight: '600', 
        marginBottom: 6, 
        color: COLORS.textMain 
    },
    input: { 
        borderWidth: 1, 
        borderColor: COLORS.smoothBlue, 
        borderRadius: 10, 
        padding: 12, 
        marginBottom: 14 
    },
    roleContainer: { 
        flexDirection: 'row', 
        gap: 10, 
        marginBottom: 14 
    },
    roleButton: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: COLORS.primary 
    },
    roleActive: { 
        backgroundColor: COLORS.primary 
    },
    roleText: { 
        fontWeight: '600', 
        color: COLORS.primary 
    },
    dropdownBox: { 
        borderWidth: 1, 
        borderColor: COLORS.smoothBlue, 
        borderRadius: 10, 
        marginTop: -10, 
        marginBottom: 14, 
        backgroundColor: COLORS.background 
    },
    dropdownItem: { 
        padding: 12,
        borderBottomWidth: 1, 
        borderBottomColor: '#EDF2F7' 
    },
});