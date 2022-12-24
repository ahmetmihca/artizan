import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import "../hooks/colorSchemeSingleton";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get_nonce,login } from './../services/login_serv';
import JWT from './../helpers/token_helper';
export default function LoginHandler() {
    const connector = useWalletConnect();


    const [tokenHandled, setTokenHandled] = useState(false);

    


    async function tokenHelper()
    {
      let walletId = connector.accounts[0].toLowerCase();
      let res = await get_nonce(walletId);
      let signature = await connector.signPersonalMessage([res.user.nonce, walletId]);
      let res2 = await login(res.user.nonce, signature);
      await  AsyncStorage.setItem("token",res2.token);

      setTokenHandled(true);
    }
    useEffect(
        () => {
          async function handleToken(){
            try{
              const token = await AsyncStorage.getItem("token");
              console.log(token);
              const jwt : JWT = new JWT();
              if( connector.connected &&  (token === null || jwt.isJwtExpired()))
              {
                tokenHelper();
              }
              
            }
            catch{
              
            }
            
          }

          handleToken();
        }
    ,[]);


  return tokenHandled;
}



const styles = StyleSheet.create({
  styleExample: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  
});