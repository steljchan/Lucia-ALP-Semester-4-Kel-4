import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useRouter} from 'expo-router';
import AppHeader from '../../../src/components/common/appheader';
import LastSeenCard from '../../../src/components/dashboard/siswa/lastseencard';
import SubjectCard from '../../../src/components/dashboard/siswa/subjectcard';
import {scrollContent, COLORS} from '@/utils/theme';

export default function DashboardSiswa() {

  const router = useRouter();

  const subjects = [
    { id: '1', title: "Matematika", image: require('@/assets/images/materi/Matematika.png')},
    { id: '2', title: "PKN", image: require('@/assets/images/materi/PKN.png') },
    { id: '3', title: "Bahasa Indonesia", image: require('@/assets/images/materi/Indonesia.png') },
    { id: '4', title: "IPA", image: require('@/assets/images/materi/IPA.png') },
    { id: '5', title: "Bahasa Inggris", image: require('@/assets/images/materi/Inggris.png')},
    { id: '6', title: "IPS", image: require('@/assets/images/materi/IPS.png')},
  ];

  return (
    <View style={styles.container}>
      <AppHeader />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContent}

        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Terakhir Dilihat</Text>
            <LastSeenCard />

            <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
          </>
        }

        renderItem={({ item }) => (
          <SubjectCard
            title={item.title}
            image={item.image}
            onPress={() => router.push('/siswa/materi/submateri')}
          />
        )}
      />
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