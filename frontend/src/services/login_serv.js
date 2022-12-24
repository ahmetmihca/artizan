import axios from "axios";
import api_config from '../config/api';
import metamask_operations from './metamask'
import Cookie from "js-cookie"

let BASE_URL = "http://localhost:3001/api/v1/"

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

const get_nonce = async (wallet) => {
    const response = await axios.get(BASE_URL + `user?publicAdress=${wallet}`, {}, headers);
    return response.data;
};

const login = async (message, key) => {
    const response = await axios.post(BASE_URL + `auth/login/`, {
        "nonce" : message,
        "key": key
    }, headers);
    return response.data;
};

const logout = async (web3Modal) => {
    
    await localStorage.clear("wallet");
    Cookie.remove("token");

    const accounts = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{
            eth_accounts: {}
        }]
    }).then(() => window.ethereum.request({
        method: 'eth_requestAccounts'
    }))
    
    const account = accounts[0]
    
};

async function login_system (){

    let walletId = localStorage.getItem("wallet");
    let token = Cookie.get("token");

    if (walletId != null && token != null)
    {
        return;
    }

    if (walletId == null) {
        walletId = await metamask_operations.onLoginHandler();
    }

    let res = await get_nonce(walletId);
    console.log(res.user.nonce);

    console.log('0x' + walletId.toUpperCase().substring(2));

    let signature = await metamask_operations.signMessage(res.user.nonce, walletId);
    console.log(signature);

    let res2 = await login(res.user.nonce, signature);
    console.log(res2);
    document.cookie = `token=${res2.token}`

}

const login_services = {
    get_nonce, login, login_system,logout
}

export default login_services;