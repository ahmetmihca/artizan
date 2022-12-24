import React from "react";
import { useState,useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import Constants from "expo-constants";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Avatar,{AvatarSkeleton} from "../components/Avatar";
import { BottomSheet, ListItem} from '@rneui/themed';
import { Input} from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutex } from "react-context-mutex";
import { getDocumentAsync } from "expo-document-picker";
import user_services from "../services/user_serv";
import {get_nonce, login} from '../services/login_serv.js';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useTheme } from "./../hooks/colorSchemeSingleton";

import ShareButton from "./buttons/ShareButton";

export const ItemHeaderSkeleton = () =>{
  const {theme} = useTheme();
  return (
    <View style={[styles.header,{backgroundColor: theme.backgroundSecondary,}]}>
      <View>
        
        <TouchableOpacity
          style={[styles.icon, { top: Constants.statusBarHeight, right: 20 }]}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={30}
            color={theme.textColorNotActive}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.icon, { bottom: 20, right: 20 }]}>
          <Ionicons name="share-social-outline" size={30} color={theme.textColorNotActive} />
        </TouchableOpacity>
        
        <View style={{width: '100%', height: 200}}>

        </View>
        <AvatarSkeleton></AvatarSkeleton>
      </View>
      <View style={styles.details}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title,{color: theme.text}]}></Text>
          {(
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={theme.backgroundPrimary}
              style={styles.verifiedIcon}
            />
          )}
        </View>
        <Text style={[styles.description,{color: theme.textColorNotActive,}]}>
        </Text>
      </View>
    </View>
  );
}


const ItemHeader = ({name, title,bio, image, coverImage, verified, editable = true ,type = undefined, id } :{name:string, title: string, bio:string,image: string, id?:any, coverImage:string, verified: boolean, editable:boolean, type: string | undefined}) => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  // States
  const [isVisible, setIsVisible] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editedBio, setEditedBio] = useState(undefined);
  const [editedUsername, setEditedUsername] = useState(undefined);
  const [editedAvatar, setEditedAvatar] = useState(undefined);

  // connector
  const connector = useWalletConnect();
  // State Handlers
  const onEditState = () => (setEditState(true));
  const closeEditState = () => (setEditState(false));

  const mimetype = (name:string) => {
    let allow = {"png":"image/png","pdf":"application/json","jpeg":"image/jpeg", "jpg":"image/jpg"};
    let extention = name.split(".")[1];
    if (allow[extention] !== undefined){
      return allow[extention]
    }
    else {
      return undefined;
    }
  }

  const MutexRunner = useMutex();
  const mutex = new MutexRunner('myUniqueKey1');

  async function handleAvatar(){
      mutex.lock();
      try {
      getDocumentAsync(
        {
          type: ["image/*"]
        }
      ).then((response) => {
        if(response && response.name)
        {
          response.type = mimetype(response.name);
          setEditedAvatar(response);
        }
        
        mutex.unlock();
      });
    } catch (err) {
      console.warn(err);
      mutex.unlock();
    }

  }


  const handleDocumentSelection = useCallback((val) => {
    mutex.run(() => {handleAvatar();});
  }, [editedAvatar]); 


  // Submit edit
  async function submitHandler()
  {

    const token = await AsyncStorage.getItem('token');
    if(!token)
    {
      let walletId = connector.accounts[0].toLowerCase();
        let res = await get_nonce(walletId);


        let signature = await connector.signPersonalMessage([res.user.nonce, walletId]);

        let res2 = await login(res.user.nonce, signature);

        await  AsyncStorage.setItem("token",res2.token);
      }
      let usernameSend = editedUsername && editedUsername.trim().length != 0 ? editedUsername : title;
      let bioSend = editedBio && editedBio.trim().length != 0 ? editedBio : bio;

      if(!type)
      {
        await user_services.update_user(editedAvatar, title, usernameSend, bioSend,token);

      }
        else{
        }
        setEditState(false);
    
  }


  return (
    <View style={[styles.header,{backgroundColor: theme.backgroundSecondary,}]}>
      <View>
        {
          !editable || !editState &&
          <View style={{backgroundColor:theme.backgroundSecondary,position: 'absolute', width:50, height: 50, right: 100, top: 25, zIndex: 4}}>
          <ShareButton props={{msg: 'www.artizan.com/user/' + id}}></ShareButton>

        </View>
        }
        {
          editable && !editState && 
          <TouchableOpacity
          onPress={onEditState}
          style={[styles.icon, { top: Constants.statusBarHeight, right: 20 }]}
          >
             <MaterialCommunityIcons
                name="filter-variant"
                size={30}
                color={theme.textColorNotActive}
              />
          </TouchableOpacity>
        }
        {
          editState && 
          <TouchableOpacity
          onPress={submitHandler}
          style={[styles.icon, { top: Constants.statusBarHeight, right: 20, borderColor: 'green', borderWidth: 1 }]}
          >
             <MaterialCommunityIcons
                name="content-save"
                size={30}
                color={'green'}
              />
          </TouchableOpacity>
        }
        {
          editState && 
          <TouchableOpacity
          onPress={closeEditState}
          style={[styles.icon, { top: Constants.statusBarHeight, right: 75, borderColor: 'green', borderWidth: 1 }]}
          >
             <MaterialCommunityIcons
                name="progress-close"
                size={30}
                color={'green'}
              />
          </TouchableOpacity>
        }
        {
          editable && type !== 'collection' &&
          <TouchableOpacity style={[styles.icon, { bottom: 20, right: 20 }]} onPress={() => setIsVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color={theme.textColorNotActive} />
        </TouchableOpacity>
        }
        
        
        <Image
          source={{ uri: coverImage ? coverImage : image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Avatar */}
        { !editState && 
          <Avatar  style={styles.avatar} image={image} size={100} circle />

        }
        { editState && 
          <TouchableOpacity onPress={handleAvatar} style={[styles.avatar, {width: 100, height: 100, borderRadius:100}]}>
            {
              !editedAvatar &&
              <Avatar style={styles.avatar} image={image} size={100} circle />
            }
            {
              editedAvatar &&
              <Avatar style={styles.avatar} image={editedAvatar.uri} size={100} circle />
            }
          </TouchableOpacity>
        }
      </View>

      {/* username */}
      
      <View style={styles.details}>
        <View style={styles.titleContainer}>
          {
            !editState &&  
            <Text style={[styles.title,{color: theme.text}]}>{title}</Text>
          }
          {
            editState && 
            <Input onChangeText={setEditedUsername} placeholder={title} value={editedUsername}  style={{color: theme.text}}>
          </Input>
          }
      </View>

        {/* Bio  */}
        { editState &&
          <Input onChangeText={setEditedBio} placeholder={bio && bio.length != 0 ? bio: 'Enter a biography'} value={editedBio} style={{color: theme.text}}>
          </Input>
        }
        { !editState &&
          <Text style={[styles.description,{color: theme.textColorNotActive,}]}>
            {bio}
          </Text>
        }
        
      </View>





      <BottomSheet isVisible={isVisible}>
        <TouchableOpacity onPress={() => {
          setIsVisible(false);
          navigation.navigate('CreateArtScreen')}}>
          
            <ListItem
              key={1}
              containerStyle={{height: 100, width: '100%', backgroundColor:theme.backgroundPrimary}}
            >
              <ListItem.Content style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                <Ionicons name="md-shapes-sharp" size={30} color={theme.textColorNotActive} />
                <ListItem.Title style={{color:theme.text, marginLeft:10}}>Create new NFT</ListItem.Title>
              </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setIsVisible(false);
          navigation.navigate('CreateCollectionScreen')}}>
          
            <ListItem
              key={1}
              containerStyle={{height: 100, width: '100%', backgroundColor:theme.backgroundPrimary}}
              
            >
              <ListItem.Content style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                <Ionicons name="md-podium" size={30} color={theme.textColorNotActive} />
                <ListItem.Title style={{color:theme.text, marginLeft:10}}>Create new collection</ListItem.Title>
              </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          
            <ListItem
              key={1}
              containerStyle={{height: 100, width: '100%', backgroundColor:theme.backgroundPrimary}}
            >
              <ListItem.Content>
                <ListItem.Title style={{color:theme.text}}>Close</ListItem.Title>
              </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
        
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 350
  },
  icon: {
    position: "absolute",
    zIndex: 2,
    borderRadius: 25,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
  },
  avatar: {
    position: "absolute",
    bottom: 5,
    left: 30
  },
  details: {
    marginTop: 20,
    marginHorizontal: 10
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1
  },
  verifiedIcon: {
    marginLeft: 10
  },
  description: {
    fontWeight: "bold"
  },
  more: {
    marginTop: 10
  },
  moreText: {
    fontWeight: "bold",
  }
});
export default ItemHeader;
