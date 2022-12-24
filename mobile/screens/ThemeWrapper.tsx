import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/colorSchemeSingleton';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import LoadingScreen from './LoadingScreen';

 const ThemeWrapper = ({ children })=> {
    const {isLoadingTheme} = useTheme();
    if(isLoadingTheme) return null;
  return children;
}
export default ThemeWrapper;
const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
});
