import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND + "collection";

var headers = {
    "Access-Control-Allow-Origin": '*',
    // "Content-Type": 'application/x-www-form-urlencoded',
};

const get_my_collection = async (auth) => {
    headers["Authorization"] = `jwt ${auth}`;
    const response = await axios.get(BASE_URL + '/my', { headers: headers });
    return response.data
};

const create_collection = async (logo, featured, banner, name, desc, earning, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;

    let formData = new FormData();

    formData.append('logo', logo);
    formData.append('featured', featured);
    formData.append('banner', banner);
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('earning', earning);


    headers["Content-Type"] = `undefined`;


    // const response = await fetch(BASE_URL + '/create', 
    // { 
    //     method:'post',
    //     body: formData,
    //     headers: headers
    // })

    const response = await axios.post(BASE_URL + '/create', formData, { headers: headers });
    return;
};

const get_collections = async () => {
    const response = await axios.get(BASE_URL + '/all');
    return response.data
};
const getCategorized = async (category = "") => {
    let url = BASE_URL + '/all';
    if(category != ""){
        url += '?category=' + category
    }
    const response = await axios.get(url, { headers: headers });
    return response.data
};
const get_collections_temp = async () => {
    const response = await axios.get('https://api-mainnet.rarible.com/marketplace/api/v4/collections/top?blockchains=ETHEREUM&days=30&size=18');
    return response.data
};
const update_collection = async (token, contract, collection, auth) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;

    const response = await axios.post(BASE_URL + `/addToCollection/${collection}`, 
    {
        "tokenID" : token,
        "contractID" : contract,
    }
    ,{ headers: headers });

    return response.data
};

const get_nfts_under_collection = async (collection_id) => {

    // const response = await axios.post(`https://api-mainnet.rarible.com/marketplace/search/v1/items`, 
    // {
    //     "size":20,
    //     "filter":{"verifiedOnly":false,"sort":"LOW_PRICE_FIRST","creatorAddresses":[],
    //     "collections":[`${collection_id}`],
    //     "currency":"0x0000000000000000000000000000000000000000",
    //     "nsfw":true}}
    // );
    // return response.data
};


const get_collection_meta = async (collection_id) => {
    const response = await axios.get(`https://api-mainnet.rarible.com/marketplace/api/v4/collections/${collection_id}`);
    return response.data
};

const get_collection_images = (id) => {

    return {logo: 'http://10.50.116.36:3001/public/collections/' + id+ "_logo.png",
    banner: 'http://10.50.116.36:3001/public/collections/' + id+ "_banner.png",
    featured: 'http://10.50.116.36:3001/public/collections/' + id + "_featured.png",
    };
}


const collection_services = {
    create_collection, get_collections_temp, get_nfts_under_collection, get_collection_meta, get_my_collection, get_collections, get_collection_images, update_collection,getCategorized
}

export default collection_services;