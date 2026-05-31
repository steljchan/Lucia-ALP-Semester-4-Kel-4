import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MARGIN_HORIZONTAL, BTN, TEXT } from '../../utils/theme';
import Card from '../../src/components/common/card';
import { useRouter } from 'expo-router';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { login } from "../../src/services/authservices";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email tidak boleh kosong");
      return;
    }
    if (!password) {
      setPasswordError("Password tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(email.trim(), password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') router.replace('/admin');
        else if (role === 'guru') router.replace('/guru/tabs/beranda');
        else if (role === 'siswa') router.replace('/siswa/tabs/beranda');
        else setPasswordError("Role tidak valid");
      } else {
        setEmailError("Data profil tidak ditemukan di database");
      }
    } catch (error: any) {
      let errorMessage = "Login gagal. Periksa kembali email dan password Anda.";
      switch (error.code) {
        case 'auth/network-request-failed':
          errorMessage = "Koneksi internet tidak stabil.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Format email tidak valid.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Email atau password yang Anda masukkan salah.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
          break;
        default:
          errorMessage = "Login gagal. Periksa kembali email dan password Anda.";
      }
      setEmailError(errorMessage);
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.topSection}>
          <Image source={require('../../assets/images/lucia.png')} style={styles.logo} />
        </View>

        <Card style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
          <Text style={TEXT.bigTitle}>Masuk</Text>
          <Text style={styles.descMasuk}>Masuk ke Akun Kamu</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotPass}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[BTN.primary.box, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={BTN.primary.text}>Masuk</Text>}
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="mail-outline" size={50} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>Lupa Password</Text>
            <Text style={styles.modalMessage}>
              Silahkan hubungi admin sekolah untuk mereset password Anda.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  topSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },

  logo: {
    width: 300,
    height: 150,
    marginTop: 20,
  },

  descMasuk: {
    fontSize: 16,
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 30,
  },
  
  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 8,
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

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.smoothBlue,
    borderRadius: 15,
    backgroundColor: '#F9FCFF',
    height: 55,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 14,
    color: COLORS.textMain,
  },

  eyeIcon: {
    paddingHorizontal: 12,
  },

  forgotPass: {
    color: COLORS.textSub,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },

  modalIcon: {
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 8,
  },

  modalMessage: {
    fontSize: 14,
    color: COLORS.textSub,
    textAlign: 'center',
    marginBottom: 24,
  },

  modalButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 10,
  },
  
  modalButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});