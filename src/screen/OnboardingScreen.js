import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student ERP</Text>

      <Image
        source={require('../assets/img/classroom.jpg')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>
        All-in-One Student Management System Dashboard for Modern Institutions.
      </Text>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.replace('LoginScreen')}
      >
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08, // ~32px
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    color: '#000',
  },
  image: {
    width: width * 0.85, // 85% of screen width
    height: height * 0.45, // 45% of screen height
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  description: {
    textAlign: 'center',
    fontSize: width * 0.035, // ~14px
    color: '#000',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.04,
  },
  buttonContainer: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: height * 0.018, // ~14px
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045, // ~16px
  },
});
