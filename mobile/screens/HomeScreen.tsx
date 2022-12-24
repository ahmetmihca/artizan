import React, { useContext } from 'react';
import { View } from '../components/Themed';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { RootTabScreenProps } from '../types';
import { useState,useEffect } from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import mockData from '../data/mockData';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { SingleCollection } from '../components/ProfileCollections';
import collection_services from '../services/collection_serv';
import { Text } from '../components/Themed';
import utils from '../services/utils';
import asset_services from '../services/asset_serv';
import NFTCard from '../components/NFTCard';
import '../hooks/useColorScheme';
import "../hooks/colorSchemeSingleton";
import { useTheme } from '../hooks/colorSchemeSingleton';
import FeaturedPremium from '../components/premium/artizan-premium-homepage';
import JWT from '../helpers/token_helper';
import LoginHandler from '../hooks/LoginHandler';


export default function HomeScreen({ navigation }: RootTabScreenProps<'HomeScreen'>) {
  const {theme} = useTheme();
  const [collections, setCollections] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]);

  const renderCollections = ({ item }) => (
    <SingleCollection props ={item} style={{width: 230, marginLeft: 10}}></SingleCollection>
  );
  useEffect(() => {
    let isCancelled = false;
         collection_services.get_collections().then(
            (val) =>{
                setCollections(val);
                // 62724804a8ed3a8d8473e578
                utils.search(0,"collection", '62724804a8ed3a8d8473e578').then(
                (val) => {
                    const coll = val[0];
                    coll.NFTs.map((value) =>{
                        asset_services.get_asset(value.contract, value.tokenID, "meta").then((asset) => {
                            let a = { "asset": asset, "token": value.tokenID, "contract": value.contract }
                            if(!isCancelled)
                            {
                            setNfts(nfts => [...nfts, a]);;
                            }
                        });
                    }
                    );

                    
                });
            }
         )
    return () => { isCancelled =true};
    }, []);
    function renderUserItems({item})
    {
        return <TouchableOpacity onPress={() => {navigation.navigate('ArtworkScreen',{props:item} )}}>
            <NFTCard props = {{token: item.token, contract: item.contract, asset: item.asset}} style={{width: 200, marginLeft: 10, height: 250}} clickable={false}></NFTCard>
        </TouchableOpacity>
    }
  return (
        <ScrollView style={[styles.container, {backgroundColor: theme.backgroundPrimary}]}>
          <FeaturedPremium theme={theme}></FeaturedPremium>
      <Section
        title="All categories"
        titleStyle={[styles.sectionTitle,{color: theme.text}]}
        containerStyle={styles.sectionContainer}
        DataComponent={Card}
        data={mockData.categories}
      />
      <Text style={[styles.title,{color: theme.text}]}>Some Collections</Text>

      <View style={{marginTop: 20}}>
        <FlatList
                horizontal
                data={collections}
                renderItem={renderCollections}
                keyExtractor={(item,index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                />
      </View>
            
              
      <Text style={[styles.title,{color: theme.text}]}>Featured</Text>
      <Text style={[styles.title, {color:theme.textColorNotActive, paddingTop: 10}]}>Best of Vincent van Gogh</Text>

      <View style={{marginTop:20}}>
        <FlatList
                horizontal
                data={nfts}
                renderItem={renderUserItems}
                keyExtractor={(item,index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                />
      </View>
            
              
    </ScrollView>

  );
}
const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
   sectionContainer: {
    marginTop: 25
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 0,
  },
});
