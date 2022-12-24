import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import methods from '../helpers/asset_url';
import user_services from "../services/user_serv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { useTheme } from "./../hooks/colorSchemeSingleton";
import asset_services from "../services/asset_serv";
const windowWidth = Dimensions.get('window').width;
const etherIcon = <MaterialCommunityIcons name='ethereum' size={15} color='#444971' style={{paddingRight:1, elevation:5}} />;

const NFTCard = ({ props, favable ,style , clickable = true}: { props:any, style?:any, favable?: boolean, clickable?: boolean}) => {
  const {theme} = useTheme();
  const [collection, setCollection] = useState<any>({});
  const [itemDetails, setItemDetails] = useState(undefined)
  const [liked, setLiked] = useState(false);
  useEffect(() => {
        
        let isCancelled = false;
        async function checkData() {
          if(props && props.contract)
          {
            asset_services.get_asset_collection(props.contract, props.token).then((res) =>{
                    if(!isCancelled)
                    {
                      setCollection(res);

                    }
                  })
                  ;
          }
                  
                  
          }
        async function getLikedData(){
          const token = await AsyncStorage.getItem("token");
          let likes:any[] = [];
          await user_services.get_my_favorites(token).then((likesTemp) =>{
            likes = likesTemp;
          });
          for(let i  = 0 ; i  < likes.length ; i++)
          {
            if(props && props.contract && likes[i].contract === props.contract && likes[i].tokenID == 
            parseInt(props.token,16) )
            {
              if(!isCancelled)
              {
              setLiked(true);
                break;
              }
            }
          }
        }
        getLikedData();
        checkData();
        return () => { isCancelled =true};
         

    }, []);
  const navigation = useNavigation();
  function navtoArtwork(){
    navigation.navigate("ArtworkScreen",{props:props});
  }
  const [visibility, setVisibility] = useState(true);
  async function backgroundUnlike(){

    const token = await  AsyncStorage.getItem("token");
    user_services.removeFavoriteNft(props.contract, props.token, token);

  }
  function unlike(){
    if(favable)
    {
      setVisibility(false);
      backgroundUnlike()
    }
  }
  return (
    
    <TouchableOpacity
    disabled= {!clickable}
      style={[
        styles.container,
        {
          width: style ? style.width : "44%",
          marginLeft: style ? style.marginLeft :  15,
          marginTop: 5,
          height: style && style.height ? style.height: 250,
          display: visibility ? undefined : 'none',
          borderColor: theme.backgroundSecondary,
          backgroundColor: theme.backgroundSecondary,
          shadowColor: theme.backgroundSecondary,
        }
      ]}
      onPress={clickable ? navtoArtwork : ()=>{}
      }
    >
      {
        props && props.asset && props.asset.imgURL  &&
          <Image source={{ uri: methods.convert_img(props.asset.imgURL)}} style={[styles.image,{overlayColor: theme.backgroundSecondary, width: style ? style.width-20 : '%43', height: style.width-20}]} /> 
      }
      {
        (!props || !props.asset || !props.asset.name)
        && 
        <Image source={require('../assets/image/stamper.jpg')} style={[styles.image,{overlayColor: theme.backgroundSecondary, width: style ? style.width-20 : '%43', height: style.width-20}]} /> 
      }
      
      <View style={styles.nftDetails}>
        {
         collection &&
          <Text style={[styles.collection,{color: theme.textColorNotActive}]}>{collection.name}</Text>
        }
        {
         !collection || collection.name === "" &&
          <Text style={[styles.collection,{color: theme.textColorNotActive}]}>No collections</Text>
        }
        {
          props && props.asset &&props.asset.name &&
          <Text style={[styles.title,{color: theme.text}]}>{props.asset.name}</Text>
        }
        {
        (!props || !props.asset || !props.asset.name)
        && 
        <Text style={[styles.title,{color: theme.text}]}>Minting</Text>
        }
      </View>
      <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>

        <View style={styles.priceContainer}>
          {
            etherIcon
          }
          {
            props&& props.asset && props.asset.price && props.asset.price != 0 && 
            <Text style={[styles.price, {color:theme.textColorNotActive}]}>{props.asset.price}</Text>

          }
        </View>
        <View style={styles.likesContainer}>
          {
            props && props.asset &&
          <Text style={[styles.price, {color:theme.textColorNotActive, marginRight: 3}]}>{props.asset.favorited ? props.asset.favorited : 0}</Text>
          }
          
            <TouchableOpacity onPress={unlike}>
              {
                liked == false && <Icon name='ios-heart-outline' size={15} color={theme.textColorNotActive} ></Icon>
              }
              {
                liked && <Icon name='ios-heart' size={15} color={'red'} ></Icon>
              }
            </TouchableOpacity>
            
        </View>
      </View>
        
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 250, 
    borderWidth: 0.5,
    borderRadius: 20,    
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.41,
    elevation: 3,
  },
  nftDetails: {
    width: '90%',
    marginTop: 15,
    marginBottom:10,
    paddingLeft: 5
  },
  image: {
    marginTop:10,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center"
  },
  username: {
    fontSize: 15,
    color: "gray",
    letterSpacing: 1
  },
  icon: {
    marginLeft: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
    
  },
  collection: {
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 3
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  
  price: {
    fontWeight: "bold",
    fontSize: 13,
  },
  likesContainer: {
    flexDirection: "row",
    width: '50%',
    alignItems: "center",
    justifyContent: 'flex-end',
    paddingRight: 10,
    marginBottom:15
  },
  priceContainer: {
    flexDirection: "row",
    width: '50%',
    alignItems: "center",
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginBottom:15

  },
  likes: {
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 7
  }
});
export default NFTCard;
