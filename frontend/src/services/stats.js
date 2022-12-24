import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND;

var headers = {
    "Access-Control-Allow-Origin": '*',
    // "Content-Type": 'application/json',
};

const top_stats = async (type) => 
{   
    // console.log(params)
    const response = await axios.get(BASE_URL + 'top/' + type, { headers: headers });

    return response.data
};


const stat_services = {
    top_stats
}

export default stat_services;