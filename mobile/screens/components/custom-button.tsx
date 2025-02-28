import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import CustomText from './custom-text';
import { TouchableRipple } from 'react-native-paper';
import React from 'react';

interface Props {
  title: string;
  onPress: Function;
  isLoading?: boolean;
  icon?: any;
  width?: any;
  classNames?: any;
  btnTextClassNames?: any;
  leftIcon?: any;
  flexColGap?: number;
  loadingText?: string;
  loaderColor?: string;
  leftIconClassNames?: string;
  disabled?: boolean;
  forcedClasses?:any
}

const CustomButton = ({
  title,
  onPress,
  isLoading,
  icon,
  width,
  classNames,
  btnTextClassNames,
  leftIcon,
  flexColGap,
  loadingText,
  loaderColor,
  leftIconClassNames,
  disabled,
  forcedClasses
}: Props) => {
  return (
    <TouchableRipple
    borderless
    className={`${isLoading || disabled ? 'bg-gray-300' : 'bg-primary'} ${
      width ? width : 'w-[100%]'
    } px-10 pt-[14px] pb-5 flex justify-center items-center ${classNames} rounded-full ${forcedClasses}`}
      onPress={() => {
        if (!isLoading) {
          onPress();
        }
      }}
      disabled={isLoading || disabled}
    >
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: flexColGap ? flexColGap : 7,
    opacity: isLoading ? 0.6 : 1
  }}
  className={`flex justify-center items-center`}
>
{leftIcon && !isLoading && (
        <Text className={`relative ${leftIconClassNames}`}>
          {leftIcon}
        </Text>
      )}
      {isLoading && (
        <ActivityIndicator
          color={loaderColor ? loaderColor : '#fff'}
          size={30}
        />
      )}
      <CustomText
        style={{fontFamily: 'EuclidCircularB-Bold',fontWeight: "700"}}
        className={`text-white text-base ${btnTextClassNames}`}>
        {isLoading ? `${loadingText}` : `${title}`}
      </CustomText>
      {icon && <Text className={'relative top-[2px]'}>{icon}</Text>}
</View>
    </TouchableRipple>
  );
};

export default CustomButton;
