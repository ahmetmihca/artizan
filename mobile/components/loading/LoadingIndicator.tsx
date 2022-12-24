import { StyleSheet, ActivityIndicator } from 'react-native';
import { Text, View } from '.././Themed';
import "../../hooks/colorSchemeSingleton";

export default function LoadingIndicator({style, explanation, explanationStyle}: {style?:any | undefined, explanation?: string | undefined, explanationStyle?: Object | undefined}) {
  return (
    <View style={[styles.view,style]}>
      <ActivityIndicator size="large" color="#fff"/>
      {
        explanation && 
        <Text style={explanationStyle}>{explanation}</Text>
      }
    </View>
  );
}



const styles = StyleSheet.create({
  view: {
      width:'100%',
      height: 100,
      paddingTop: 50,
      justifyContent: 'center',
      alignItems:'center'
  },
  
});
