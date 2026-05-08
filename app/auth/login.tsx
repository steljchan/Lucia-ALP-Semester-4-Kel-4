import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { COLORS, MARGIN_HORIZONTAL, BTN, TEXT} from '../../utils/theme';
import Card from '../../src/components/common/card';
import { useRouter } from 'expo-router';


export default function LoginScreen() {
  const router = useRouter();
  
  const handleLogin = () => {
    router.replace('/guru/tabs'); 
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SECTION ATAS: LOGO & JUDUL */}
        <View style={styles.topSection}>
          <Image 
            source={require('../../assets/images/lucia.png')} 
            style={styles.logo}
            // resizeMode="contain"
          />
        </View>

        {/* SECTION KARTU: FORM LOGIN */}
        <Card style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
          <Text style={TEXT.bigTitle}>Masuk</Text>
          <Text style={styles.descMasuk}>Masuk ke Akun Kamu</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh@gmail.com"
              placeholderTextColor={COLORS.textSub}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan 8 Karakter"
              placeholderTextColor={COLORS.textSub}
              secureTextEntry
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPass}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={BTN.primary.box}
            onPress={handleLogin} 
          >
            <Text style={BTN.primary.text}>Masuk</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  topSection: { 
    alignItems: 'center', 
    marginTop: 60, 
    marginBottom: 40 
  },

  logo: { 
    width: 300, 
    height: 150,
    marginTop: 20
  },

  appName: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: COLORS.primary,
    letterSpacing: 1
  },

  descMasuk: { 
    fontSize: 16, 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: 30 
  },

  inputGroup: {
    marginBottom: 20
  },

  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: COLORS.textMain, 
    marginBottom: 8 
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F9FCFF',
    fontSize: 14,
    color: COLORS.textMain,
  },

  forgotPass: { 
    color: COLORS.textSub, 
    textAlign: 'right', 
    fontSize: 13, 
    fontWeight: '600',
    marginBottom: 30
  },
});