import React, { useEffect } from "react";
import {  StyleSheet, View,Text, TouchableOpacity,Dimensions } from "react-native";
import NFTCard from "../components/NFTCard";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import "../hooks/colorSchemeSingleton";
import { useTheme } from '../hooks/colorSchemeSingleton';
import {FontAwesome } from "@expo/vector-icons";
import { categoriesWithIcons } from "../data/categoriesList";
import Filter from "../helpers/filter";
import Sorter from "../helpers/sorter";
import LoadingIndicator from "../components/loading/LoadingIndicator";
import collection_services from "../services/collection_serv";
import asset_services from "../services/asset_serv";

const windowWidth = Dimensions.get('window').width;
const UserItems = ({ props, loading}: {props: any, loading:boolean}) => {

  const {theme} = useTheme();

  const [data, setData] = useState(props);
  const [collections, setCollections] = useState<any>([]);
  const [filtered, setFiltered] = useState(props);
  const [searchWord, setSearchWord] = useState('');
  const [newestActivated, setNewestActivated] = useState(false);
  const [filter, setFilterer] = useState(new Filter(props));
  const [sorter,setSorter] = useState(new Sorter(props));

  const [categoryStates, setCategoryStates] = useState([false,false,false,false,false]);


  function handleSearch(word){
    setSearchWord(searchWord);
    const fltr = filter.addSearchFilter(data, word);
    
    setFiltered(fltr);
    sorter.setCurrent(fltr);
  }

  useEffect(() => {
    let isCancelled = false;
    console.log(props);
    if(props.length != 0)
    {
      setFiltered(props);
      setData(props);

    }
    else{
      setFiltered(data)
    }
    if(collections.length == 0)
    {
      for(let i = 0  ; i  < data.length ; i++)
      {
        asset_services.get_asset_collection(data.contract, props.token).then(
          (val) => 
          {
            setCollections(collections => [...collections, val]);
          }
        )
        console.log(collections)


      }
    }
    
    
      if(searchWord != "")
      {
        const filtered = filter.addSearchFilter(data, searchWord);
        setFiltered(filtered);
        sorter.setCurrent(filtered);

      }
      
    
    return () => { isCancelled =true};
    }, [props]);

  return (
    
    <View style={{minHeight: 250, backgroundColor: theme.backgroundPrimary}}>
      <View style={[styles.searchContainer,{borderColor: theme.textColorNotActive,
    backgroundColor: theme.backgroundSecondary,}]}>
        <Feather name="search" size={20} color={"grey"} style={styles.icon} />
        <TextInput style={[styles.input,{color: theme.text}]} placeholderTextColor={theme.textColorNotActive} onChangeText={handleSearch} placeholder="Search items" />
      </View>
      <ScrollView horizontal contentContainerStyle={{}} showsHorizontalScrollIndicator={false}>
        
          {
            categoriesWithIcons.map( (value, index) => {
                return <TouchableOpacity onPress={() => {
                  // Why? We need deep copy...
                  let  temp = Array<boolean>();
                  // create a deep copy...
                  categoryStates.forEach((element,idx) => {
                    let current = categoryStates[idx];
                    if(idx === index)
                    {
                      current= !categoryStates[idx];
                      if(current)
                      {
                        const fltr = filter.addCategoryFilter(data, categoriesWithIcons[index].title);
                        console.log("fltr");
                        console.log(fltr);
                        setFiltered(fltr);
                        sorter.setCurrent(fltr);
                      }
                      else{
                        const fltr = filter.removeCategoryFilter(categoriesWithIcons[index].title,data);
                        setFiltered(fltr);
                        sorter.setCurrent(fltr);

                      }
                      
                    }
                    temp.push(current);
                  });
                  setCategoryStates(temp);

                }}
                key ={categoriesWithIcons[index].id}
                style={[ styles.filterStyle,{ backgroundColor: categoryStates[index]? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor}]}
                >
            
              <FontAwesome key={categoriesWithIcons[index].id + "200"} name={value.icon} color={categoryStates[index]? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} ></FontAwesome>
              
              <Text key ={categoriesWithIcons[index].id + "201"} style={{color: !categoryStates[index] ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>{value.title}</Text>
          </TouchableOpacity>
            })
          }
          <TouchableOpacity onPress={() => {
            if(!newestActivated)
            {
              const fltr = sorter.newest();
              setFiltered(fltr);
            }
            else{
              const fltr = sorter.getCurrent();
              setFiltered(fltr);
            }
              setNewestActivated(!newestActivated);
            
            }} style={[ styles.filterStyle,{ backgroundColor: newestActivated? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor, marginRight:15}]}>
            <FontAwesome name="signal" color={newestActivated? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} ></FontAwesome>
            <Text style={{color: !newestActivated ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>Newest Filter</Text>
          </TouchableOpacity>
        
        
      </ScrollView>
      
      {
            filtered && filtered.length !== 0 &&  filtered.map((val:any, index:number) =>{
              if((index + 1) < filtered.length && (index % 2 === 0 ))
              {
                const x  = windowWidth* 47/100;
                return (<View key={index} style={{flexDirection: 'row'}}>
                <NFTCard key={index} props={val} style={{width: x ,marginLeft: windowWidth*2/100}}>
                </NFTCard>
                <NFTCard key={index+1} props={props[index+1]}  style={{width: x , marginLeft: windowWidth*2/100}}></NFTCard>
                </View>);
              }
              else if((index) === filtered.length -1&& (index %2 === 0)){
              return <NFTCard key={index} props={val}  style={{width: windowWidth*47/100,marginLeft: windowWidth*2/100}}></NFTCard>;

              }
              

            }
              
        )
      }
      {
        !loading && filtered.length === 0 && 
        <View style={{backgroundColor: theme.backgroundSecondary,height: 250, alignItems:'center',justifyContent: 'center'}}>
        <Text style={{color: theme.text, fontWeight:'bold', fontSize: 20}}>No  items yet.</Text>
        </View>
      }
      {
        loading &&
        <LoadingIndicator></LoadingIndicator>
      }
    </View>
    
    
  );
};
export default UserItems;
const styles = StyleSheet.create({
  
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
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
  filterStyle:{
    height: 40, 
    alignItems: 'center',
    justifyContent:'center', 
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  filterScroll: {
    flexDirection: 'row', 
    alignItems:'center',
    paddingHorizontal: 10,
  }
});
