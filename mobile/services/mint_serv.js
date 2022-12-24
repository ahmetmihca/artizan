import axios from "axios";
import api_config from '../config/api';
import * as FileSystem from 'expo-file-system';

let BASE_URL = api_config.BACKEND;

var headers = {
    "Access-Control-Allow-Origin": '*',
    // "Content-Type": 'application/json',
};


async function encodeImageFileAsURL(file) {

    return await FileSystem.readAsStringAsync(file.uri,
 { encoding: FileSystem.EncodingType.Base64 });

}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

const pre_mint = async (art, name, description, category, auth, amount) => {
    // headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `jwt ${auth}`;
    let artb64 = await encodeImageFileAsURL(art);
    // artb64 = _arrayBufferToBase64(artb64)
    let params =  {
        "name": name,
        "art": artb64,
        "description": description,
        "category": category
    };
    if(amount > 1)
    {
        params["multi"] = true;
        params["amount"] = amount;
    }
    const response = await axios.post(BASE_URL + '/pre-mint',params
        , { headers: headers });
    
    return response.data
};


const mint_services = {
    pre_mint
}

export default mint_services;