import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    View,
  } from 'react-native';
  import {ScrollView} from 'react-native';
  import {TouchableOpacity} from 'react-native';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {useEffect, useMemo, useState} from 'react';
  import {RadioButton, TouchableRipple} from 'react-native-paper';
  import CustomText from '../components/custom-text';
  import {Image} from 'react-native';
  import {useIsFocused} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';
  
  const Results = ({route, navigation}: any) => {
  
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
        <SafeAreaView style={{flex: 1}}>
         {/* tab nav bar */}
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                style={{height: 'auto', flexGrow: 1}}
                className="bg-white relative px-[20px] w-full pb-[20px] pt-2">
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    rowGap: 10,
                    flexGrow: 2,
                    marginBottom: 30,
                  }}
                  className="w-full">
                  {/* content */}
                </View>
                <View
                  className={`${
                    Platform.OS == 'ios' ? 'h-[140px]' : 'h-[140px]'
                  }`}></View>
              </ScrollView>
            </View>
            <View
              className="px-[24px] py-[16px] border-t-gray-100 border-t-[1px]"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
              }}>
              <CustomButton
                title={t('VehicleInfo.Done')}
                disabled={!showDoneIcon}
                classNames={'pt-3 pb-4 rounded-full'}
                onPress={() => {
                  if (selectedVehicles?.length > 0) {
                    navigation.navigate(route?.params?.returnUrl, {
                      selectedVehicles: selectedVehicles,
                    });
                  }
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };
  
  export default Results;
  