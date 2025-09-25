import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const SimpleLoader = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Loader Circle */}
      <View style={styles.loaderContainer}>
        {/* Gray Circle Background */}
        <View style={styles.grayCircle} />
        
        {/* Red Rotating Arc */}
        <Animated.View 
          style={[
            styles.redArc,
            { transform: [{ rotate }] }
          ]} 
        />
      </View>
      
      {/* Loading Text */}
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f5f5f5', 
  },
  loaderContainer: {
    position: 'relative',
    width: 64, // w-16 (16 * 4 = 64px)
    height: 64, // h-16
    marginBottom: 24, // mb-6 (6 * 4 = 24px)
  },
  grayCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#6B7280', // border-gray-500
    borderRadius: 32, // half of width/height for full circle
    opacity: 0.3,
  },
  redArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#EF4444', // border-b-red-500
    borderRadius: 32,
  },
  loadingText: {
    color: '#EF4444', // text-red-500
    fontSize: 16, // text-base
    fontWeight: 'normal',
  },
});

export default SimpleLoader;