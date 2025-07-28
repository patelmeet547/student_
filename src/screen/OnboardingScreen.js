import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student ERP</Text>

      <Image
        source={require('D:/reactnative/student_erp/src/assets/img/classroom.jpg')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>
        All-in-One Student Management System Dashboard for Modern Institutions.
      </Text>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('LoginScreen')}>
        <LinearGradient
          colors={['#FB344B', '#FB344B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 45,
    color: '#000',
  },
  image: {
    width: 320,
    height: 400,
    borderRadius: 10,
    marginBottom: 25,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
