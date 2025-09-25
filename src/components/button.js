import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Custom Button Component
const Button = ({ children, style, mode = 'contained', ...props }) => {
  return (
    <PaperButton
      mode={mode}
      style={[
        {
          borderRadius: wp('6%'),  // responsive border radius
          height: hp('7%'),        // responsive height
          justifyContent: 'center', // vertical center
        },
        style,
      ]}
      labelStyle={{
        fontSize: wp('4.2%'), // responsive font size
      }}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

export default Button;
