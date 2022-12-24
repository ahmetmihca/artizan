import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND +'market';
var headers = {
    "Access-Control-Allow-Origin": '*',
    // "Content-Type": 'application/json',
};
const getTransaction = async (txhash = null) => {
    const response = await axios.post(BASE_URL + `/transactions`, 
    {
        "txhash": txhash
    },headers);
    return response.data;
};

const getUserTransactions = async (wallet, page) => {

    let url = api_config.BACKEND + '/listTransaction/user/'+ wallet + '/'+ page;
    const response = await axios.get(url, {}, headers);
    console.log(response.data.response);
    return response.data.response;
}

const transaction_services = {
    getTransaction,getUserTransactions
}


export default transaction_services;