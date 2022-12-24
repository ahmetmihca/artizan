import {  } from '@walletconnect/react-native-dapp';



export async function signMessage(msg,wallet)
{
    let result = await personal_sign(msg,wallet);
    return result;
}