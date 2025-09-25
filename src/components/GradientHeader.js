// components/GradientHeader.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const GradientHeader = ({ title = 'Screen Title' }) => {
  return (
    <LinearGradient
      colors={['rgba(185, 12, 21, 0.1)', '#ffffff']}
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
    paddingTop: hp('6%'),       // responsive top padding
    paddingBottom: hp('2.5%'),  // responsive bottom padding
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
  },
  title: {
    fontSize: wp('5.5%'),       // responsive font size
    fontWeight: 'bold',
    color: '#000',
  },
  bottomStroke: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('0.2%'),         // responsive border thickness
    backgroundColor: '#fb344b',
  },
});

export default GradientHeader;
