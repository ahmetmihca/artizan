import { StyleSheet, TouchableOpacity, Image, Dimensions,RefreshControl} from 'react-native';
import React from 'react';
import { Text, View } from '../components/Themed';
import ItemHeader from '../components/ItemHeader';
import { useEffect, useState } from 'react';
import collection_services from '../services/collection_serv';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BottomSheet, ListItem} from '@rneui/themed';
import user_services from '../services/user_serv';
import asset_services from '../services/asset_serv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import NFTCard from '../components/NFTCard';
import utils from '../services/utils';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../hooks/colorSchemeSingleton';
import { useMutex } from 'react-context-mutex';
import Comperator from '../helpers/comperator';
import methods from '../helpers/asset_url';

const compare = new Comperator();
const wait = (timeout:number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function CollectionScreen({ route, navigation } :{route:any, navigation:any}) {
    const connector = useWalletConnect();

    const {props} = route.params;
    const {theme} = useTheme();
    
    const images = collection_services.get_collection_images(props._id);

    const [isVisible, setIsVisible] = useState(false);
    const [userItems, setUserItems] = useState<any>([]);
    const [userJWT, setUserJWT] = useState();
    const width = Dimensions.get('window').width; 
    const [nfts,setNfts] = useState<any>([]);
    const [justOnce, setjustOnce] = useState(true);
    const [isAddVisible, setIsAddVisible] = useState(false);

    // loading
    const [isLoading, setIsLoading] = useState(true);

    // refresh
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setjustOnce(true);
    wait(200).then(() => setRefreshing(false));
  }, []);
  const MutexRunner = useMutex();
  const mutex = new MutexRunner('myUniqueKey1');

    useEffect(() => {
      
    let isCancelled = false;
        
        async function getmetadata()
        {
          setIsLoading(true);
          mutex.lock();
          if(!isCancelled)
            {
              setNfts(nfts =>[]);
            }
          try{
            utils.search(0,"collection", props._id).then(
                (val) => {
                    const coll = val[0];
                    
                    coll.NFTs.map((value) =>{
                        asset_services.get_asset(value.contract, value.tokenID, "meta").then((asset) => {
                            let a = { "asset": asset, "token": value.tokenID, "contract": value.contract }
                            if(!isCancelled)
                            {
                            setNfts(nfts => [...nfts, a]);
                            setjustOnce(false);
                            }
                        });
                    }
                    );
                }
            );

            if(connector.connected)
            {
              user_services.get_user(connector.accounts[0]).then((watch) => {

                if(watch.user.watchlist.includes(props._id))
                {
                  if(!isCancelled)
                  {
                    setWatched(true);

                  }
                }
            })
            }
            setIsLoading(false);
          }catch(e){

          }
            mutex.unlock();

        }
        async function getToken(){
          if(connector.connected)
          {
            user_services.get_user(connector.accounts[0]).then(
            (val) => {
              if(!isCancelled)
              {
                setUserJWT(val);

              }
            }
          )
          }
          
        }
        getToken();
        if(justOnce)
        {
        getmetadata();

        }
        return () => { isCancelled =true};
    }, [refreshing]);
    async function addNFTHandler(){
        setIsVisible(true);
        user_services.get_user(connector.accounts[0]).then((user) => {
            setUserJWT(user.user._id);
            
            user_services.get_nfts(user.user.id).then((nftsList) => {
                nftsList.nfts.map(async (element:any) => {
                    let asset = await asset_services.get_asset(element.contractAddress, element.tokenId, "meta");
                    let a = { "asset": asset, "token": element.tokenId, "contract": element.contractAddress }
                    setUserItems(userItems => [...userItems, a]);
                    
                })
            })
        })
    }
    const [watched, setWatched] = useState(false);
    async function addNFTToCollection(params) {
        setIsVisible(false);
        const token = await  AsyncStorage.getItem("token");
        const x = await collection_services.update_collection(params.token, params.contract,props._id, token);
    }
    function renderUserItems({item}: {item:any})
    {
      if(!compare.doesExistInDict(nfts, 'token',methods.hexToInt(item.token)) || !compare.doesExistInDict(nfts,'contract', item.contract))
      {
        return <TouchableOpacity onPress={() => {addNFTToCollection(item)}}>
            <NFTCard key={item.contract+item.token} props = {{token: item.token, contract: item.contract, asset: item.asset}} style={{width: 150, marginLeft: 10, height: 200}} clickable={false}></NFTCard>
        </TouchableOpacity>
      }
      else{
        console.log("exit1")
      }
        
    }
    function renderNormalItems({item}:{item:any})
    {
        return (<NFTCard key={item.token + item.contract} props = {{token: item.token, contract: item.contract, asset: item.asset}} style={{width: 150, marginLeft: 10, height: 200}} ></NFTCard>);
    }
    async function addToWatchList(){
      if(connector.connected)
      {
        const token = await AsyncStorage.getItem("token");

        const x =await user_services.addWatchlist(token,props._id)
        setWatched(true)


      }
    }
    async function removeFromWatchList(){
        const token = await AsyncStorage.getItem("token");

        const x =await user_services.removeWatchlist(token,props._id)
        setWatched(false)

    }
  return (
    <ScrollView style={styles.exampleStyle} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
      { userJWT && userJWT.user &&userJWT.user._id == props.owner_id &&
        <TouchableOpacity style={[styles.icon, { top: 20, right: 20 }]} onPress={addNFTHandler}>
          <Ionicons name="add-circle-outline" size={30} color={theme.textColorNotActive} />
        </TouchableOpacity>
      }
        
        {
          connector.connected && !watched &&
          <TouchableOpacity style={[styles.icon, { top: 120, right: 20 }]} onPress={addToWatchList}>
          <Ionicons name="eye" size={30} color={theme.textColorNotActive} />
        </TouchableOpacity>
        }
        {
          watched &&
          <TouchableOpacity style={[styles.icon, { top: 120, right: 20 }]} onPress={removeFromWatchList}>
          <Ionicons name="eye" size={30} color={'red'} />
        </TouchableOpacity>
        }
        
      <ItemHeader coverImage={images.banner} image={images.logo} name={props.name} bio ={props.description} title={props.name} editable={false} type={'collection'}
      > </ItemHeader>
        <View style={{flex: 1, alignItems:'center'}}>

            <Text style={[styles.featuredStyle, {color: theme.text}]}>
                Featured
            </Text>
            <Image source={{uri:images.featured}} style={{width:  width*9/10, height: width*18/30,borderRadius: 10,}} ></Image>
            
        </View>
        <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
          {
            nfts && nfts.length != 0 && 
              <Text style={[styles.featuredStyle,{
            backgroundColor: theme.backgroundPrimary,
            color: theme.text,
            marginBottom: 0,
            paddingTop: 20,
            alignItems: 'center',
            justifyContent:'center'
        }]}>Items</Text>
          }
          {
            ((!nfts || nfts.length == 0) && !isLoading) && 
              <Text style={[styles.featuredStyle,{
            backgroundColor: theme.backgroundPrimary,
            color: theme.text,
            paddingTop: 20,
            alignItems: 'center',
            justifyContent:'center',
            fontWeight: 'normal',
            fontSize: 20,
            marginBottom: 50,
            marginTop: 20
        }]}>No items under this collection yet.</Text>
          }
            
        </View>
        
        {
            nfts &&
            <SafeAreaView style ={{backgroundColor: theme.backgroundPrimary}}>
                <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={nfts}
                renderItem={renderNormalItems}
                keyExtractor={item => item.id}
                />
            </SafeAreaView>
        }
        <BottomSheet isVisible={isVisible}>
          
            <ListItem
              key={1}
              containerStyle={{height: 250, width: '100%', backgroundColor:theme.backgroundPrimary}}
            >
              <ListItem.Content style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                <SafeAreaView style ={{backgroundColor: theme.backgroundPrimary}}>
                <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={userItems}
                renderItem={renderUserItems}
                keyExtractor={item => item.id}
                />
            </SafeAreaView>
              </ListItem.Content>
            </ListItem>
        
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  exampleStyle: {
      flex:1,
  },
  featuredStyle:{
      marginBottom: 10,
      fontSize: 24,
      fontWeight:'bold'

  },
  icon: {
    position: "absolute",
    zIndex: 2,
    borderRadius: 25,
    padding: 10,
  },
  
});
