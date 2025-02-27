import React, {useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Title, TextInput} from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import DeviceCountry from 'react-native-device-country';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from './custom-text';

interface Props {
  value: string;
  onChange: Function;
  label: string;
  error?: boolean;
  getDefaultCountryCode?: boolean;
  defaultCode?: any;
  autoFocus?:boolean;
  inputRef?:any;
  onBlur?: Function;
}

const PhoneNumberInput = ({
  onChange,
  label,
  value,
  error,
  getDefaultCountryCode,
  defaultCode,
  autoFocus,
  inputRef,
  onBlur
}: Props) => {
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [defaultCountryCode, setDefaultCountryCode] = useState<any>(null);
  const [deviceCode,setDeviceCode] = useState<any>(null)

  const getDeviceInfo = async()=>{
    const res: any = await DeviceCountry.getCountryCode();
    setDeviceCode(res?.code?.toUpperCase())
  }

  useEffect(() => {
    if(!defaultCode){
    getDeviceInfo()
    }else{
      setDefaultCountryCode(defaultCode)
    }
  }, [defaultCode]);

  return (
    <View>
      {
       (defaultCountryCode) && (
          <PhoneInput
          countryPickerProps={{withAlphaFilter: true}}
          defaultValue={value}
          defaultCode={defaultCountryCode || deviceCode}
            placeholder={t('form.PhoneNumber')}
            textInputStyle={{
              color: 'black',
              backgroundColor: focused? '#fff' : '#F3F4F6',
              paddingLeft: 0,
            }}
            textInputProps={{
              placeholderTextColor: 'gray',
              maxLength: 40,
              onFocus: () => {
                setFocused(true);
              },
              onBlur: () => {
                setFocused(false);
                if(onBlur){
                  onBlur()
                }
              },
              autoFocus: autoFocus? true : false,
              keyboardType: "phone-pad",
              keyboardAppearance: 'light',
              ref: inputRef? inputRef : null
            }}
            containerStyle={{
              height: 57,
              width: '100%',
              borderRadius: 10,
              borderWidth: error ? focused? 2: 1 : focused? 2: 0,
              backgroundColor: focused ? '#fff' : '#F3F4F6',
              borderColor: !focused && error? "transparent": focused? "#0B57D0" : 'transparent'
            }}
            codeTextStyle={{
              backgroundColor: focused? '#fff' : '#F3F4F6',
            }}
            textContainerStyle={{
              backgroundColor: focused? '#fff' : '#F3F4F6',
              paddingLeft: 0,
              borderRadius: 16,
              paddingVertical: 0,
            }}
            layout="first"
            onChangeText={(text:any) => {
              // onChange(text);
            }}
            onChangeFormattedText={(text:any) => {
              onChange(text);
            }}
            withDarkTheme={false}
            withShadow={false}
            autoFocus={false}
          />
        )
      }
    </View>
  );
};

export default PhoneNumberInput;
