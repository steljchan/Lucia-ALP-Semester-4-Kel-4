import React, { useEffect, useState } from 'react';
import {ActivityIndicator, View, Text, ScrollView, TouchableOpacity,  StyleSheet, StatusBar, Image} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS} from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';
import { Ionicons } from '@expo/vector-icons';

//firebase
import { auth, db } from "../../../src/config/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

export default function SubMateri() {
  const router = useRouter();
  const { subjectId, subjectName } = useLocalSearchParams();

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectName || !subjectId) return;

      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;

        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const userClassId = userData.classId; 
          const userKelasName = userData.kelas; 

          if (!userClassId) {
            setLoading(false);
            return;
          }

          const q = query(
            collection(db, "material"),
            where("subjectId", "==", subjectName),
            where("classId", "in", [userClassId, userKelasName]) 
          );

          const querySnapshot = await getDocs(q);
          const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setMaterials(fetchedData);
        }
      } catch (error) {
        console.error("Error detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId, subjectName]);


  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
     
      <DetailHeader
        title="Materi Pembelajaran"
        subtitle={subjectName as string || "Materi"}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroSection}>
          <View style={styles.heroWrapper}>
            <Image
              source={
                subjectData?.imageUrl 
                  ? { uri: subjectData.imageUrl } 
                  : require('@/assets/images/materi/Matematika.png') 
              }
              style={styles.heroImage}
            />
            <Image
              source={require('../../../assets/images/ViboBuku.png')}
              style={styles.robot}
            />
          </View>
        </View>
        
        {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : materials.length === 0 ? (
            <Text style={{ textAlign: 'center', color: COLORS.textSub, marginTop: 20 }}>
              Belum ada materi untuk mata pelajaran ini.
            </Text>
          ) : (
            materials.map((item) => (
              <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/siswa/materi/detailMateri',
                    params: { materialId: item.id }
                  })}>

                  <Image 
                    source={{ uri: item.fileUrl || 'https://via.placeholder.com/150' }} 
                    style={styles.cardImage} 
                  />

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
              </TouchableOpacity>
            ))
          )}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  cardLeftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  scrollContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  heroWrapper: {
    position: 'relative',
    width: 240,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroImage: {
    width: 135,
    height: 135,
    borderRadius: 100,
  },

  robot: {
    position: 'absolute',
    width: 90,
    height: 90,
    resizeMode: 'contain',
    bottom: 0,
    right: 0,
  },

  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
    marginTop: -10,
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
    alignItems: 'center',
  },
  
  cardImage: {
    width: 119,
    height: 87,
    borderRadius: BORDER_RADIUS.s,
    marginRight: 12,
  },
  
  cardContent: {
    flex: 1
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: SPACING.xs,
  },

  cardDescription: {
    fontSize: 13,
    color: COLORS.textSub,
    marginBottom: SPACING.sm,
  },
});