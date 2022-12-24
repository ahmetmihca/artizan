import { StyleSheet, TouchableOpacity,TextInput, Linking} from 'react-native';
import { Text } from '../Themed';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { View } from '../Themed';
import { Alert } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import trade_services from '../../services/market_serv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { Share } from 'react-native';
import ShareButton from './ShareButton';
const BidButton = ({token}: {token: string}) =>{
    const connector = useWalletConnect();
    const {theme} = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation();
    const [price, setPrice] = useState('');
    const [transactionDone, setTransactionDone] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');
  const sellIcon = <Icon name="hand-paper-o" size={30} color={theme.blue} style={
    { elevation:5, backgroundColor:'transparent'}} />;
    const approveIcon = <Icon name="thumbs-up" size={30} color={theme.blue} style={
    { elevation:5, backgroundColor:'transparent'}} />;
    async function handleBid(){
        //check if connected
        
      try{
        let userToken = await AsyncStorage.getItem("token");
        if(userToken == null)
        {
          Alert.alert("You need to login first");
          return;
        }
        let transactionContract = await trade_services.sendBidOffer(token, price,userToken);
          const transactionRes = await connector.sendTransaction({
            to: transactionContract.to,
            from: connector.accounts[0],
            data: transactionContract.data,
            gas: '0x493E0',
            value: '0x' + (parseFloat(price) * 1e18).toString(16)
          });
          setTransactionDone(true);
          setTransactionHash(transactionRes)
          transactionAlert(transactionRes);

    }
    catch{
    
    }
    }
    async function transactionAlert({transactionRes}: {transactionRes:Object})
    {
        // 'https://ropsten.etherscan.io/tx/' 
    }
    function makeAlert(){
        if(price.length != 0)
        {
            Alert.alert(
            "Are you sure?",
            "You are bidding this NFT with with "+ price + " ETH",
            [
                {
                text: "Cancel",
                style: "cancel"
                },
                { text: "OK", onPress: () => {handleBid(); setIsVisible(false)} }
            ]
            );
        }
        else{
            Alert.alert(
            "Price is empty",
            "You must decide a price",
            [
                
                { text: "OK", onPress: () => {} }
            ]
            );
        }
        
    }
  return (
      <View style={{alignItems:'center'}}>
        
          {
              !transactionDone &&
              <TouchableOpacity onPress={() => {setIsVisible(!isVisible)}} style={[styles.button,{backgroundColor: theme.backgroundSecondary, borderColor: theme.blue}]}>
                {   
                    sellIcon
                }
           
            </TouchableOpacity>
          }
          {transactionDone &&
            <View style={{width: '100%', flexDirection:'row', backgroundColor: theme.backgroundPrimary, justifyContent:'flex-start',  }}>
                <View style={{width: '100%',backgroundColor: theme.backgroundPrimary, justifyContent:'center'}}>
                    <Text style={{color: theme.text}}>Your transaction is pending.</Text>
                    <TouchableOpacity onPress={() => {Linking.openURL('https://ropsten.etherscan.io/tx/'+transactionHash)}}>
                        <Text style={{color:theme.linkColor}}>{('https://ropsten.etherscan.io/tx/'+transactionHash).substring(0,35) +'..'}</Text>
                    </TouchableOpacity>
                </View>
                
                <ShareButton props={{msg: 'https://ropsten.etherscan.io/tx/'+transactionHash}}></ShareButton>
            </View>
            
          }
          
          <BottomSheet isVisible={isVisible}>
          
            <ListItem
              key={1}
              containerStyle={{height: 75, width: '100%', backgroundColor:theme.backgroundPrimary, alignItems:'center', justifyContent:'center'}}
            >
              <ListItem.Content style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                <TextInput style={[styles.input,{backgroundColor: theme.backgroundSecondary, color: theme.text}]} placeholderTextColor={theme.textColorNotActive} onChangeText={setPrice} placeholder="Price" />
                <TouchableOpacity onPress={() => {makeAlert()}} style={[styles.button,{backgroundColor: theme.backgroundPrimary, borderColor: theme.blue, marginLeft: 10}]}>
                {
                    approveIcon
                }
                </TouchableOpacity>
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
      
      </View>
        
  );
}
export default BidButton;


const styles = StyleSheet.create({
  button: {
    width: 55,
    flexDirection:'row',
    height: 60,
    borderRadius: 3,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.3,
  },
  input: {
    height: 60,
    width: "75%",
    marginTop: 15,
    paddingLeft: 10,
    borderRadius: 8
  },
  
});
