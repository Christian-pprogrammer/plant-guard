import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
    BottomSheetScrollView,
  } from '@gorhom/bottom-sheet';
import React from 'react';
import { useCallback } from 'react';
import { View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';

interface FixedBottomSheetModalProps{
    children: any;
    bottomSheetModalRef: any;
  snapPoints: any;
  onDismiss?: Function;
  noScroll?: boolean;
  handleComponent?:any;
}
  
export default function FixedBottomSheetModal({children,bottomSheetModalRef,snapPoints,onDismiss,noScroll,handleComponent}:FixedBottomSheetModalProps) {

    const renderBackdrop = useCallback(
        (props: any) => (
          <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props}>
            <TapGestureHandler>
              <View style={{flex: 1}} />
            </TapGestureHandler>
          </BottomSheetBackdrop>
        ),
        [],
    );
    
  return (
      <BottomSheetModal
      {...(handleComponent || handleComponent==null ? { handleComponent } : {})}
        onDismiss={() => {
          if (onDismiss) {
            onDismiss()
         }
        }}
      ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
            index={0}
            snapPoints={snapPoints}
          >
                <BottomSheetScrollView showsVerticalScrollIndicator={false} scrollEnabled={noScroll? false: true} keyboardShouldPersistTaps='handled' horizontal={false}>
               {children}
            </BottomSheetScrollView>
          </BottomSheetModal>
    )
}