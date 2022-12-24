import React, { useState } from "react";
import { StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect } from "react";
import user_services from "../../services/user_serv";
import {get_nonce, login} from '../../services/login_serv.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import UserItems from "../UserItems";
import ItemHeader, {ItemHeaderSkeleton}from "../../components/ItemHeader";
import asset_services from "../../services/asset_serv";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import TabBar from "../../components/tabbar/TabBar";
import FavScreen from "../FavScreen";
import methods from "../../helpers/asset_url";
import { useMutex } from 'react-context-mutex';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from '@rneui/themed';
import ProfileCollections from "../../components/ProfileCollections";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/colorSchemeSingleton";
import WatchList from '../../components/WatchList';
import ItemActivity from "../../components/artwork/ItemActivity";
import trade_services from "../../services/market_serv";
import LoginHandler from "../../hooks/LoginHandler";

const wait = (timeout:number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function ProfileScreen({ route, navigation } :{route:any, navigation:any}) {
  const {theme} = useTheme();


  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
      return connector.connect();
    }, [connector]);

  const [user_nfts, setUserNfts] = useState<any>([]);
  const [onSale_nfts, setOnSale] = useState<any>([]);
  const [auction_nfts, setAuctionNfts] = useState<any>([]);
  const [created, setCreated] = useState<any>([]);
  const [isUserNftsLoading,setIsUserNftsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(undefined);
  const [refreshing, setRefreshing] = React.useState(false);
  const [favorited, setFavorited] = React.useState([]);

  const loginHandled = LoginHandler();

  const MutexRunner = useMutex();


  const mutex = new MutexRunner('myUniqueKey1');




  const [newLogin, setNewLogin] = useState(false);
  
  
  async function handleLogin(){
    await connectWallet();
    setNewLogin(true);
  }
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
  useEffect(() => {
    let isCancelled = false;
    
    async function handleToken()
    {
      const token = await AsyncStorage.getItem("token");
      if(token == null)
      {

      }
    } 

    const fetch_user_nfts = async () => {
            mutex.lock();
            if(!isCancelled)
            {
              setUserNfts(user_nfts =>[]);
              setOnSale(onSale_nfts => []);
              setCreated(created => []);
              setAuctionNfts(auction_nfts => []);
            }
            user_services.get_user(connector.accounts[0]).then(
              (usr) =>{
                console.log(usr)
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
                      let asset = await asset_services.get_asset(element.contractAddress, element.tokenId);
                      let a = { "asset": asset, "token": element.tokenId, "contract": element.contractAddress }
                      if(!isCancelled)
                      {
                        setUserNfts(user_nfts => [...user_nfts, a]);
                      }
                
                    });
                    
                    setIsUserNftsLoading(false);
                    
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
                      const already = !alreadyAdded(list[iterator].tokenID, tempList);
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
                trade_services.getMarketItems(usr.user.id, true).then(
                  (val) =>
                  {
                    val.map(async (element:any ) => {
                    let asset = await asset_services.get_asset(element.contract, element.token);
                    let a = { "asset": asset, "token": element.token, "contract": element.contract }
                    if(!isCancelled)
                    {
                      setAuctionNfts(auction_nfts => [...auction_nfts, a]);
                    }
              
                  });
                  }

                )
                trade_services.getMarketItems(usr.user.id).then(
                (val) =>{
                  val.map(async (element:any ) => {
                    let asset = await asset_services.get_asset(element.contract, element.token);
                    let a = { "asset": asset, "token": element.token, "contract": element.contract }
                    if(!isCancelled)
                    {
                      setOnSale(onSale_nfts => [...onSale_nfts, a]);
                    }
              
                  });
                }
              );
              }
            );
            mutex.unlock();
    };

    if(refreshing)
    {
      setIsUserNftsLoading(true);
    }
    
    if(newLogin)
    {
      handleToken();
    }
    if(connector.connected)
    {
      mutex.run(() => fetch_user_nfts());
    }
    
        return () => { isCancelled =true};
    }, [refreshing,newLogin]);


  const killSession = React.useCallback(async () => {
    await AsyncStorage.removeItem("token");
    return connector.killSession();
  }, [connector]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(() => setRefreshing(false));
  }, []);
  const walletIcon = <Icon name='wallet' size={100} color={theme.blue}></Icon>;
  const logOut = <Ionicons onPress={killSession} style={{
    zIndex: 3, position: 'absolute', top: 220, right: 30
  }} name='ios-exit-outline' size={30} color={theme.blue}></Ionicons>;
  return (
    <View style={{flex:1}}>
      
      {
        connector.connected &&
        <ScrollView contentContainerStyle={[styles.container,{backgroundColor: theme.backgroundSecondary}]} showsVerticalScrollIndicator={false} refreshControl={
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
        <ItemHeader id={user.id} {...{name: user.name, title:user.username,bio: user.bio, image: 'http://10.50.116.36:3001/public/users/'+user.id + "_avatar.png", coverImage:'http://10.50.116.36.77:3001/public/users/' +user.id + "_banner.png", verified:false }} />
      }
      {
        connector.connected && 
        
              logOut

      }
      
      <View style={[styles.details,{backgroundColor: theme.backgroundSecondary}]}>
        <View style={[styles.detail,{backgroundColor: theme.backgroundSecondary}]}>
          <Text style={[styles.price, {backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{user_nfts.length}</Text>
          <Text style={[styles.description,{color: theme.textColorNotActive,}]}>Items</Text>
        </View>
        <View style={[styles.detail, {marginLeft: 30,backgroundColor: theme.backgroundSecondary}]}>
          {
            user && 
          <Text style={[styles.price, {backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{user.favoriteNFTs.length}</Text>

          }
          {
            !user && 
          <Text style={[styles.price, {backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>0</Text>

          }
          <Text style={[styles.description,{color: theme.textColorNotActive}]}>Favorites</Text>
        </View>
        
        <View style={[styles.detail, {marginLeft: 30,backgroundColor: theme.backgroundSecondary}]}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, {backgroundColor: theme.backgroundSecondary, color: theme.textColorNotActive}]}>{created.length}</Text>
          </View>
          <Text style={[styles.description,{color: theme.textColorNotActive,}]}>Created</Text>
        </View>
      </View>
      {
        !user_nfts &&
        <ActivityIndicator></ActivityIndicator>
      }
      {
        user_nfts  && user && 
        <TabBar tabProps={[{name: "Items",icon:"list" },{name: "Created",icon:"paint-brush" },{name: "On Sale",icon:"money" },{name: "On Auction",icon:"connectdevelop" },{name: "Collections",icon:"clone" },{name: "Watchlist",icon:"eye"},{name: "Favorited",icon:"heart"},{name: "Activity",icon:"line-chart"},{name: "Offers",icon:"list-ul"}]} screens={[<UserItems props={user_nfts} loading={isUserNftsLoading}></UserItems>,<UserItems props={created} loading={isUserNftsLoading}></UserItems>,<UserItems props={onSale_nfts} loading={isUserNftsLoading}></UserItems>,<UserItems props={auction_nfts} loading={isUserNftsLoading}></UserItems>,<ProfileCollections></ProfileCollections>,<WatchList props={user}></WatchList>, <FavScreen props={user.favoriteNFTs}></FavScreen>,<ItemActivity id={user.id} check={false}></ItemActivity>,<FavScreen props={user.favoriteNFTs}></FavScreen>]}></TabBar>
      }
      
      
      
    </ScrollView>
      }
      {
        !connector.connected&&
          <View style ={{backgroundColor:theme.backgroundPrimary, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {
              walletIcon
            }
            <Text style={{color: theme.text, fontSize: 20, marginTop: 20}}>No wallets found.</Text>
            <Button
              title="Connect with Metamask"
              buttonStyle={{
                backgroundColor: 'rgba(78, 116, 289, 1)',
                borderRadius: 3,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 20,
              }}
              onPress={
                handleLogin
              }
            />
          </View>

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
    marginVertical: 0,
    justifyContent: "space-around",
    alignItems: "center"
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,

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
    letterSpacing: 0,
    marginBottom: 0
  },
  description: {
    fontWeight: "bold"
  }
});
