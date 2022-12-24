import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND + "market";

var headers = {
    "Access-Control-Allow-Origin": '*',
    // "Content-Type": 'application/json',
};

const sell_nft = async (contract,token,price, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/sell`, 
    {
        "contract" : contract,
        "tokenID" : token,
        "price": price
    }
    ,{ headers: headers });

    return response.data
};

const stopSale = async (contract,token, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/stopSale`, 
    {
        "contract" : contract,
        "tokenID" : token,
    }
    ,{ headers: headers });

    return response.data
};

const buyNft = async (contract,token, price, wallet, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/buy`, 
    {
        "contract" : contract,
        "token" : token,
        "price": price,
        "buyerWallet": wallet
    }
    ,{ headers: headers });

    return response.data
};

const getMarketItems = async (user = null, auction = null) => {
    let url = BASE_URL + `/items?`
    if(user != null )
    {
        url += `user=${user}&`;
    }
    if(auction == true)
    {
        url+= `auction=true&`
    }

    const response = await axios.get(url, {}, headers);
    return response.data;
};


// Auction Methods

const create_auction = async (contract,token,price, date, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/create_auction`, 
    {
        "contract" : contract,
        "tokenID" : token,
        "price": price,
        "date": date
    }
    ,{ headers: headers });

    return response.data
};

const sendBidOffer = async (token, price, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/create_bid`, 
    {
        "token" : token,
        "price": price,
    }
    ,{ headers: headers });

    return response.data
};

const trade_services = {
    sell_nft, getMarketItems, stopSale, buyNft, create_auction, sendBidOffer
}

export default trade_services;