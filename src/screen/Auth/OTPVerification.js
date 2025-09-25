import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import GradientButton from '../../components/GradientButton';
import GradientHeader from '../../components/GradientHeader';
import { verifyOtp } from './auth';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');
const baseFont = screenWidth * 0.045;

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [timer, setTimer] = useState(32);
  const [showResentMessage, setShowResentMessage] = useState(false);
  const inputsRef = useRef([]);
  const route = useRoute();
  const navigation = useNavigation();
  const mobile = route.params?.mobile || 'your number';
  const { login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the full 4-digit OTP');
      return;
    }

    try {
      const user = await verifyOtp(mobile, enteredOtp);
      if (user.role === 'student') {
        await login(user);
        navigation.replace('StudentDashboard');
      } else {
        Alert.alert(
          'Access Denied', 
          'You are not allowed to access this application. Only students are permitted.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to login or initial screen
                navigation.navigate('Login'); // or navigation.goBack();
              }
            }
          ]
        );
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to verify OTP';
      Alert.alert('Errorr', errorMsg);
    }
  };

  const handleResend = () => {
    setTimer(32);
    setShowResentMessage(true);
    setTimeout(() => setShowResentMessage(false), 2000);
  };

  const renderOtpInputs = () =>
    otp.map((digit, index) => (
      <LinearGradient
        key={`otp-${index}`}
        colors={['#FB344B', '#FB344B']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBox}
      >
        <TextInput
          ref={(ref) => (inputsRef.current[index] = ref)}
          style={styles.otpInput}
          value={digit}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
          autoFocus={index === 0}
        />
      </LinearGradient>
    ));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GradientHeader title="login" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code from the SMS we sent to +91 {mobile}
            </Text>

            <Text style={styles.timer}>
              {`00:${timer < 10 ? '0' : ''}${timer}`}
            </Text>

            <View style={styles.otpContainer}>{renderOtpInputs()}</View>

            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>
                Don't receive the OTP?{' '}
                <Text style={styles.resendHighlight}>RESEND</Text>
              </Text>
            </TouchableOpacity>

            {showResentMessage && (
              <Text style={styles.resentMessage}>OTP has been resent!</Text>
            )}

            <GradientButton title="Submit" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const boxSize = screenWidth * 0.13;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: screenWidth * 0.1,
  },
  container: {
    paddingHorizontal: screenWidth * 0.07,
    alignItems: 'center',
  },
  title: {
    fontSize: baseFont + 10,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: baseFont,
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  timer: {
    fontSize: baseFont,
    color: '#FB344B',
    marginBottom: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 10,
    width: '80%',
  },
  gradientBox: {
    borderRadius: 10,
    width: boxSize,
    height: boxSize,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  otpInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: '100%',
    fontSize: baseFont + 4,
    textAlign: 'center',
    color: '#000',
  },
  resendText: {
    fontSize: baseFont * 0.9,
    color: '#000',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  resendHighlight: {
    fontSize: baseFont * 0.9,
    color: 'red',
    fontWeight: 'bold',
  },
  resentMessage: {
    fontSize: baseFont * 0.9,
    color: 'green',
    marginBottom: 20,
  },
});

export default OTPVerification;