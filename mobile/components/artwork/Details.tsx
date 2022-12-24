import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../Themed';
import { useTheme } from "../../hooks/colorSchemeSingleton";
import { ListItem} from '@rneui/themed';
import collection_services from '../../services/collection_serv';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BuyButton from '../buttons/BuyButton';
import BidButton from '../buttons/BidButton';
const etherIcon = <Icon name='ethereum' size={25} color='#444971' style={{paddingRight:5, elevation:5}} />;

export default function Details({chain, contractAddress, tokenStandards, tokenId, collection, price, auction}: {chain:string, contractAddress:string, tokenStandards:string, tokenId:string, collection: any, price:any, auction?: boolean | undefined}) {

  const {theme} = useTheme();
  /* States that handles Accordions */
  const [aboutCollection, setaboutCollection] = useState(false);
  const [details, setDetails] = useState(false);
  const [priceHistory, setPriceHistory] = useState(false);
  const collectionImages = collection_services.get_collection_images(collection._id);

  const navigation = useNavigation();
  const handleCollectionNavigate = () =>{
    navigation.navigate("CollectionScreen",{props:collection});
  }
  return (
    <View style={{flex:1, backgroundColor: theme.backgroundPrimary}}>
      {/* Accordion for About Collection */}
      <ListItem.Accordion 
              content={
                  <>
                  {
                  <ListItem.Content >
                      <ListItem.Title style={{color: theme.text}}>About Collection</ListItem.Title>
                  </ListItem.Content>
                  }
                  </>
              }
              
              isExpanded={aboutCollection}
              onPress={() => {
                  setaboutCollection(!aboutCollection);
              }}
              containerStyle ={[styles.accordionStyle, {backgroundColor: theme.backgroundSecondary,}]}
      >
        
      {
        collection && collection != {} &&
        <ListItem containerStyle={[styles.aboutCollectionContainer,{backgroundColor: theme.backgroundPrimary,}]}>
        <ListItem.Content>
          {/* on click go to collection */}
          <TouchableOpacity style={styles.aboutCreator} onPress={handleCollectionNavigate}>
                <Image source={{uri: collectionImages.logo}} style={styles.profilePictureStyle}></Image>
                <Text style= {[styles.aboutCollectionUserText,{color: theme.linkColor}]}>{collection.name}</Text>

          </TouchableOpacity>
          {/* Collection description */}
          <Text>{collection.description}</Text>
          </ListItem.Content>
        </ListItem>
      }
      {
        !collection || collection == {} || collection._id == "" &&
        <ListItem containerStyle={[styles.aboutCollectionContainer, {justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundPrimary}]}>
          
          <ListItem.Content>
            <ListItem.Title style={{position:'absolute',top: -100,left: 0}}>
          
          <Text >This item does not belong to any collection.</Text>
          
          </ListItem.Title>
          
          </ListItem.Content>
        
        </ListItem>
      }


      </ListItem.Accordion>
        {/* Details Accordion */}

      <ListItem.Accordion 
        content={
            <>
            {
            <ListItem.Content >
                <ListItem.Title style={{color: theme.text}}>Details</ListItem.Title>
            </ListItem.Content>
            }
            </>
        }
        
        isExpanded={details}
        onPress={() => {
            setDetails(!details);
        }}
        containerStyle ={[styles.accordionStyle, {backgroundColor: theme.backgroundSecondary,}]}
      >
        {/* Details of NFT after opening ACCORDION */}

      <ListItem containerStyle={[styles.aboutCollectionContainer,{backgroundColor: theme.backgroundPrimary,}]}>
        <ListItem.Content>
          <View style={styles.table}>
            <Text>Contract Address</Text>
            <View style={styles.tableRHS}>
              <TouchableOpacity>
                <Text style={{color:theme.linkColor}}>{contractAddress.substring(0,15)+'..'}</Text>

              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.table}>
            <Text>Token ID</Text>
            <View style={styles.tableRHS}>
              {
                typeof tokenId !== typeof 'string '&&
                <Text>{tokenId}</Text>

              }
              {
                typeof tokenId === typeof 'string '&&
                <Text>{tokenId.substring(0,15)}</Text>

              }
            </View>
          </View>
          <View style={styles.table}>
            <Text>Token Standards</Text>
            <View style={styles.tableRHS}>
              <Text>{tokenStandards}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text>Blockchain</Text>
            <View style={styles.tableRHS}>
              <Text>{chain}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text>Metadata</Text>
            <View style={styles.tableRHS}>
              <Text>Decentrealized</Text>
            </View>
          </View>
          
        </ListItem.Content>
      </ListItem>
      </ListItem.Accordion>
      {/* Price History Accordion */}
      <ListItem.Accordion 
              content={
                  <>
                  {
                  <ListItem.Content >
                      <ListItem.Title style={{color: theme.text}}>{auction ? 'Bid' : 'Buy'}</ListItem.Title>
                  </ListItem.Content>
                  }
                  </>
              }
              
              isExpanded={priceHistory}
              onPress={() => {
                  setPriceHistory(!priceHistory);
              }}
              containerStyle ={[styles.accordionStyle, {backgroundColor: theme.backgroundSecondary,}]}
      >
        {/* Price history, not implemented */}
        
      <ListItem containerStyle={[styles.aboutCollectionContainer,{backgroundColor: theme.backgroundPrimary, minHeight: 100}]}>
        <ListItem.Content>
          { price && price !=0 && !auction &&
            <View style={{flexDirection:'row', alignItems: 'center'}}>
              {etherIcon}
              <Text style={{color: theme.text, fontWeight: 'bold', marginRight: 20, fontSize: 22}}>{price}</Text>
              <BuyButton contract={contractAddress} token={tokenId} price={price}></BuyButton>


            </View>
          }
          { auction &&
            <View style={{flexDirection:'row', alignItems: 'center'}}>
              <Text style={{color: theme.text, fontWeight: 'bold', marginRight: 20, fontSize: 22}}>{'Last Bid: ' + price}</Text>
              <BidButton token={tokenId}></BidButton>


            </View>
          }
           {
             
            !price || price == 0 && !auction &&
            <Text>This item is not on sale!</Text>
          }
        </ListItem.Content>
      </ListItem>
        
      </ListItem.Accordion>
    </View>
  );
}



const styles = StyleSheet.create({
  accordionStyle: {
    height: 100,
    marginBottom: 2
  },
  aboutCollectionContainer:{
    marginBottom: 2
  },
  
  aboutCollectionUserText:{
    fontSize: 18,
    marginLeft: 10,
  },
  profilePictureStyle:{
    width:50,
    height: 50,
    borderRadius:50,
  },
  aboutCreator:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20
  },
  table:{
    width: '100%',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'transparent',
  },
  tableRHS:{
    width: '40%',
    backgroundColor:'transparent'
  }
  
});
