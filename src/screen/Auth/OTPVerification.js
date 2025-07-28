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

const screenWidth = Dimensions.get('window').width;

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(32);
  const [showResentMessage, setShowResentMessage] = useState(false);
  const inputsRef = useRef([]);
  const route = useRoute();
  const navigation = useNavigation();
  const mobile = route.params?.mobile || 'your number';

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
    if (
      e.nativeEvent.key === 'Backspace' &&
      otp[index] === '' &&
      index > 0
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    console.log('Submitted OTP:', enteredOtp);

    if (enteredOtp.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the full 6-digit OTP');
      return;
    }

    if (enteredOtp === '123456') {
      navigation.navigate('StudentDashboard');
    } else {
      Alert.alert('Error', 'Incorrect OTP, please try again');
    }
  };

  const handleResend = () => {
    setTimer(32);
    setShowResentMessage(true);
    console.log('OTP Resent');
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
              Enter the code from the SMS we sent to +91 {mobile}
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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  container: {
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  timer: {
    fontSize: 16,
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
    width: '100%',
  },
  gradientBox: {
    borderRadius: 10,
    width: 48,
    height: 48,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  otpInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: '100%',
    fontSize: 22,
    textAlign: 'center',
    color: '#000',
  },
  resendText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  resendHighlight: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  resentMessage: {
    fontSize: 14,
    color: 'green',
    marginBottom: 20,
  },
});

export default OTPVerification;
