import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Title, TextInput} from 'react-native-paper';

interface Props {
  value: string;
  onChange: Function;
  label: string;
  type: any;
  multiline?: boolean;
  height?: number;
  disabled?: boolean;
  onFocus?: Function;
  placeholder?: string;
  error?: boolean;
  autoFocus?: boolean;
  onBlur?: Function;
  maxLength?: number;
  inputRef?: any;
}

const CustomInput = ({
  value,
  onChange,
  label,
  type,
  multiline,
  height,
  disabled,
  onFocus,
  placeholder,
  error,
  autoFocus,
  onBlur,
  maxLength,
  inputRef
}: Props) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <TextInput
      label={<Text className="text-[#6C757D] font-[400]">{label}</Text>}
      value={value}
      multiline={multiline ? multiline : false}
      {...(maxLength && {maxLength})}
      mode="outlined"
      ref={inputRef}
      placeholder={placeholder ? placeholder : ''}
      textColor="black"
      activeOutlineColor={'#041E31'}
      keyboardType={type}
      autoFocus={autoFocus ? autoFocus : false}
      onBlur={() => {
        setFocused(false);
        if (onBlur) {
          onBlur();
        }
      }}
      disabled={disabled}
      onFocus={() => {
        setFocused(true);
        if (onFocus) {
          onFocus();
        }
      }}
      outlineStyle={{borderWidth: error ? focused? 2 : 1 : focused? 2: 0,borderColor: !focused && error? "transparent": focused? "#0B57D0" : 'transparent'}}
      outlineColor={error ? '#e53e3e' : '#DEE2E6'}
      style={{
        borderRadius: 50,
        color: 'black',
        height: height ? height : 55,
        fontWeight: 'normal',
        backgroundColor: focused? '#fff' : '#F3F4F6'
      }}
      theme={{
        colors: {background: 'white', text: '#ffff'},
        roundness: 10,
      }}
      onChangeText={text => onChange(text)}
    />
  );
};

export default CustomInput;
