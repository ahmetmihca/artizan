import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../Themed';
import { useNavigation } from "@react-navigation/native";
export default function NavigatorButton({message, screen, theme}: {message: string, screen:any, theme:any}) {
  

    const navigation = useNavigation();
  return (
        <TouchableOpacity style={[styles.button, { backgroundColor:theme.blue}]} onPress={() => {navigation.navigate(screen);}}>
          <Text>{message}</Text>
        </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    borderRadius: 10,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
