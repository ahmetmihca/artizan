import React from "react";
import { ScrollView, StyleSheet, View,Text} from "react-native";
import NFTCard from "./NFTCard";
import asset_services from "../services/asset_serv";
import { useEffect,useState } from "react";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import user_services from "../services/user_serv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleCollection } from "./ProfileCollections";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./../hooks/colorSchemeSingleton";

const WatchList = ({props}) => {
  const {theme} = useTheme();
  const [nfts, setNfts] = useState<any>([]);
  useEffect(() => {
    let isCancelled = false;
        const fetchNfts = async () => {
            const token = await AsyncStorage.getItem("token")
            user_services.get_my_watchlist(token).then((val)=> {
                setNfts(val);
            });
            

        };
        fetchNfts();
        return () => { isCancelled =true};
    }, []);
    const renderCollections =  ({item}) => {
        return <SingleCollection  props={item} style= {{marginLeft: 10, width: 250}}></SingleCollection>;
    }

  return (
    
    <View style={{flex: 1, flexDirection:'column', minHeight: 300, backgroundColor: theme.backgroundPrimary}}>
      {
            nfts &&  
            <SafeAreaView style ={{backgroundColor: theme.backgroundPrimary}}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={nfts}
                    renderItem={renderCollections}
                    keyExtractor={item => item._id}
                />
            </SafeAreaView>

              
      }
      {
        props && props.length === 0 &&
        <View style={{backgroundColor: theme.backgroundSecondary,height: 250, alignItems:'center',justifyContent: 'center'}}>
        <Text style={{color: theme.text, fontWeight:'bold', fontSize: 20}}>No favorited items yet.</Text>

        </View>
      }
    </View>
    
    
  );
};
export default WatchList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
