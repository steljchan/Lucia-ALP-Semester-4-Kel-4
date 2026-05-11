import React, {useState} from 'react';
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

//database
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { login } from "../../src/services/authservices";


export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async () => {
    console.log("1. Mencoba login dengan:", email);
    try {
      const userCredential = await login(email.trim(), password);
      const uid = userCredential.user.uid;
      console.log("2. Login Auth Berhasil! UID:", uid);

      // Ambil data dari Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("3. Data User Ditemukan! Role:", role);

        if (role === 'admin') router.replace('/admin');
        else if (role === 'guru') router.replace('/guru/tabs/beranda');
        else if (role === 'siswa') router.replace('/siswa/tabs/beranda');
        else console.log("4. Role tidak dikenal:", role);
        
      } else {
        console.log("3. ERROR: Dokumen user tidak ada di Firestore!");
        alert("Data profil tidak ditemukan di database.");
      }
    } catch (error: any) {
      console.log("ERROR LOGIN:", error.code, error.message);
      alert("Login Gagal: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.topSection}>
          <Image 
            source={require('../../assets/images/lucia.png')} 
            style={styles.logo}
            // resizeMode="contain"
          />
        </View>

        
        <Card style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
          <Text style={TEXT.bigTitle}>Masuk</Text>
          <Text style={styles.descMasuk}>Masuk ke Akun Kamu</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input} 
              placeholder="Email"
              value={email} 
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password} 
              onChangeText={(text) => setPassword(text)} 
              secureTextEntry={true} 
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