import { StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import SwitchCurrency from '../components/settings/SwitchCurrency';
import "../hooks/colorSchemeSingleton";
import { useTheme } from '../hooks/colorSchemeSingleton';
import { Switch,CheckBox } from '@rneui/themed';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }: RootTabScreenProps<'SettingsScreen'>) {

  const {theme, updateTheme, syncronizeDevice} = useTheme();

  const [isDark, setIsDark] = useState(theme.themeMode === "dark"); // for switch
  const [syncDevice, setSyncDevice] = useState(true); // for checkbox

  // Get if user have chosen sync
  useEffect(() =>  {
    let isCancelled = false;  // dummy var to prevent async warnings
    async function syncDevice(){
      const isSynced = await AsyncStorage.getItem("themeMode");
      if(isSynced !== null)
      {
        if(!isCancelled)
        {
          setSyncDevice(false);
        }
        return;
      }
    }
    syncDevice();

    return () => { isCancelled =true };
  },[]);
  return (
    <View style={[styles.exampleStyle, {backgroundColor: theme.backgroundPrimary}]}>
      <View style={[styles.titleWrapper,{backgroundColor: theme.backgroundSecondary}]}>
        <Text style={styles.bigTitle}>Settings</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title,{color: theme.text}]}>Currency Options</Text>
        <Text style={[styles.description, {color: theme.textColorNotActive}]}>To display conversion rate with Ethereum.</Text>
        <SwitchCurrency></SwitchCurrency>

        <Text style={styles.title}>Theme Options</Text>
        <Text style={[styles.description, {color: theme.textColorNotActive}]}>In Artizane, you can choose the application theme.</Text>
        
        <View style={styles.rowFlex}>
          <Text style={[styles.option,{color:theme.text}]}>Dark Theme</Text>

          <Switch value={isDark} onValueChange={(value) => {
          setIsDark(value);
          updateTheme(theme.themeMode);
          setSyncDevice(false);
          }}
          style={{marginTop:3}}
          ></Switch>
        </View>

        {/* Ask user if it wants to sync with its device */}
        <View style={styles.rowFlex}>
          <CheckBox containerStyle={{padding:0,backgroundColor: theme.backgroundPrimary}} checked={syncDevice} onPress={() => {
          if(syncDevice === false)
          {
            setSyncDevice(!syncDevice);
            syncronizeDevice();
          }
          else{
            updateTheme(isDark ? "light": "dark");
            setSyncDevice(!syncDevice);
          }
          
          }}></CheckBox>
          <Text style={{color: theme.text}}>Syncronize theme with my device.</Text>
        </View>
      </View>
      
      
      

      
    </View>
  );
}

const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
  },
  contentContainer:{
    paddingLeft: 20
  },
  bigTitle:
  {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 18
    
  },
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 3
  },
  description:{
    marginBottom: 15
  },
  option:{
    fontSize: 18
  },
  titleWrapper: {
    marginBottom: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems:'center',
    height: 100
  },
  
});