import { StyleSheet, TouchableOpacity, Image, Dimensions  } from 'react-native';
import { Text, View } from '../Themed';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

const windowWidth = Dimensions.get('window').width;

/* All props required, if no favs, pass 0 */
type NFTCardProps = {
    collectionName: string,
    nftName: string,
    nftItemURL: string,
    price: number,
    favCount: number
};


const etherIcon = <Icon name='ethereum' size={20} color='#444971' style={{paddingRight:3, elevation:5}} />;


export default function NFTCard({ props }: { props: NFTCardProps }) {
    const {theme} = useTheme();
    const favIcon = <Icon name='heart-outline' size={20} color={theme.textColorNotActive} style={{paddingRight:3, elevation:5}} />;

    const [size, setSize] = useState({width:100, height:100});
    Image.getSize(props.nftItemURL, (width, height) => {setSize({width, height})});
  return (
        <View style={[styles.cardView,{backgroundColor: theme.backgroundSecondary,}]}>
            <View style={[styles.NFTContainer,{backgroundColor: theme.backgroundSecondary,}]}>
                <Image source={{uri: props.nftItemURL}} style={{width: (windowWidth-20)/2-15, height: size.height*((windowWidth-20)/2-15)/size.width, borderRadius: 10}}></Image>
            </View>
            
            <Text  style={{color: theme.textColorNotActive}}>{props.collectionName}</Text>
            <Text numberOfLines={2} style={[styles.nftNameStyle,{color: theme.text,}]}>{ props.nftName}</Text>
            <View style={[styles.itemDetails,{backgroundColor: theme.backgroundSecondary,}]}>
                <View style ={{backgroundColor: theme.backgroundSecondary, flexDirection:'row'}}>
                    {etherIcon}
                    <Text style={{fontWeight: 'bold'}}>{props.price}</Text>
                </View>
                
                <View style ={{backgroundColor: theme.backgroundSecondary, flexDirection:'row'}}>
                    {favIcon}
                    <Text style={[styles.favStyle,{color: theme.textColorNotActive}]}>{props.favCount}</Text>
                </View>
            </View>
        </View>
  );
}



const styles = StyleSheet.create({
  cardView: {
    height: (windowWidth-20)*5/6,
    width: (windowWidth-20)/2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 8,
    marginLeft: 10,
  },
  nftNameStyle: {
    fontWeight: 'bold'
  },
  itemDetails:{
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  NFTContainer:{
      height: (windowWidth-20)*5*13/(6*25),
      justifyContent: 'center',
      alignItems: 'center',

  },
  favStyle:{
      marginLeft:2,
      fontWeight: 'bold'
  }
  
  
});
