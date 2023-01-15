import { StyleSheet, TouchableOpacity,TextInput, Linking} from 'react-native';
import { Text } from '../Themed';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState,useEffect } from 'react';
import { View } from '../Themed';
import { Alert } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import trade_services from '../../services/market_serv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LogBox } from 'react-native';
import ShareButton from './ShareButton';
import time_helpers from '../../helpers/timehelpers';
const AuctionButton = ({token, contract}: {token: string, contract: string}) =>{
    const connector = useWalletConnect();
    const {theme} = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [price, setPrice] = useState('');
    const [transactionDone, setTransactionDone] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])

  const sellIcon = <Icon name="legal" size={30} color={theme.blue} style={
    { elevation:5, backgroundColor:'transparent'}} />;
    const approveIcon = <Icon name="thumbs-up" size={30} color={theme.blue} style={
    { elevation:5, backgroundColor:'transparent'}} />;
    async function handleAuction(){
        //check if connected
        
      try{
        let userToken = await AsyncStorage.getItem("token");
        if(userToken == null)
        {
          Alert.alert("You need to login first");
          return;
        }
        let myDate = date;
        myDate.setHours(time.getHours());
        myDate.setMinutes(time.getMinutes());
        myDate.setSeconds(time.getMinutes());
        let transactionContract = await trade_services.create_auction(contract, token,price, myDate.getTime(),userToken);
        try{
          const transactionRes = await connector.sendTransaction({
            to: transactionContract.to,
            from: transactionContract.from,
            data: transactionContract.data,
            gas: '0x493E0',
            value: '0x2386F26FC10000'
          });
          setTransactionDone(true);
          setTransactionHash(transactionRes)
          transactionAlert(transactionRes);
        }
        catch{

        }
          

    }
    catch{
    
    }
    }
    async function transactionAlert({transactionRes}: {transactionRes:Object})
    {
        // 'https://mumbai.polygonscan.com/tx/' 
    }
    function makeAlert(){
        if(price.length != 0)
        {
            Alert.alert(
            "Are you sure?",
            "You are aucting this NFT with mibimum price "+ price + " ETH",
            [
                {
                text: "Cancel",
                style: "cancel"
                },
                { text: "OK", onPress: () => {handleAuction(); setIsVisible(false)} }
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
            <View style={{width: '100%', flexDirection:'row', backgroundColor: theme.backgroundSecondary, justifyContent:'flex-start',  }}>
                <View style={{position: 'absolute', zIndex: 1, top: -50, right:0,backgroundColor: theme.backgroundSecondary, height: 50, borderRadius: 15, padding: 10, justifyContent:'center'}}>
                    <Text style={{color: theme.text}}>Your transaction is pending.</Text>
                    <TouchableOpacity onPress={() => {Linking.openURL('https://mumbai.polygonscan.com/tx/'+transactionHash)}}>
                        <Text style={{color:theme.linkColor}}>{('https://mumbai.polygonscan.com/tx/'+transactionHash).substring(0,35) +'..'}</Text>
                    </TouchableOpacity>
                </View>
                
                <ShareButton props={{msg: 'https://mumbai.polygonscan.com/tx/'+transactionHash}}></ShareButton>
            </View>
            
          }
          
          <BottomSheet isVisible={isVisible}>
          
            <ListItem
              key={1}
              containerStyle={{height: 200, width: '100%', backgroundColor:theme.backgroundPrimary, alignItems:'center', justifyContent:'center'}}
            >
              <ListItem.Content style={styles.content}>
                  <TouchableOpacity onPress={() => setShowDate(true)} style={styles.datetime}>
                    <Text style={styles.datetimeText}>Start Date: </Text>
                    <Text style={[styles.datetimeText,{color:theme.text}]}>{date.getDate() + '/' + date.getMonth() + '/'+date.getFullYear()}</Text>
                  </TouchableOpacity>
                
                <TouchableOpacity style={styles.datetime} onPress={() => setShowTime(true)}>
                  <Text style={styles.datetimeText}>End Date: </Text>

                  <Text style={[styles.datetimeText,{color:theme.text}]}>{time_helpers.formatAMPM(time) }</Text>
                </TouchableOpacity>
                {
                  showDate && 
                  <DateTimePicker onChange={
                    (event:any, value:any) => {
                      setShowDate(false);
                      if(value)
                      {
                        setDate(value)
                      }
                    }
                  } value={date} mode='datetime' ></DateTimePicker>
                }

                {
                  showTime &&
                  <DateTimePicker
                  value={time}
                  mode='time'
                  onChange = {
                    (event:any,value:any) => 
                    {
                      setShowTime(false);
                      if(value)
                      {
                        console.log("here");
                        setTime(value)
                      }
                    }
                  }
                  ></DateTimePicker>
                }
                
                <View style={styles.row}>
                    <TextInput style={[styles.input,{backgroundColor: theme.backgroundSecondary, color: theme.text}]} placeholderTextColor={theme.textColorNotActive} onChangeText={setPrice} placeholder="Price" />
                    <TouchableOpacity onPress={() => {makeAlert()}} style={[styles.button,{backgroundColor: theme.backgroundPrimary, borderColor: theme.blue, marginLeft: 10}]}>
                    {
                        approveIcon
                    }
                    </TouchableOpacity>
                </View>
                
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
export default AuctionButton;


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
  row: {
    flexDirection:'row', 
    justifyContent: 'flex-start', 
    alignItems: 'flex-end'
  },
  datePickerStyle:{
    width: 300,
    fontSize: 20,
    borderRadius: 20
  },
  datetime:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  datetimeText: {
    fontSize: 24
  }
  
  
});
