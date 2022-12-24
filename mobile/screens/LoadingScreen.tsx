import { color } from '@rneui/base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootTabScreenProps } from '../types';
import Icon from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from 'react';
import useCachedResources from '../hooks/useCachedResources';
import useColorScheme from '../hooks/useColorScheme';
import Navigation from '../navigation';
import "../hooks/colorSchemeSingleton";
import { useTheme } from '../hooks/colorSchemeSingleton';
import LoginHandler from '../hooks/LoginHandler';


const logoIcon = <Icon name='dingding-o' size={48} color='#fff' style={{paddingRight:5, elevation:5}} />;
export default function LoadingScreen() {
    const isLoadingComplete = useCachedResources();
    const isTokenHandled = LoginHandler();
    const {theme} = useTheme();

    const [loading, setLoading ]= useState(true);

    useEffect(() => {
    let isCancelled = false;
    setTimeout(() => {
        if(!isCancelled){
            setLoading(false);
        }
    }, 1000);
    return () => {
        isCancelled = true;
    }
    
    },[])
    

    if(loading || !isLoadingComplete || isTokenHandled){
        return (<View style={styles.exampleStyle}>
        <View style ={{backgroundColor: 'transparent', flex: 1, flexDirection:'row', alignItems: 'center'}}>
            {logoIcon}
            <Text style={{color: '#fff', fontSize: 36,fontWeight: 'bold', paddingLeft: 5}}>Artizan</Text>
        </View>
    </View>);
    }
    else{
        return (
       <SafeAreaProvider style={{backgroundColor: '#3282B8'}}>
         <Navigation colorScheme={theme} />
      </SafeAreaProvider>
     );
    }
}

const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3282B8',
    height: '100%',
    width: '100%'
  },
  
});
