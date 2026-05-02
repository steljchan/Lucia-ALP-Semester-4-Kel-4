import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppHeader from '../../../src/components/common/appheader';
import LastSeenCard from '../../../src/components/dashboard/siswa/lastseencard';
import SubjectCard from '../../../src/components/dashboard/siswa/subjectcard';

export default function DashboardSiswa() {

  const subjects = [
    { id: '1', title: "Matematika", image: { uri: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png' } },
    { id: '2', title: "PKN", image: { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' } },
    { id: '3', title: "Bahasa Indonesia", image: { uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' } },
    { id: '4', title: "IPA", image: { uri: 'https://cdn-icons-png.flaticon.com/512/3212/3212608.png' } },
    { id: '5', title: "Bahasa Inggris", image: { uri: 'https://cdn-icons-png.flaticon.com/512/197/197374.png' } },
    { id: '6', title: "IPS", image: { uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' } },
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
        contentContainerStyle={styles.content}

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
          />
        )}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  grid: {
    justifyContent: 'space-between',
  },
});