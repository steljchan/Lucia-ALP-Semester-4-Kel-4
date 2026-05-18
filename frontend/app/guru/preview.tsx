import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {WebView} from 'react-native-webview';
import {BTN, containerHeader, scrollContent, COLORS} from '@/utils/theme';
import DetailHeader from '@/src/components/common/guru/detailHeader';

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
        <DetailHeader
          title="Template"
          subtitle={titleName as string}
        />

        <ScrollView contentContainerStyle={scrollContent} showsVerticalScrollIndicator={false}>

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
  previewContainer: {
    height: 450,
    borderRadius: 20,
    overflow: 'hidden', 
    elevation: 5,
    shadowColor: COLORS.black,
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