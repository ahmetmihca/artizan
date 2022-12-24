import React, { createRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import collection_services from "../services/collection_serv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./../hooks/colorSchemeSingleton";


export function SingleCollection({props, style} : {props:any, style: any}){
    const [collectionImages, setCollectionImages] = useState<any>();
    const {theme} = useTheme();
    
    const navigation = useNavigation();
    
    useEffect(() => {
    let isCancelled = false;
    const getCollections =  () => {

        let cll = collection_services.get_collection_images(props._id);
        if(!isCancelled)
        {
            setCollectionImages(cll);
        }

    };
    getCollections()

    
    return () => { isCancelled =true};
    }, []);

    return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: style ? style.width:  '50%',
          marginLeft: style ? style.marginLeft : 0,
          backgroundColor: theme.backgroundSecondary
        }
      ]}
      onPress={() =>
        (navigation.navigate('CollectionScreen', {props: props}))
      }
    >
      <View style={styles.topContainer}>
        <Image
          source={{ uri: collectionImages ? collectionImages.banner : 'https://dummyimage.com/600x400/000/fff' }}
          style={[
            styles.coverImage,
            {
            }
          ]}
          resizeMode="cover"
        />
      </View>
      <Image
        source={{ uri: collectionImages ? collectionImages.logo : 'https://dummyimage.com/100x100/000/fff' }}
        style={[
          styles.avatar,
          { top: 75 , left:  70 }
        ]}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.usernameDetails}>
          <Text style={[styles.title,{color:theme.text}]}>{props.name}</Text>
          
        </View>
        <Text style={[styles.description,{color: theme.textColorNotActive,}]}>{props.description.substring(0,25) + '..'}</Text>
      </View>
    </TouchableOpacity>
    );
}


export default function ProfileCollections() {
    const {theme} = useTheme();
    const navigation = useNavigation();
    const [collections, setCollections] = useState();
    useEffect(() => {
    let isCancelled = false;
    const getCollections = async () => {
            const token = await AsyncStorage.getItem("token");

            let cll = await collection_services.get_my_collection(token);
            setCollections(cll);

    };
    getCollections()

    
    return () => { isCancelled =true};
    }, []);

    const renderCollections =  ({item}) => {
        return <SingleCollection  props={item} style= {{marginLeft: 10, width: 250}}></SingleCollection>;
    }

  return (
      <View style={{backgroundColor: theme.backgroundPrimary, minHeight: 300}} >
        {
            collections && collections.length != 0 && 
            <SafeAreaView style ={{backgroundColor: theme.backgroundPrimary}}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={collections}
                renderItem={renderCollections}
                keyExtractor={(item,index) => index.toString()}
                />
            </SafeAreaView>
        }
    </View>
    
    
    
  );
}




const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.41,
    elevation: 3,
    borderRadius:20
  },
  topContainer: {
    flex: 1
  },
  coverImage: {
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  avatar: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
    top: 75,
    left: 70
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  usernameDetails: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 5
  },
  description: {
    marginLeft: 5,
    flexShrink: 1,
    marginRight: 5
  }
});
