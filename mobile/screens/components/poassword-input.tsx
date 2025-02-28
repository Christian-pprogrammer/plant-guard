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
  error?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  inputRef?:any;
  onBlur?: Function;
}

const PasswordInput = ({value, onChange, label, error, maxLength,autoFocus,inputRef,onBlur}: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <TextInput
      label={<Text className="text-[#6C757D] font-[400]">{label}</Text>}
      value={value}
      ref={inputRef? inputRef : null}
      mode="outlined"
      {...(maxLength && {maxLength})}
      activeOutlineColor={'#041E31'}
      maxLength={100}
      keyboardAppearance='light'
      onFocus = {() => {
        setFocused(true);
      }}
      onBlur = { () => {
        setFocused(false);
        if(onBlur){
          onBlur()
        }
      }}
      secureTextEntry={!isPasswordVisible}
      right={
        <TextInput.Icon
          style={{position: 'relative', top: 3.5}}
          color={'#ADB5BD'}
          onPress={() => {
            setIsPasswordVisible(!isPasswordVisible);
          }}
          icon={isPasswordVisible ? 'eye' : 'eye-off'}
        />
      }
      autoFocus={autoFocus? true : false}
      outlineStyle={{borderWidth: error ? focused? 2 : 1 : focused? 2: 0,borderColor: !focused && error? "transparent": focused? "#00A362" : 'transparent'}}
      outlineColor={error ? '#e53e3e' : '#DEE2E6'}
      style={{
        borderRadius: 50,
        color: 'black',
        height: 55,
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

export default PasswordInput;
