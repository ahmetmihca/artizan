import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
// This is a screen prototype to develop faster, used for copy-paste

export default function ScreenPrototype({ navigation }: RootTabScreenProps<'ScreenPrototype'>) {
  return (
    <View style={styles.exampleStyle}>
      {/* Insert your code */}
    </View>
  );
}

const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
});
