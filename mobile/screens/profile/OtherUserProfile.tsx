import React, { useState } from "react";
import { StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect } from "react";
import user_services from "../../services/user_serv";
import { ScrollView } from "react-native";
import UserItems from "../UserItems";
import ItemHeader, {ItemHeaderSkeleton}from "../../components/ItemHeader";
import asset_services from "../../services/asset_serv";
import TabBar from "../../components/tabbar/TabBar";
import FavScreen from "../FavScreen";
import methods from "../../helpers/asset_url";
import { useMutex } from 'react-context-mutex';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import ItemActivity from "../../components/artwork/ItemActivity";


const wait = (timeout:number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function OtherUserProfileScreen({ route, navigation } :{route:any, navigation:any}) {

  const {theme} = useTheme();
  const [user_nfts, setUserNfts] = useState<any>([]);
  const [user, setUser] = useState<any>(undefined);
  const [refreshing, setRefreshing] = React.useState(false);
  const [created, setCreated] = useState<any>([]);

  function alreadyAdded(token, tempList)
  {
    for(let i =  0 ; i < tempList.length ; i++)
    {
      if(token == tempList[i].token)
      {
        return true;
      }
    }
    return false;
  }
  const MutexRunner = useMutex();
  const mutex = new MutexRunner('myUniqueKey1');
  const {props} = route.params;
  
  
  useEffect(() => {
    let isCancelled = false;
    const fetch_user_nfts = async () => {

            mutex.lock();
            if(!isCancelled)
            {
              setUserNfts(user_nfts =>[]);

            }
            user_services.get_user(props.id).then(
              (usr) =>{
                for(let i = 0 ; i < usr.user.favoriteNFTs.length ; i++)
                {
                  let hex = methods.decToHex(usr.user.favoriteNFTs[i].tokenID);

                  usr.user.favoriteNFTs[i].tokenID = '0x'+'0'.repeat(64 -hex.length) + hex;
                }
                if(!isCancelled)
                {
                  setUser(usr.user);
                }
                user_services.get_nfts(usr.user.id).then(
                  (nftsList)=>{
                    nftsList.nfts.map(async (element:any ) => {
                      let asset = await asset_services.get_asset(element.contractAddress, element.tokenId, "meta");
                      let a = { "asset": asset, "token": element.tokenId, "contract": element.contractAddress }
                      if(!isCancelled)
                      {
                        setUserNfts(user_nfts => [...user_nfts, a]);

                      }
                
                    });
                    
                  }
                );
                user_services.get_user_created_nfts(usr.user.id).then(
                  (list) =>
                  {
                    let tempList : any = [];
                    for(let iterator = 0 ; iterator < list.length ; iterator++)
                    {
                      let a = { "asset": 
                      list[iterator].metadata, "token": list[iterator].tokenID, "contract": list[iterator].contract }
                      console.log("here with " + list[iterator].tokenID.toString())
                      const already = !alreadyAdded(list[iterator].tokenID, tempList);
                      console.log(already);
                      if(already)
                      {
                        tempList.push(a);
                      }
                    }
                    if(!isCancelled)
                    {
                      setCreated(tempList);
                    }
                  }
                )
              }
            );
            mutex.unlock();
    };
    fetch_user_nfts();
    
        return () => { isCancelled =true};
    }, [refreshing]);



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(() => setRefreshing(false));
  }, []);
  const walletIcon = <Icon name='wallet' size={100} color={theme.blue}></Icon>;

  return (
    <View style={{flex:1}}>
      {
        <ScrollView contentContainerStyle={[styles.container,{backgroundColor: theme.backgroundPrimary}]} showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
      {
        !user && 
        <ItemHeaderSkeleton></ItemHeaderSkeleton>
      }
      {
        user && 
        <ItemHeader {...{name: user.name, title:user.username,bio: user.bio, image: 'http://10.50.116.36:3001/public/users/'+user.id + "_avatar.png", coverImage:'http://10.50.116.36:3001/public/users/' +user.id + "_banner.png", verified:false, editable: false }} />
      }
      
      
      <View style={[styles.details, {backgroundColor: theme.backgroundSecondary}]}>
        <View style={[styles.detail,{backgroundColor: theme.backgroundSecondary}]}>
          <Text style={[styles.price,{backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{user_nfts.length}</Text>
          <Text style={[styles.description,{color: theme.text}]}>Items</Text>
        </View>
        <View style={[styles.detail, {marginLeft: 30,backgroundColor: theme.backgroundSecondary}]}>
          {
            user && 
          <Text style={[styles.price,{backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{user.favoriteNFTs.length}</Text>

          }
          {
            !user && 
          <Text style={[styles.price,{backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{0}</Text>

          }
          <Text style={[styles.description,{color: theme.text,backgroundColor: theme.backgroundSecondary}]}>Favorites</Text>
        </View>
        
        <View style={[styles.detail, {marginLeft: 30,backgroundColor: theme.backgroundSecondary}]}>
          <View style={[styles.priceContainer,{backgroundColor: theme.backgroundSecondary}]}>
            <Text style={[styles.price,{color: theme.textColorNotActive}]}>{created.length}</Text>
          </View>
          <Text style={[styles.description,{color: theme.text,backgroundColor: theme.backgroundSecondary}]}>Created</Text>
        </View>
      </View>
      {
        !user_nfts &&
        <ActivityIndicator></ActivityIndicator>
      }
      {
        user_nfts  && user && created &&
        <TabBar tabProps={[{name: "Items",icon:"list" },{name: "Created",icon:"paint-brush" },{name: "Favorited",icon:"heart"},{name: "Activity",icon:"line-chart"},{name: "Offers",icon:"list-ul"}]} screens={[<UserItems props={user_nfts}></UserItems>, <UserItems props={created}></UserItems>,<FavScreen props={user.favoriteNFTs} user_id={user.id}></FavScreen>,<ItemActivity check={false} props={undefined} id={user.id}></ItemActivity>,<FavScreen props={user.favoriteNFTs}></FavScreen>]}></TabBar>
      }
      
      
      
    </ScrollView>
      }
      
    </View>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  icons: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-around",
    alignItems: "center"
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10
  },
  detail: {
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 5
  },
  description: {
    fontWeight: "bold"
  }
});
