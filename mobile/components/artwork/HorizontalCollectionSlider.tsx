import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import asset_services from '../../services/asset_serv';
import { Text, View } from '../Themed';
import NFTCard from '../NFTCard';





export default function HorizontalCollectionSlider({ props, showedPage }: { props:any , showedPage:any}) {


    const [collectionNFTs, setCollectionNFTs] = useState([]);
    const [getOnce, setGetOnce] = useState(true);
    const [token, setToken] = useState(parseInt(showedPage));
    useEffect(() => {
    let isCancelled = false;
        async function getmetadata()
        {
            if(props)
            {
                props.map((value:any) =>{
                        asset_services.get_asset(value.contract, value.tokenID, "meta").then((asset) => {
                            let a = { "asset": asset, "token": value.tokenID, "contract": value.contract }
                            if(!isCancelled)
                            {
                            setCollectionNFTs(collectionNFTs => [...collectionNFTs, a]);
                            setGetOnce(false);
                            }
                        });
                }
            );
            }
          
        }
        if(getOnce)
        {
            getmetadata();
        }

        return () => { isCancelled =true};
    }, []);

    const renderItem = ({item}: {item:any}) => {

        if(token !== item.token)
        {
            return <NFTCard props={item} style={{width: 170, marginLeft: 10}}></NFTCard>;

        }
        return ;
        // return asset_services.get_asset(item.contract, item.tokenID).then((res) =>{
        //     return <NFTCard props={item}></NFTCard>

        // });
    };
    return (
        <SafeAreaView style={styles.container}>
            {
                collectionNFTs && collectionNFTs != [] &&
                <FlatList horizontal data={collectionNFTs} renderItem={renderItem} keyExtractor={(item,index) => index.toString()} showsHorizontalScrollIndicator={false}/>
            }
            
        </SafeAreaView>
        
    );  
}



const styles = StyleSheet.create({
  container: {
      marginBottom: 30,
      width: '100%'
  },
  
});
