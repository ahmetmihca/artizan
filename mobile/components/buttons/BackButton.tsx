import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
export default function BackButton() {
  const myIcon = <Icon name="chevron-left" size={25} color="#7E7474" style={
    {paddingRight:5, elevation:5, backgroundColor:'transparent'}} />;

    const navigation = useNavigation();
  return (
        <TouchableOpacity onPress={() => {navigation.goBack();}}>
          {
            myIcon
          }
        </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
