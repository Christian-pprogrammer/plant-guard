import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

const CustomText = ({ children, style, ...props }: TextProps) => {
  // Convert style prop into an array to handle cases where it's not
  const combinedStyles = Array.isArray(style) ? style : [style];

  // Check if any of the styles has a fontFamily that includes 'bold'
  const hasBoldFont = combinedStyles.some(
    (styleItem: any) => styleItem?.fontFamily?.toLowerCase().includes('bold')
  );

  return (
    <Text
      style={[
        { fontFamily: 'EuclidCircularB-Regular' },
        hasBoldFont && { fontWeight: '700' },
        ...combinedStyles
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
