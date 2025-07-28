import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ToastAndroid,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientHeader from '../../components/GradientHeader';
import GradientButton from '../../components/GradientButton';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

  const handleGetOtp = () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (Platform.OS === 'android') {
      ToastAndroid.show('OTP sent to your registered mobile number.', ToastAndroid.SHORT);
    } else {
      Alert.alert('OTP Sent', 'OTP sent to your registered mobile number.');
    }

    navigation.navigate('OTPVerification', { mobile });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.inner}>
        <GradientHeader title="Login" />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Verify your{'\n'}
            <Text style={styles.bold}>phone number</Text>
          </Text>

          <Text style={styles.subtext}>
            We have sent you an <Text style={styles.bold}>One Time Password (OTP)</Text>{'\n'}
            on this mobile number
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.codeText}>+91</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile no."
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              borderColor="#FB344B"
            />
          </View>

          <GradientButton title="Get OTP" onPress={handleGetOtp} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: height * 0.8,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: '#000',
  },
  bold: {
    fontWeight: '700',
  },
  subtext: {
    color: '#555',
    marginBottom: 30,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCodeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  codeText: {
    fontSize: 16,
    borderColor: '#FB344B',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});

export default LoginScreen;
