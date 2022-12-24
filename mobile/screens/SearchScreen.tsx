import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { RootTabScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import React, { useState, useEffect } from "react";
import Section from "../components/Section";
import Card from "../components/Card";
import UserProfileCard from "../components/UserProfileCard";
import data from "../data/mockData";
import { Feather } from "@expo/vector-icons";
import utils from '../services/utils';
import ProfileCollections, { SingleCollection } from '../components/ProfileCollections';
import { FlatList,ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import NFTCard from '../components/NFTCard';
import { useTheme } from '../hooks/colorSchemeSingleton';


export default function SearchScreen({ navigation }: RootTabScreenProps<'SearchScreen'>) {

  const {theme} = useTheme();

  const [searchWord, setSearchWord]  = useState<string>('');
  const [collections, setCollections] = useState<any>();
  const [users, setUsers] = useState<any>([]);
  const [assets, setAssets] = useState<any>([]);

  useEffect(() => {
    let isCancelled = false;
    const getCollections = async () => {

            let cll = await utils.search(searchWord, 'collection', 0);
            if(!isCancelled)
            {
              setCollections(cll);
              getUsers();
              
            };
    };
    const  getUsers = async () => {
      let cll = await utils.search(searchWord, 'user', 0);
      if(!isCancelled)
        {
          setUsers(cll);
          getArts()
        }
    };
    const  getArts = async () => {
      let cll = await utils.search(searchWord, 'asset', 0);
      if(!isCancelled)
        {
          setAssets(cll);
        }
    };
    if(searchWord.length > 1)
    {
      getCollections()

    }

    
    return () => { isCancelled =true};
    }, [searchWord]);

   

  const renderCollections = ({ item }) => (
    <SingleCollection props ={item} style={{width: 150, marginLeft: 10}}></SingleCollection>
  );
  const renderUsers = ({ item }) => (
    <UserProfileCard id ={item.id} username={item.username}></UserProfileCard>
  );
  const renderAssets = ({ item }) => (
    <NFTCard props = {{token: item.tokenID, contract: item.contract, asset: item.metadata}} style={{width: 150, marginLeft: 10}}></NFTCard>
  );
  return (
    <ScrollView style={[styles.container,{backgroundColor: theme.backgroundPrimary}]}>

      <Text style={styles.title}>Search</Text>

      <View style={[styles.searchContainer,{borderColor: theme.textColorNotActive, backgroundColor: theme.backgroundSecondary}]}>
      <Feather name="search" size={20} color={"grey"} style={styles.icon} />
      <TextInput style={[styles.input,{color: theme.text}]} placeholderTextColor={theme.textColorNotActive} onChangeText={setSearchWord} placeholder="Search items" />
      </View>
      {
        searchWord.length < 4 && 
        <Section
        title="All categories"
        titleStyle={[styles.sectionTitle,{color: theme.text}]}
        containerStyle={styles.sectionContainer}
        DataComponent={Card}
        data={data.categories}
      />
      }
      
      {
         collections && collections.length != 0 && 
         <SafeAreaView>
           <Text style={[styles.relatedCollections,{color: theme.text}]}>Related Collections</Text>
           <FlatList
              horizontal
              data={collections}
              renderItem={renderCollections}
              keyExtractor={item => item._id}
            />
         </SafeAreaView>
      }
      {
         users && users.length != 0 && 
         <SafeAreaView>
           <Text style={[styles.relatedCollections,{color: theme.text}]}>Related Users</Text>
           <FlatList
              horizontal
              data={users}
              renderItem={renderUsers}
              keyExtractor={item => item.id}
            />
         </SafeAreaView>
      }
      {
         assets && assets.length != 0 && 
         <SafeAreaView style = {{marginBottom: 70}}>
           <Text style={[styles.relatedCollections,{color: theme.text}]}>Related Assets</Text>
           <FlatList
              horizontal
              data={assets}
              renderItem={renderAssets}
              keyExtractor={item => item.tokenID}
            />
         </SafeAreaView>
      }
      
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  },
  sectionContainer: {
    borderTopWidth: 0.3,
    marginTop: 25
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 0,
  },
  relatedCollections: {
    fontSize: 18,
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 15,
  },
  secondSectionContainer: {
    marginTop: 0,
    marginVertical: 0
  },
  
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 55,
    width: "90%",
    alignSelf: "center"
  },
  icon: {
    padding: 10
  },
  input: {
    height: 60,
    width: "100%",
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 40,
    textAlign: 'center'
  }
});
