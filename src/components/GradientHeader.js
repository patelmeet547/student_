// components/GradientHeader.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientHeader = ({ title = 'Screen Title' }) => {
  return (
    <LinearGradient
      colors={['rgba(185, 12, 21, 0.1)', '#ffffff']} // 10% pink to white
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bottomStroke} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomStroke: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#fb344b', // Pink border (Figma stroke)
  },
});

export default GradientHeader;
