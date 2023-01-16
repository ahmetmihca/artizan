import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND + "u";

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

const search = async (search = 0, category, id = 0) => {
    let url = BASE_URL + `/search?type=${category}`
    if(id != 0)
    {
        url += `&id=${id}`;
    }
    if(search != 0){
        url += `&search=${search}`
    }
    const response = await axios.get(url, {}, headers);
    return response.data;
};

const getTop = async(type) => {
    let url = api_config.BACKEND + `/top/`+type
    
    if(search != 0){
    }
    const response = await axios.get(url, {}, headers);
    return response.data;
}
const utils = {
    search, getTop
}

export default utils;