import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import collection_services from '../services/collection_serv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { SingleCollection } from '../components/ProfileCollections';
import { useTheme } from '../hooks/colorSchemeSingleton';


export default function CategoryScreen( {route, navigation } :{route:any, navigation:any}) {
    
    const {props} = route.params;
    const {theme} = useTheme();

    const [collections, setCollections] = useState([]);
    useEffect(() => {
    let isCancelled = false;
    
         collection_services.getCategorized(props.title).then(
            (val) =>{
                setCollections(val);
            }
         )

    
    return () => { isCancelled =true};
    }, []);
    const renderCollections = ({ item }: {item:any}) => (
    <SingleCollection props ={item} style={{width: 150, marginLeft: 10}}></SingleCollection>
  );
  return (
    <View style={styles.exampleStyle}>
        <Image source={{uri: props.image}} style={{width: '100%', height: 300}}></Image>
        <Text style={[styles.titleStyle,{color: theme.text}]}>{props.title}</Text>

            {
         collections && collections.length != 0 && 
            <SafeAreaView>
            <FlatList
                horizontal
                data={collections}
                renderItem={renderCollections}
                keyExtractor={item => item._id}
                />
            </SafeAreaView>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  exampleStyle: {
    flex: 1,
    alignItems: 'center',
  },
  titleStyle:{
      fontWeight: 'bold',
      fontSize: 30,
      marginTop: 20

  }
  
});
