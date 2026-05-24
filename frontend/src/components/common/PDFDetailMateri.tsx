import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, BORDER_RADIUS } from '@/utils/theme';

// firebase
import { db } from '@/src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PdfPreviewProps {
  materialId: string;
}

export default function PdfDetailMateri({ materialId }: PdfPreviewProps) {
  const [materialData, setMaterialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      if (!materialId) return;
      try {
        const docRef = doc(db, "material", materialId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaterialData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching PDF detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [materialId]);

  if (loading) {
    return <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />;
  }

  if (!materialData?.fileUrl) return null;

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(materialData.fileUrl)}&embedded=true`;

  const injectedJS = `
    const style = document.createElement('style');
    style.innerHTML = 'img { width: 100% !important; height: auto !important; }';
    document.head.appendChild(style);
    true;
  `;

  return (
    <View style={[styles.fileCard, { height: 480 }]}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: googleViewerUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectedJS}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={StyleSheet.absoluteFill}>
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 150 }} />
          </View>
        )}
        scalesPageToFit={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
      <View style={styles.pdfPreview}>
        <Text style={styles.pdfText}>
          Total {materialData.totalSteps || 0} Halaman • Scroll untuk melihat
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    marginBottom: 12,
  },
  pdfPreview: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfText: {
    fontSize: 14,
    color: COLORS.textSub,
  },
});