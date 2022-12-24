import { StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import TopCollections from '../components/stats/TopCollections';
import { useTheme } from '../hooks/colorSchemeSingleton';



export default function StatsScreen({ navigation }: RootTabScreenProps<'StatsScreen'>) {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.titleWrapper,{backgroundColor: theme.backgroundSecondary}]}>
        <Text style={styles.title}>Stats</Text>

      </View>
      <TopCollections></TopCollections>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 40,
    textAlign: 'center'
  }
  
});
