import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

// Custom Button Component
const Button = ({ children, style, mode = 'contained', ...props }) => {
  return (
    <PaperButton 
      mode={mode} 
      style={[{ borderRadius: 25, height: 60 }, style]} 
      {...props}
    >
      {children}
    </PaperButton>
  );
};

export default Button;