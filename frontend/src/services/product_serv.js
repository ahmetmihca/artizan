import axios from "axios";
import api_config from '../config/api';

let BASE_URL = api_config.API_URL + "all";

const get_products = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

const product_services = {
    get_products,
}

export default product_services;