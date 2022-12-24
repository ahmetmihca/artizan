import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../Themed';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/colorSchemeSingleton";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { Alert } from 'react-native';
import trade_services from '../../services/market_serv';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const BuyButton = ({contract,token, price}: {contract: string, token: string, price: number}) =>{
    const connector = useWalletConnect();
    const {theme} = useTheme();
  const myIcon = <Icon name="chevron-left" size={25} color="#7E7474" style={
    {paddingRight:5, elevation:5, backgroundColor:'transparent'}} />;
    async function buyNFT(){
        //check if connected
        try{
      let userToken = await AsyncStorage.getItem("token");
      const payHex = "0x"+  (price* 10**(18)).toString(16);

        let res = await trade_services.buyNft(contract,token,price,connector.accounts[0],userToken);
         const transactionRes = await connector.sendTransaction({
         data: res.data,
         from: res.from,
         to: res.to,
         value: payHex
         });

    }
    catch{
    
    }
    }

    function makeAlert(){
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
                {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "OK", onPress: () => {buyNFT()} }
            ]
            );
    }
  return (
        <TouchableOpacity onPress={() => {makeAlert()}} style={[styles.button,{backgroundColor: theme.blue}]}>
          
          <Text style={{ fontSize: 22}}>Buy</Text>
           
        </TouchableOpacity>
  );
}
export default BuyButton;


const styles = StyleSheet.create({
  button: {
    width: "75%",
    flexDirection:'row',
    height: 40,
    borderRadius: 7,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
