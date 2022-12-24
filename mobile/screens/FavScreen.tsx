import React from "react";
import {  StyleSheet, View,Text, TouchableOpacity, Dimensions} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import NFTCard from "../components/NFTCard";
import asset_services from "../services/asset_serv";
import { useEffect,useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Chip } from "@rneui/themed";
import { useTheme } from '../hooks/colorSchemeSingleton';
import {FontAwesome } from "@expo/vector-icons";
import { categoriesWithIcons } from "../data/categoriesList";
import LoadingIndicator from "../components/loading/LoadingIndicator";
const windowWidth = Dimensions.get('window').width;
const FavScreen = ({props, user_id}: {props: any}) => {

  const {theme} = useTheme();

  const [nftsBackup, setNftsBackup] = useState<any>([]);
  console.log(props);

  const [nfts, setNfts] = useState<any>([]);
  const connector = useWalletConnect()
  const [newestActivated, setNewestActivated] = useState(false);
  const [categoryStates, setCategoryStates] = useState([false,false,false,false,false]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let isCancelled = false;
        const fetchNfts = async () => {
            setNfts([]);
            setNftsBackup([]);
            await props.map(async (element:any ) => {
                let asset = await asset_services.get_asset(element.contract, element.tokenID, "meta");

                let a = { "asset": asset, "token": element.tokenID, "contract": element.contract }
                if(!isCancelled)
                {
                  setNfts(nfts => [...nfts, a]);
                  setNftsBackup(nftsBackup =>[...nftsBackup, a]);
                }
            });
            setIsLoading(false);
        };
        fetchNfts();

        if(newestActivated && nfts){
          let list = nfts;

         list = list.sort(function(a:any, b:any) {
          return a.token - b.token;
        });
        
        setNfts(list)
        

      }
        return () => { isCancelled =true};
    }, [newestActivated]);
    const x  = windowWidth* 47/100;
    
  return (
    
    <View style={{ backgroundColor: theme.backgroundPrimary, paddingTop:15}}>
      <ScrollView horizontal contentContainerStyle={styles.filterScroll} showsHorizontalScrollIndicator={false}>
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
          <TouchableOpacity onPress={() => {setNewestActivated(!newestActivated)}} style={[ styles.filterStyle,{ backgroundColor: newestActivated? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor, marginRight:15}]}>
            <FontAwesome name="signal" color={newestActivated? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive} ></FontAwesome>
            <Text style={{color: !newestActivated ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>Newest Filter</Text>
          </TouchableOpacity>
      </ScrollView>
      
      {
        !!isLoading &&
        <View style={{height: 300, backgroundColor: theme.backgroundPrimary, width: '100%'}}>
          <LoadingIndicator></LoadingIndicator>
        </View>
      }
       {
            nfts &&  nfts.map((val:any, index:number) =>{
              if((index + 1) < props.length && (index % 2 === 0 ))
              {
                return <View key={index} style={{flexDirection: 'row'}}>
                <NFTCard key={index} props={val} favable={true}  style={{width: x , marginLeft: x*2/47}}>
                </NFTCard>
                <NFTCard key={index+1} props={nfts[index+1]} favable={true}  style={{width: x , marginLeft: x*2/47}}></NFTCard>
                </View>
              }
              else if((index) === props.length -1&& (index %2 === 0)){
              return <NFTCard style={{width: x , marginLeft: windowWidth*2/100}} key={index} props={val} favable={ !user_id || connector.accounts[0] === user_id ? true : false} ></NFTCard>;

              }

            }
              
        )
      } 
      
      {
        props && props.length === 0 &&
        <View style={{backgroundColor: theme.backgroundPrimary,height: 250, alignItems:'center',justifyContent: 'center'}}>
        <Text style={{color: theme.text, fontWeight:'bold', fontSize: 20}}>No favorited items yet.</Text>

        </View>
      }
    </View>
    
    
  );
};
export default FavScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
