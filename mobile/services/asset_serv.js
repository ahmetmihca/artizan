import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

const get_asset = async (contract, id, type = 0) => {
    let url = `${BASE_URL}asset/${contract}/${id}`;
    if(type == "meta"){
        url += '?filter=nft_meta';
    }
    try{
        const response = await axios.get(url, headers);
        return response.data
    }
    catch{
        return [];
    }
    
};

const get_asset_collection = async (contract, id, type = 0) => {
    let url = `${BASE_URL}collection/fromNFT/${contract}/${id}`;
    try{
        const response = await axios.get(url, headers);
        if(response.status == 404){
            return {"name": "", "_id" : ""};
        }else{
            return response.data
        }
    }
    catch(err){
        return {"name": "", "_id" : ""};
    }
};

const asset_services = {
    get_asset, get_asset_collection
}

export default asset_services;
