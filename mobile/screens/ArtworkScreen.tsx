import { StyleSheet, Image ,TouchableOpacity,Dimensions,RefreshControl  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import Details from '../components/artwork/Details';
import  TabBar  from '../components/tabbar/TabBar';
import Offers from '../components/artwork/Offers';
import Listings from '../components/artwork/Listings';
import HorizontalCollectionSlider from '../components/artwork/HorizontalCollectionSlider';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/buttons/BackButton';
import ItemActivity from '../components/artwork/ItemActivity';
import methods from '../helpers/asset_url';
import asset_services from '../services/asset_serv';
import user_services from '../services/user_serv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./../hooks/colorSchemeSingleton";
import SellNft from '../components/artwork/SellNft';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import LoadingIndicator from '../components/loading/LoadingIndicator';
import Timer from '../components/artwork/Timer';
import { ItemHeaderSkeleton } from '../components/ItemHeader';
import { Dialog } from '@rneui/themed';
import AccountList from '../components/account-showers/AccountList';
const screenHeight = Dimensions.get('window').height;
const windowHeight= Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

let likeQ = false;
export default function ArtworkScreen({ route, navigation } :{route:any, navigation:any} ){
  
  const connector = useWalletConnect();
  const Listing = [
    {from:"Sadi", amount:1,quantity:1,expirationDate: new Date("2023-01-04")},
    {from:"Sadi", amount:1,quantity:1,expirationDate: new Date("2023-01-04")},
    {from:"Sadi", amount:1,quantity:1,expirationDate: new Date("2023-01-04")},
    {from:"Sadi", amount:1,quantity:1,expirationDate: new Date("2023-01-04")}
  ];

  const {theme} = useTheme();

  const [itemDetails, setItemDetails] = useState<any>(undefined);
  const [creator, setCreator] = useState<any>({});
  const [isLiked, setLiked] = useState<boolean>(false);
  const [collection, setCollection] = useState({_id:''});
  const [once, setOnce] = useState(false);
  const [ownersVisible, setOwnersVisible] = useState(false);
  const {props} = route.params;

  const [saveProps, setSaveProps] = useState(props);
  const ownersIcon = <Icon name='md-people-circle-outline' size={20} color={theme.textColorNotActive} ></Icon>
  const heartIcon = <Icon name='ios-heart-outline' size={20} color={theme.textColorNotActive} ></Icon>
  const copyIcon = <Icon name='md-copy-outline' size={20} color={theme.textColorNotActive} ></Icon>
  console.log(itemDetails);
  const urlM = props&& props.asset ? methods.convert_img(props.asset.imgURL): 'https://dictionary.cambridge.org/tr/images/thumb/rubber_noun_002_31667.jpg?version=5.0.244';
  useEffect(() => {
        
        let isCancelled = false;
        async function checkData() {
              
          try{
            asset_services.get_asset(saveProps.contract, saveProps.token).then((result:any)=> {
                if(!isCancelled)
                {
                  if(!isCancelled)
                  {
                  console.log("here")
                  if(result && result.owner && typeof result.owner != "string")
                  {
                    let newList = methods.eliminateRepeats(result.owner);
                    console.log("atleast")
                    console.log(newList);
                    result.owner = newList;

                  }
                  setItemDetails(result);
                  console.log("here")
                  console.log(itemDetails)
                  
                  }
                  try{
                    asset_services.get_asset_collection(saveProps.contract, saveProps.token).then((res) =>{
                    if(!isCancelled)
                    {
                      setCollection(res);
                    }
                  })
                  ;
                  }catch(e){
                    console.log("error on getting collection");
                  }
                  
                  try{
                    if(saveProps && saveProps.asset.creator)
                    {
                      user_services.get_user(saveProps.asset.creator).then((creatorTemp) => {

                      if(!isCancelled)
                      {
                        setCreator(creatorTemp);

                      }
                      });
                    }
                    else{
                      console.log("31")
                      user_services.get_user(result.creator).then((creatorTemp) => {

                      if(!isCancelled)
                      {
                        setCreator(creatorTemp);

                      }
                      });
                      // user_services.get_creator()
                    }
                    
                    
                  }catch(e){
                    console.log("error on getting creator");
                  }

                }
              });
          }catch(e)
          {
            console.log("get asset error");
          }
              
          }
        async function getLikedData(){
          const token = await AsyncStorage.getItem("token");
          let likes:any[] = [];
          await user_services.get_my_favorites(token).then((likesTemp) =>{
            likes = likesTemp;
          });
          for(let i  = 0 ; i  < likes.length ; i++)
          {
            if(likes[i].contract === props.contract && likes[i].tokenID == 
            parseInt(props.token,16) )
            {
              if(!isCancelled)
              {
              setLiked(true);
                break;
              }
            }
          }
          setOnce(true);
        }
        if(!once)
        { 
          getLikedData();
          checkData();

        }
        
        return () => { isCancelled =true};
         

    }, []);
  
  const [biddingTime, setBiddingTime] = useState<string| undefined>();
  
  const [size, setSize] = useState({width:100, height:100});
  const width = size.width * ((windowHeight-40)/2)/size.height;
  const marginLeft = (windowWidth- width)/2;

  const [processSize,setProcessSize] =useState({width: '100%', height: undefined,aspectRatio: 1 })
  
  function toggleOwners()
  {
    setOwnersVisible(!ownersVisible);
  }

  async function handleLike(isLiked:boolean){
    const token = await  AsyncStorage.getItem("token");
    while(likeQ);
    if(isLiked)
    {
      likeQ = true;
      await user_services.addFavoriteNft(props.contract, props.token, token);
      likeQ = false;

    }
    else{
      likeQ = true;
      await user_services.removeFavoriteNft(props.contract, props.token, token);
      likeQ = false;
    }
  }
  function like()
  {
    setLiked(!isLiked);

    handleLike(!isLiked);
  }
  return (
    <View style={{flex:1, height: screenHeight}}>
      <View style ={{position: 'absolute',top: 30, left: 30, zIndex: 10, backgroundColor:'transparent'}}>
          <BackButton></BackButton>
      </View>
       {
        connector.connected && itemDetails && itemDetails.owner && (connector.accounts[0].toLocaleLowerCase() === itemDetails.owner || (typeof itemDetails.owner != "string" && itemDetails.owner.includes(connector.accounts[0].toLocaleLowerCase()))) &&
        <SellNft props={{contract: props.contract, tokenID: props.token, theme: theme}}></SellNft>
      } 
       {
        (itemDetails && itemDetails.owner) ?
        <Dialog
          isVisible={ownersVisible}
          onBackdropPress={toggleOwners}
          overlayStyle={{backgroundColor: theme.backgroundSecondary, padding: 0}}
          style={{backgroundColor: theme.backgroundSecondary}}
        >
          
          <AccountList props={{owners: itemDetails&& itemDetails.owner ? itemDetails.owner: []}} theme={theme}></AccountList>
        </Dialog> :null
      } 
        
      <ScrollView  scrollEventThrottle={16} style={{marginTop:70}}>
        
        <View style={[styles.artworkFirstView]}>
          <View style={{width: windowWidth, height: 400, justifyContent: 'center'}}>
             <Image source={{uri:urlM}} style={{flex:1, width: undefined, height: undefined, resizeMode:'contain'}}></Image> 

          </View>
          {
            props && props.collectionName && 
            <Text style={[styles.marginLeft, styles.collectionName,{color: theme.linkColor}]}>{props.collectionName}</Text>

          }
          { props && props.asset && props.asset.name &&
            <Text style={[styles.marginLeft, styles.nftName, {color: theme.text}]}>{props.asset.name}</Text>
          } 
          <View style={[styles.sideBySide, styles.marginLeft, {marginBottom: 10}]}>
            <Text style={{color: theme.textColorNotActive}}>Created by </Text>
            {
              creator && creator != {} && creator.user &&creator.user.username && 
              <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfileScreen",{props:{id: creator.user.id}})}>
                <Text style={{color: theme.linkColor}}>{ creator.user.username.length > 15 ? creator.user.username.substring(0,15) +'..':creator.user.username}</Text>
              </TouchableOpacity>

            } 
          </View>
            {
            props && props.asset && props.asset.description ?
            <Text style={[styles.marginLeft]}>{props.asset.description == ""?"No Description": props.asset.description}</Text>: null

          }   
          {/* {
            props && props.asset && props.asset.description &&
            <Text style={[styles.marginLeft]}>sfsd</Text>
          } */}

          <View style={[styles.sideBySide,{justifyContent:'center', alignItems: 'center', marginTop: 20}]}>
            <View style={styles.aboutNFTBox}>
              {
                heartIcon
              }
              {
                itemDetails && itemDetails.favorited != undefined &&
                <Text>{itemDetails.favorited}</Text>
              } 
              {
                (!itemDetails || itemDetails.favorited === undefined) &&  
                <Text>0</Text>
              }
              <Text style={[styles.aboutNFTBoxDescriptive,{color:theme.textColorNotActive}]}>Likes</Text>
            </View>
            {
              itemDetails && itemDetails.owner &&
              <TouchableOpacity style={styles.aboutNFTBox} onPress={toggleOwners}>
              {
                ownersIcon
              }
              <Text>{itemDetails && typeof itemDetails.owner =="string" ? 1 :itemDetails.owner.length}</Text>
              <Text style={styles.aboutNFTBoxDescriptive}>Owners</Text>
            </TouchableOpacity>
            }
            
            {
              props.asset.amount ? 
              <View style={styles.aboutNFTBox}>
              {
                copyIcon
              }
              <Text>{props.asset.amount}</Text>
              <Text style={styles.aboutNFTBoxDescriptive}>Editions</Text>
            </View>: 
              <View style={styles.aboutNFTBox}>
              {
                copyIcon
              }
              <Text>{1}</Text>
              <Text style={styles.aboutNFTBoxDescriptive}>Editions</Text>
            </View>
            }
            
          </View>
          {
            itemDetails && itemDetails.onBidding && 
            <Timer theme={theme} props={{time: itemDetails.auctionEnds}}></Timer>
          } 
          
        </View>
        {
          itemDetails && itemDetails.contract && 
          <TabBar tabProps={[{name:'Details', icon: 'bars'},{name:'Offers', icon: 'tag'},{name:'Listings', icon: 'list'},{name:'Item Activity', icon: 'line-chart'}]} props={[]} screens={[<Details auction={itemDetails.onBidding} collection={collection} chain={itemDetails.chain} contractAddress={itemDetails.contract.address} tokenId={props.token} tokenStandards={itemDetails.contract.type} price={itemDetails.price ? itemDetails.price : itemDetails.highestBid ?  parseInt(itemDetails.highestBid) / (10**18): undefined}></Details>, <Offers props={itemDetails.onBidding ? itemDetails.bidHistory.reverse(): []}></Offers>, <Listings props={Listing}></Listings>, <ItemActivity check={true} props={itemDetails.activity}></ItemActivity>]}></TabBar>
        }  
         { (!itemDetails ||  !itemDetails.contract) &&
          <TabBar tabProps={[{name:'Details', icon: 'bars'},{name:'Offers', icon: 'tag'},{name:'Listings', icon: 'list'},{name:'Item Activity', icon: 'line-chart'}]} props={[]} screens={[<LoadingIndicator></LoadingIndicator>,<LoadingIndicator></LoadingIndicator>,<LoadingIndicator></LoadingIndicator>]}></TabBar>
        } 
        {
          collection && collection != {} && collection._id != "" &&
          <Text style={[styles.moreOfCollection, {color: theme.text}]}>More from this collection</Text>

        }
        {
          collection && collection != {} && collection.NFTs && 
          <HorizontalCollectionSlider props ={collection.NFTs} showedPage={props.token}></HorizontalCollectionSlider>
        }
        {
          !collection || collection == {} || !collection.NFTs &&
          <View style={{backgroundColor: theme.backgroundPrimary, height: 150, width:'100%'}}></View>
        } 
        
      
      
    </ScrollView>
      <TouchableOpacity style={{backgroundColor: 'transparent', position: 'absolute', right: 30, top: 30}} onPress={like}>
        {
          isLiked == false && <Icon name='ios-heart-outline' size={30} color={theme.textColorNotActive} ></Icon>
        }
        {
          isLiked && <Icon name='ios-heart' size={30} color={'red'} ></Icon>
        }
    </TouchableOpacity> 
    
    </View>
  );
}

const styles = StyleSheet.create({
  artworkFirstView: {
    height: windowHeight*9/10,
  },
  moreOfCollection: {
    fontSize: 18,
    paddingTop: 30,
    paddingLeft: 10,
    fontWeight: "bold"
  },
  imgStyle: {
    width: '100%',
    height: undefined,
    aspectRatio: 1
  },
  sideBySide:{
    flexDirection: 'row'
  },
  marginLeft: {
    marginLeft: 10
  },
  collectionName: {
    fontSize: 16,
    marginTop: 20
  },
  nftName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10
  },
  aboutNFTBox: {
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 20,
    padding: 10,
  },
  aboutNFTBoxDescriptive:{
  }
 
  
});
