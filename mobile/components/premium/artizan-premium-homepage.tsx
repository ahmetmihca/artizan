import { StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Text, View } from '.././Themed';
// This is a component prototype to develop faster, used for copy-paste
import "../../hooks/colorSchemeSingleton";


export default function FeaturedPremium({theme}: {theme: any}) {
  return (
    <TouchableOpacity style={[styles.wrapper,{backgroundColor: theme.backgroundSecondary, }]}>
        <View style={styles.textWrapper}>
            <Text style={styles.title}>Meet with Artizan Premium.</Text>
            <Text style={[styles.description, {color: theme.textColorNotActive}]}>Be an NFT elite.</Text>
        </View>
      <View style={styles.imageWrapper}>
        <Image source={require('../../assets/gifs/artizan-720-720.webp')} style={styles.featuredImage}></Image>
      </View>
      
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    elevation:8,
  },
  textWrapper:{
    width: 170,
    backgroundColor: 'transparent'
  },
  title:{
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
    marginRight: 5
  },
  description: {
      fontSize:16,
      marginLeft: 10,
      marginTop:5 
  },
  featuredImage: {
      height: 160,
      width: 160,
      borderRadius: 20
  },
  imageWrapper:{
      borderRadius: 20,
      marginTop: 20,
      width: 160,
      height: 160,
      overflow: 'hidden'
  }
  
});
