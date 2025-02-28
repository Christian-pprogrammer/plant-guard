import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Dimensions,
    Alert,
  } from 'react-native';
  import FontAwesome from 'react-native-vector-icons/FontAwesome6';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import CustomText from './custom-text';
  import {useSafeAreaInsets} from 'react-native-safe-area-context';
  import {useEffect, useRef, useState} from 'react';
import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  
  interface Props {
    onBack?: Function;
    navigation: any;
    title?: any;
    classNames?: any;
    showDoneIcon?: boolean;
    onPressDoneIcon?: Function;
    doneBtnText?: string;
    doneBtnClassNames?: any;
    doneLoading?: boolean;
    doneLoadingText?: string;
    doneDisabled?: boolean;
    showIcon?: boolean;
    titleStyles?: any;
    customHeight?: any;
    customStyles?: any;
    hideBackBtn?: boolean;
    showNotification?: boolean;
    showMenu?: boolean;
    switchRoleBtn?: boolean;
  }
  
  const TabNavBar = ({
    onBack,
    navigation,
    title,
    showDoneIcon,
    onPressDoneIcon,
    doneBtnText,
    doneBtnClassNames,
    doneLoading,
    doneLoadingText,
    doneDisabled,
    showIcon,
    titleStyles,
    customHeight,
    customStyles,
    hideBackBtn,
    showNotification,
    showMenu,
    switchRoleBtn
  }: Props) => {
    const insets = useSafeAreaInsets();
    const statusBarHeight = insets.top;
    const socket: any = useRef();
    const [user, setUser] = useState<any>({});
    const [checked, setChecked] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
  const menuRef = useRef<any>()
  
    return (
      <View className="w-full">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 15,
            justifyContent: 'space-between',
            height: customHeight ? customHeight : 60,
            paddingTop: 0,
          }}
          className={`bg-white w-full px-[19px] ${customStyles}`}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 12,width: '100%'}}>
            {
              !hideBackBtn && (
                <TouchableRipple
                borderless
                className={` rounded-full px-2 ml-[-8px] py-2 ${switchRoleBtn? 'bg-neutral' : ''}`}
                onPressIn={() => {
                  setChecked(true);
                }}
                onPressOut={() => {
                  setChecked(false);
                }}
                onPress={() => {
                  if(!switchRoleBtn){
                  if (onBack) {
                    return onBack();
                  }
                  navigation.goBack();
                }else{
                  setIsVisible(true)
                }
                }}>
                <Text>
                  <MaterialCommunityIcons
                    color={'#041E31'}
                    name={switchRoleBtn? 'account-switch-outline' : 'arrow-left'}
                    size={30}
                  />
                </Text>
              </TouchableRipple>
              )
  }
  
            {title && (
              <Text
              numberOfLines={titleStyles? 10: 1}
                style={{fontFamily: 'EuclidCircularB-Bold',fontWeight: "700",flex: 1}}
                className={`capitalize text-[#041E31] text-[24px] ${hideBackBtn? 'ml-[5px]' : ''} ${titleStyles}`}>
                {title}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  
  export default TabNavBar;
  