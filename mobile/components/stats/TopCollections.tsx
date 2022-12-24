import { StyleSheet, TouchableOpacity,Text, View, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ListItem} from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Avatar from '../Avatar';
import utils from '../../services/utils';
import TabBarConstant from '../tabbar/TabBarConstant';
import collection_services from '../../services/collection_serv';
import { Dimensions } from 'react-native';
import user_services from '../../services/user_serv';
import { useNavigation } from '@react-navigation/native';
import methods from '../../helpers/asset_url';
import CurrencyAsText from '../CurrencyAsText';
import asset_services from '../../services/asset_serv';
import currency_serv from '../../services/currency_serv';
import ItemActivity from '../artwork/ItemActivity';
const windowWidth = Dimensions.get('window').width;


const etherIcon = <Icon name='ethereum' size={20} color='#444971' style={{paddingRight:3, elevation:5}} />;

        
export function SingleStats({props, type = "price", statType="collection"}:{props:any, type?: string, statType?: string})
{
  const [user, setUser] = useState<any | undefined>(undefined);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  useEffect(() => {
    if(statType == "collection")
    {
      setLogo(collection_services.get_collection_images(props._id).logo);
    }
    
    
    
    console.log(props);

    async function getOwner() {
      if(props.wallet_id)
      {
        let owner =  props.wallet_id;
        if(!owner)
        {
          owner = props[0];
        }
        try{
           user_services.get_user(owner).then((val) =>
           {
             setUser({id: val.user.id ,username:val.user.name, _id: val.user._id})
           }
           )
        }
        catch(e){
          console.log(e);
        }
        
      }
    }
    getOwner();
  }, []);

  const {theme} = useTheme();
  const [expanded, setExpanded] = useState(false);
  const watchIcon = statType == "collection" ? <Icon name='eye' size={20} color={theme.text} style={{paddingRight:3, elevation:5}} />: statType == "asset" ? <Icon name='heart' size={20} color={theme.text} style={{paddingRight:3, elevation:5}} />: <Icon name='artstation' size={20} color={theme.text} style={{paddingRight:3, elevation:5}} />;
  const navigation = useNavigation();
  function handleNavigation(val:string)
  {
    navigation.navigate('OtherUserProfileScreen', {props: {id:val}});
  }
  return(
      <ListItem.Accordion 
              content={
                  <>
                  {
                    <View style={[styles.singleCollectionContainer,{backgroundColor: theme.backgroundSecondary}]}>
                      <View style={styles.lhs}>
                        {/* go to collection page */}
                        <TouchableOpacity style={styles.lhs}> 
                          <Text style={[styles.seq,{color: theme.text}]}>{props.seq}</Text>
                          {
                            !props.metadata && logo && 
                            <Avatar style={undefined} online={false} image={logo} circle></Avatar>
                          }
                          {
                            props && props.metadata && 
                            <Avatar style={undefined} online={false} image={methods.convert_img(props.metadata.imgURL)} circle></Avatar>
                          }
                          {
                            statType == "creator" && user &&
                            <Avatar style={undefined} online={false} image={methods.convert_img('http://10.50.116.36:3001/public/users/'+user.id + "_avatar.png")} circle></Avatar>
                          }
                          
                        </TouchableOpacity>
                        
                        <View style={{marginLeft: 8}}>
                          {/* go to collection page */}
                          {
                            statType != "creator" &&
                              <TouchableOpacity>
                                <Text numberOfLines={2} style={[styles.collectionName,{color: theme.text}]}>{props.name ? props.name: (props.metadata ? props.metadata.name : '')}</Text>
                            </TouchableOpacity>
                          }
                          {
                            statType == "creator" && user &&
                            <TouchableOpacity>
                              <Text numberOfLines={2} style={[styles.collectionName,{color: theme.text}]}>{user.username}</Text>
                          </TouchableOpacity>
                          }
                          

                          <TouchableOpacity onPress={() => (setExpanded(!expanded))} style={{width: 100}}>
                            <Text style={{color: theme.textColorNotActive}}>{expanded ? '- less': '+ more'}</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {
                        type == "watch" &&
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          {
                            watchIcon
                          }
                          <Text style={[styles.price,{color: theme.text,}]}>{statType == "collection" ? props.watched: props.favorited}</Text>
                          
                        </View>
                        <Text style={[styles.price,{color:parseFloat(props.priceIncrease) > 0 ? 'green': 'red'}]}>{props.priceIncrease}</Text>
                      </View>
                      }
                      {
                        statType == "creator" &&
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          
                          <Text style={[styles.price,{color: theme.text,}]}>{props.nft_count}</Text>
                          
                        </View>
                        <Text style={[styles.price,{color:parseFloat(props.priceIncrease) > 0 ? 'green': 'red'}]}>{props.priceIncrease}</Text>
                      </View>
                      }
                      {
                        type == "price" && 
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          {
                            etherIcon
                          }
                          <Text style={[styles.price,{color: theme.text,}]}>{props.sumPrice}</Text>
                          
                        </View>
                        <Text style={[styles.price,{color:parseFloat(props.priceIncrease) > 0 ? 'green': 'red'}]}>{props.priceIncrease}</Text>
                      </View>
                      }
                      
                      
                    </View>
                  }
                  </>
              }
              
              isExpanded={expanded}
              
              containerStyle ={[styles.accordionStyle,{backgroundColor: theme.backgroundSecondary,}]}
      >
        
        <ListItem containerStyle={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
          <ListItem.Content style={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
            {
              type == "price" && 
              <View style={styles.tableWrapper}>
              
                <Text style={{color: theme.textColorNotActive}}>24h%</Text>
                <Text style={[{color:parseFloat(props.last24H) > 0 ? 'green': 'red'}]}>{props.last24H}</Text>
              </View>
            }
            
            {
              type == "price" && 
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Floor Price</Text>
                <Text style={{color: theme.text}}>{props.floorPrice}</Text>
              </View>
            }
            
            {
              type == "price" && 
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Owners</Text>
                <Text style={{color: theme.text}}>{props.owners}</Text>
              </View>
            }
            {
              type == "watch" && user &&
              <TouchableOpacity style={styles.tableWrapper} onPress={() => handleNavigation(props.wallet_id)}>
                <Text style={{color: theme.textColorNotActive}}>Owner</Text>
                <Text style={{color: theme.blue}}>{user.username}</Text>
              </TouchableOpacity>
            }
            {
              type == "watch"&&
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>{statType == "collection" ? "Watched" : statType == "asset" ? "Favorited" : "Created"}</Text>
                <Text style={{color: theme.text}}>{statType == "collection" ? props.watched : statType =="asset" ? props.favorited : props.nft_count}</Text>
              </View>
            }
            {
              statType == "asset" && props.tokenID &&
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Token ID</Text>
                <Text style={{color: theme.text}}>{props.tokenID}</Text>
              </View>
            }
            {
              statType == "asset" && props.contract && 
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Contract</Text>
                <Text style={{color: theme.text}}>{props.contract.substr(0,5) + '..' + props.contract.substr(props.contract.length-3)}</Text>
              </View>
            }
            {
              statType == "collection" &&
              <View style={styles.tableWrapper}>
              <Text style={{color: theme.textColorNotActive}}>Items</Text>
              <Text style={{color: theme.text}}>{props.NFTCount}</Text>
            </View>
            }
            
          </ListItem.Content>
        </ListItem>
        </ListItem.Accordion>
  );
}
function SingleNFTStat({props, theme, currency} : {props:any, theme:any, currency:any})
{
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<any>(undefined);
  useEffect(
    () => {
      async function getNFTDetails()
      {
        asset_services.get_asset(props.contract, props.tokenID).then(
          (val) => 
          {
            setData(val);
          }
        )
      }
      getNFTDetails()
    },[]
  )
  return(
      <ListItem.Accordion 
              content={
                  <>
                  {
                    <View style={[styles.singleCollectionContainer,{backgroundColor: theme.backgroundSecondary}]}>
                      <View style={styles.lhs}>
                        {/* go to collection page */}
                        {
                          data && 
                          <TouchableOpacity style={styles.lhs}> 
                          <Text style={[styles.seq,{color: theme.text}]}>{props.seq}</Text>
                            <Avatar style={undefined} online={false} image={methods.convert_img( data.imgURL)} circle></Avatar>
                          
                        </TouchableOpacity>
                        }
                        
                        
                        <View style={{marginLeft: 8}}>
                          
                          {
                            data && 
                            <TouchableOpacity>
                                <Text numberOfLines={2} style={[styles.collectionName,{color: theme.text}]}>{data.name}</Text>
                            </TouchableOpacity>
                          }
                              
                          
                          

                          <TouchableOpacity onPress={() => (setExpanded(!expanded))} style={{width: 100}}>
                            <Text style={{color: theme.textColorNotActive}}>{expanded ? '- less': '+ more'}</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          
                          <Text style={[styles.price,{color: theme.text,}]}>{}</Text>
                          
                        </View>
                        <Text style={[styles.price,{color:parseFloat(props.priceIncrease) > 0 ? 'green': 'red'}]}>{props.priceIncrease}</Text>
                      </View>
                      }
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          {
                            etherIcon
                          }
                          <Text style={[styles.price,{color: theme.text,}]}>{parseInt(props.value)/10**18}</Text>
                          
                        </View>
                        <Text style={[styles.price,{color:parseFloat(props.priceIncrease) > 0 ? 'green': 'red'}]}>{props.priceIncrease}</Text>
                      </View>
                      
                      
                    </View>
                  }
                  </>
              }
              
              isExpanded={expanded}
              
              containerStyle ={[styles.accordionStyle,{backgroundColor: theme.backgroundSecondary,}]}
      >
        
        <ListItem containerStyle={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
          <ListItem.Content style={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
              
            
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>{currency[1]}</Text>
                <CurrencyAsText amount={ (parseInt(props.value)/10**18) * currency[0][currency[1]]} currency={'USD'}></CurrencyAsText>
              </View>
            
              
              
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Token ID</Text>
                <Text style={{color: theme.text}}>{props.tokenID}</Text>
              </View>
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Contract</Text>
                <Text style={{color: theme.text}}>{props.contract.substr(0,5) + '..' + props.contract.substr(props.contract.length-3)}</Text>
              </View>
            
            
          </ListItem.Content>
        </ListItem>
        </ListItem.Accordion>
  );
}
function SingleCollectionStat({props, logo, theme, currency} : {props:any, logo: undefined | string, theme:any, currency:any})
{
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<any>({props: props, logo: logo});
  const [creator, setCreator] = useState(props.wallet_id);
  useEffect(
    () => {
      console.log(logo)
      async function getCreator()
      {
        try{
          user_services.get_user(data.props.wallet_id).then(
            (res) =>
            {
              console.log(res);
              setCreator(res.user.username);
            }
          )
        }catch(e)
        {

        }
      }
      getCreator();
    },[]
  )
  return(
      <ListItem.Accordion 
              content={
                  <>
                  {
                    <View style={[styles.singleCollectionContainer,{backgroundColor: theme.backgroundSecondary}]}>
                      <View style={styles.lhs}>
                        {/* go to collection page */}
                        {
                          data && 
                          <TouchableOpacity style={styles.lhs}> 
                            <Avatar style={undefined} online={false} image={data.logo} circle></Avatar>
                          
                        </TouchableOpacity>
                        }
                        
                        
                        <View style={{marginLeft: 8}}>
                          
                          {
                            data && 
                            <TouchableOpacity>
                                <Text numberOfLines={2} style={[styles.collectionName,{color: theme.text}]}>{data.props.name}</Text>
                            </TouchableOpacity>
                          }
                              
                          
                          

                          <TouchableOpacity onPress={() => (setExpanded(!expanded))} style={{width: 100}}>
                            <Text style={{color: theme.textColorNotActive}}>{expanded ? '- less': '+ more'}</Text>
                          </TouchableOpacity>
                        </View>
                        

                      </View>
                      
                        <View style={styles.rhs}>
                        <View style={styles.priceWrapper}>
                          {
                            etherIcon
                          }
                          <Text style={[styles.price,{color: theme.text,}]}>{parseInt(props.totalValue)/10**18}</Text>
                          
                        </View>
                        
                      </View>
                      
                      
                    </View>
                  }
                  </>
              }
              
              isExpanded={expanded}
              
              containerStyle ={[styles.accordionStyle,{backgroundColor: theme.backgroundSecondary,}]}
      >
        
        <ListItem containerStyle={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
          <ListItem.Content style={[styles.details,{backgroundColor: theme.backgroundSecondary,}]}>
              
            
              <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>{currency[1]}</Text>
                <CurrencyAsText amount={ (parseInt(props.totalValue)/10**18) * currency[0][currency[1]]} currency={'USD'}></CurrencyAsText>
              </View>
            
              
              {
                creator&& 
                <View style={styles.tableWrapper}>
                <Text style={{color: theme.textColorNotActive}}>Creator</Text>
                <Text style={{color: theme.text}}>{creator.length > 10 ? creator.substr(0,5) + '..' + creator.substr(creator.length-2): creator}</Text>
              </View>
              }
              
              
              
            
            
          </ListItem.Content>
        </ListItem>
        </ListItem.Accordion>
  );
}
function CollectionStatsPrice()
{
  const {theme} = useTheme();

  const [data, setData] = useState<any>([]);
  const [logo, setLogo] = useState<any>(undefined);
  const [currency, setCurrency] = useState<any>(['Ether', 1]);
  const statTypes = [
      {name: 'collection', icon: 'billiards-rack'},
      {name: 'asset', icon: 'deviantart'},
  ];
  // State
  const [type, setType] = useState<string>("asset");
  useEffect(
    () => 
    {
      async function getTopNFTs() {
        utils.getTop('nft').then(
          (val) =>
          {
            setData(val);
          }
        )
      }
      async function getTopCollections(){
        try{
          utils.getTop("collection").then(
            (val) =>
            {
             
              setData(val);
            }
          )
        }catch(e)
        {

        }
        
      }
      async function getCurrency()
      {
        currency_serv.get_current_rate().then(
          (val) => {
            setCurrency(val);
          }
        )
      }
      console.log(type);
      if(type == "asset")
      {
        getTopNFTs()
      }
      else if(type == "collection")
      {
        getTopCollections()
      }
      getCurrency()
    }, [type]
  )

  const renderNFT = (item:any,index:number) => {
    if(type == "asset")
    {
      return (<SingleNFTStat currency={currency} theme={theme} key={item.contract + item.tokenID.toString()} props={item}></SingleNFTStat>);
    }
    else {
       let lg = collection_services.get_collection_images(item._id);
       return (<SingleCollectionStat logo={lg.logo} currency={currency} theme={theme} props={item}></SingleCollectionStat>)
    }
  }
  
  

  return (
    <View>
      <ScrollView horizontal style={{flexDirection:'row', backgroundColor: theme.backgroundSecondary}} showsHorizontalScrollIndicator={false}>
          {
            statTypes.map((element,index) =>
              (
                <TouchableOpacity key={index.toString() + "touch"} onPress={() => {setData(undefined);setType(element.name)}} style={[ styles.filterStyle,{ backgroundColor: element.name == type? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor, marginRight:15}]}>
                  <Icon key={index.toString() + "icon"}  size={20} name={element.icon} color={element.name == type? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive}></Icon>
                  <Text key={index.toString() + "text"} style={{color: element.name != type ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>{element.name.substring(0,1).toUpperCase() + element.name.substring(1)}</Text>
                </TouchableOpacity>
              )

            )
          }
      </ScrollView>
      {
        data &&
        <FlatList
      renderItem={({item,index}) => {return renderNFT(item,index)}}
      data = {data}
      keyExtractor={(item,index) => (index.toString() + type + new Date().getTime().toString())}
      />
      }
      
    </View>
    
  );
}


function WatchCollections(){
  const {theme} = useTheme();
  const [data, setData] = useState<Array<any> | undefined>(undefined);

  const [type, setType] = useState<string>("asset");
  useEffect(() => {
    let isCancelled = false;
    async function getTopCollections() {
      const response = await utils.stats(1,"collection");
      if(!isCancelled)
      {
        setData(response);
      }
    }
    async function getTopAssets() {
      const response = await utils.stats(1,"asset");
      if(!isCancelled)
      {
        console.log(response)
        setData(response);
      }
    }
    async function getTopCreators() {
      const response = await utils.getTop("creator");
      if(!isCancelled)
      {
        console.log(response)
        setData(response);
      }
    }
    console.log("here");
    if(type == "collection")
    {
      getTopCollections();
    }
    else if(type == "asset")
    {
      getTopAssets()
    }
    else if(type == "creator")
    {
      getTopCreators();
    }

    return () => { isCancelled =true};
  }, [type]);

  function handleType()
  {

  }
  
  

  const statTypes = [
    {name: 'collection', icon: 'billiards-rack'},
    {name: 'asset', icon: 'deviantart'},
    {name: 'creator', icon: 'account-circle'},
  ]

  
  const renderSingleCollection = (item:any,index:number) => 
  {
    if(type == "asset")
    {
      return (<SingleStats statType={type} type={'watch'} key={item.tokenID.toString()} props={item}></SingleStats>);
    }
    else if(type == "collection")
    {
      console.log(item)
      return (<SingleStats statType={type} type={'watch'} key={item._id} props={item}></SingleStats>);
    }
    else{
      return (<SingleStats statType={type} type={'watch'} key={item[0]} props={{wallet_id: item[0],nft_count: item[1]}}></SingleStats>);
    }
  }

  return (
    <View>
      <ScrollView horizontal style={{flexDirection:'row', backgroundColor: theme.backgroundSecondary}} showsHorizontalScrollIndicator={false}>
          {
            statTypes.map((element,index) =>
              (
                <TouchableOpacity key={index.toString() + "touch"} onPress={() => { setData(undefined);setType(element.name)}} style={[ styles.filterStyle,{ backgroundColor: element.name == type? theme.buttons.checkButton.activeBackground : theme.buttons.checkButton.passiveBackground, borderColor: theme.buttons.checkButton.borderColor, marginRight:15}]}>
                  <Icon key={index.toString() + "icon"}  size={20} name={element.icon} color={element.name == type? theme.buttons.checkButton.textColorActive : theme.buttons.checkButton.iconColorPassive}></Icon>
                  <Text key={index.toString() + "text"} style={{color: element.name != type ? theme.buttons.checkButton.textColorPassive: theme.buttons.checkButton.textColorActive, paddingLeft: 5}}>{element.name.substring(0,1).toUpperCase() + element.name.substring(1)}</Text>
                </TouchableOpacity>
              )

            )
          }
            
          
        
      
      </ScrollView>
      {
        data && 
        <FlatList
        renderItem={({item,index}) => {return renderSingleCollection(item,index)}}
        keyExtractor={(item,index) => (index.toString() + type + new Date().getTime().toString()+ '_watch')}
        data = {data}
      />
      }
      
    </View>
    
  );
}


export default function TopCollections() {

  
  const {theme} = useTheme();

  return (
      <TabBarConstant style={{width: windowWidth/2}} tabProps={[{name: 'Watch', icon: 'eye'},{name: 'Price', icon:'money'}]}
    screens={[<WatchCollections></WatchCollections>, <CollectionStatsPrice></CollectionStatsPrice>]}
  ></TabBarConstant>
    
  )
}


const styles = StyleSheet.create({
  accordionStyle:{
    width: '100%',
    marginBottom: 2,
  },
  singleCollectionContainer: {
    height: 80,
    width: '100%',
    marginBottom: 2,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  lhs:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  rhs:{
    alignItems: 'center',
    justifyContent:'center'
  },
  collectionName: {
    fontWeight: 'bold',
    fontSize: 18,
    overflow: 'hidden',
    width: 200
    
  },
  seq:{
    fontSize: 24,
    fontWeight:'bold',
    marginRight: 5,
  },
  price: {
    fontWeight: '600'
  },
  details:{
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  tableWrapper:{
    justifyContent: 'center',
    alignItems:'center'
  },
  priceWrapper:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  filterStyle:{
    height: 40, 
    alignItems: 'center',
    justifyContent:'center', 
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  
});
