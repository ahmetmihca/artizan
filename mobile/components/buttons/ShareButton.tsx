import React from 'react';
import { Share } from 'react-native';
import {Icon as ThemedIcon} from '@rneui/themed';
import { useTheme } from "../../hooks/colorSchemeSingleton";


const ShareButton = ({props}: {props:any}) => {
  const {theme} = useTheme();
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
           props.msg,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error:any) {
      alert(error.message);
    }
  };
  return (
        <ThemedIcon onPress={onShare} backgroundColor={theme.backgroundSecondary} name="share-google" reverse type='evilicon'></ThemedIcon>
  );
};

export default ShareButton;