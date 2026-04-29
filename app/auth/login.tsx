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
import { COLORS, MARGIN_HORIZONTAL} from '../../utils/theme';

export default function LoginScreen() {
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
        <View style={[styles.card, { marginHorizontal: MARGIN_HORIZONTAL }]}>
          <Text style={styles.titleMasuk}>Masuk</Text>
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

          <TouchableOpacity style={styles.btnMasuk}>
            <Text style={styles.btnText}>Masuk</Text>
          </TouchableOpacity>
        </View>
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
    height: 100,
    marginTop: 20
  },
  appName: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: COLORS.primary,
    letterSpacing: 1
  },
  subTitle: { 
    fontSize: 14, 
    color: COLORS.primary, 
    fontWeight: '700',
    marginTop: -5
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 30,
    marginHorizontal: MARGIN_HORIZONTAL,
    marginBottom: 40,
    // Efek Shadow & Border
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  titleMasuk: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1A3B5D', 
    textAlign: 'center' 
  },
  descMasuk: { 
    fontSize: 16, 
    color: '#1A3B5D', 
    textAlign: 'center', 
    marginBottom: 30 
  },
  inputGroup: {
    marginBottom: 20
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1A3B5D', 
    marginBottom: 8 
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#D1E9FF',
    borderRadius: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F9FCFF',
    fontSize: 14,
    color: '#1A3B5D',
  },
  forgotPass: { 
    color: COLORS.primary, 
    textAlign: 'right', 
    fontSize: 13, 
    fontWeight: '600',
    marginBottom: 30
  },
  btnMasuk: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow tombol
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnText: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});