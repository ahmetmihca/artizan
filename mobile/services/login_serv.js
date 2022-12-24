import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.BACKEND;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

export const get_nonce = async (wallet) => {
    const response = await axios.get(BASE_URL + `user?publicAdress=${wallet}`, {}, headers);
    return response.data;
};

export const login = async (message, key) => {

    const response = await axios.post(BASE_URL + `auth/login/`, {
        "nonce" : message,
        "key": key
    }, headers);
    return response.data;
};

const login_services = {
    get_nonce, login
}

export default login_services;