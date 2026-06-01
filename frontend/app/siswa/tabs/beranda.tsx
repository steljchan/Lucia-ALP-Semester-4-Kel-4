import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '../../../src/components/common/appheader';
import LastSeenCard from '../../../src/components/dashboard/siswa/lastseencard';
import SubjectCard from '../../../src/components/dashboard/siswa/subjectcard';
import { scrollContent, COLORS } from '@/utils/theme';

// Firestore
import { db, auth } from '@/src/config/firebase'; 
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';

export default function DashboardSiswa() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<any>(null);
  const [search, setSearch] = useState('');


  useEffect(() => {
    const fetchUserAndSubjects = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) return;
        const userData = userDoc.data();
        const materialId = userData.lastSeenMaterialId;
        if (materialId) {
          const materialDoc = await getDoc(doc(db, "material", materialId));

          if (materialDoc.exists()) {
            setLastSeen({
              id: materialDoc.id,
              ...materialDoc.data()
            });
          }
}
        
        const userTingkat = userDoc.data().tingkat; 
        

       
        const q = query(
          collection(db, "subject"), 
          where("tingkat", "==", userTingkat)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSubjects(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubjects();
  }, []);

  const filteredSubjects = subjects.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <View style={styles.container}>
      <AppHeader
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollContent}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                marginTop: 30,
                color: COLORS.darkGray,
              }}
            >
              Mata pelajaran tidak ditemukan
            </Text>
          }
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>Terakhir Dilihat</Text>
              {lastSeen && (
                <LastSeenCard
                  title={lastSeen.title}
                  subtitle={lastSeen.subjectName || `Materi ${lastSeen.subjectId}`}
                  image={lastSeen.imageUrl ? { uri: lastSeen.imageUrl } : require('@/assets/images/materi/Matematika.png')}
                  onPress={() =>
                    router.push({
                      pathname: '/siswa/materi/detailMateri',
                      params: {
                        materialId: lastSeen.id,
                      },
                    })
                  }
                />
              )}
              <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
            </>
          }
          renderItem={({ item }) => (
            <SubjectCard
              title={item.name} 
              image={{ uri: item.imageUrl }} 
              onPress={() => router.push({
                pathname: '/siswa/materi/submateri',
                params: { subjectId: item.id, subjectName: item.name }
              })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.textMain,
  },

  grid: {
    justifyContent: 'space-between',
  },
});