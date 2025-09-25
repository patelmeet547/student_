// src/components/GradientButton.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const GradientButton = ({
  onPress,
  title,
  colors = ['#FB344B', '#FB344B'],
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: hp('2.2%'),      // responsive vertical padding
    paddingHorizontal: wp('25%'),     // responsive horizontal padding
    borderRadius: wp('10%'),          // responsive border radius
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: hp('2%'),              // responsive top margin
  },
  text: {
    color: '#fff',
    fontSize: wp('4.5%'),             // responsive font size
    fontWeight: 'bold',
  },
});

export default GradientButton;
