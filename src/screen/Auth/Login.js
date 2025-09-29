import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import GradientHeader from '../../components/GradientHeader';
import GradientButton from '../../components/GradientButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();
  const { isLoggedIn, userData } = useAuth();

  useEffect(() => {
    if (isLoggedIn && userData) {
      navigation.replace('StudentDashboard');
    }
  }, [isLoggedIn, userData, navigation]);

  const handleGetOtp = () => {
    fetch('https://quantumflux.in:5001/auth/login/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: mobile }),
    credentials: 'include',
  })
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
    padding: wp('5%'),
    justifyContent: 'center',
    minHeight: hp('80%'),
  },
  title: {
    fontSize: wp('8%'),
    marginBottom: hp('1.5%'),
    color: '#000',
    lineHeight: hp('5.5%'),
  },
  bold: {
    fontWeight: '700',
  },
  subtext: {
    color: '#555',
    marginBottom: hp('4%'),
    fontSize: wp('4%'),
    lineHeight: hp('3.2%'),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  countryCodeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  codeText: {
    fontSize: wp('4%'),
    color: '#000',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.5%'),
    fontSize: wp('4%'),
    color: '#000',
  },
});

export default LoginScreen;
