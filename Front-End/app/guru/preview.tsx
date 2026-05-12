import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BTN, containerHeader, scrollContent } from '@/utils/theme';



export default function PreviewTemplate() {
  const { previewUrl, templateUrl, titleName } = useLocalSearchParams();
  const router = useRouter();

  const handleOpenCanva = () => {
    console.log("Membuka link:", templateUrl);
    
    if (templateUrl) {
      
      const url = Array.isArray(templateUrl) ? templateUrl[0] : templateUrl;
      Linking.openURL(url).catch((err) => console.error("Gagal buka link:", err));
    } else {
      alert("Link template tidak ditemukan");
    }
  };

  return (
    <View style={[containerHeader, { flex: 1 }]}>
      {/* HEADER */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>

                <Text style={styles.headerTitle}>Template</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.templateTitle}>{titleName}</Text>

            <View style={styles.previewContainer}>
                <WebView 
                    source={{ uri: previewUrl as string }} 
                    userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
                    style={styles.webview}
                />
            </View>
        
            <View style={styles.footer}>
                <TouchableOpacity style={BTN.primary.box} onPress={handleOpenCanva}>
                <Text style={BTN.primary.text}>Edit Template</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
   
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  templateTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: COLORS.textMain,
  },

  previewContainer: {
    height: 450,
    borderRadius: 20,
    overflow: 'hidden', 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  webview: {
    flex: 1,
  },

  footer: {
    padding: 20,
    paddingBottom: 30,
  },
});