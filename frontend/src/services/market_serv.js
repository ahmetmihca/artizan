import axios from "axios";
import api_config from "../config/api";

let BASE_URL = api_config.BACKEND + "market";

var headers = {
  "Access-Control-Allow-Origin": "*",
  // "Content-Type": 'application/json',
};

const sell_nft = async (contract, token, price, duration, company, auth) => {
  // headers["Content-Type"] = "multipart/form-data";
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/sell`,
    {
      contract: contract,
      tokenID: token,
      price: price,
      duration: duration,
      company: company,
    },
    { headers: headers }
  );

  return response.data;
};

const stopSale = async (contract, token, auth) => {
  // headers["Content-Type"] = "multipart/form-data";
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/stopSale`,
    {
      contract: contract,
      tokenID: token,
    },
    { headers: headers }
  );

  return response.data;
};

const buyNft = async (contract, token, price, wallet, auth) => {
  // headers["Content-Type"] = "multipart/form-data";

  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/buy`,
    {
      contract: contract,
      token: token,
      price: price,
      buyerWallet: wallet,
    },
    { headers: headers }
  );

  return response.data;
};

const getMarketItems = async (user = null) => {
  let url = BASE_URL + `/items?`;
  if (user != null) {
    url += `user=${user}&`;
  }

  const response = await axios.get(url, {}, headers);
  return response.data;
};

const addToWhitelist = async (addressToAdd, callerAddress, username, auth) => {
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/add-to-whitelist`,
    {
      addressToAdd: addressToAdd,
      callerAddress: callerAddress,
      username: username,
    },
    { headers: headers }
  );

  return response.data;
};

const isContractOwner = async (accountAddress, auth) => {
  headers["Authorization"] = `jwt ${auth}`;
  const response = await axios.post(
    BASE_URL + `/contract-owner-check`,
    {
      accountAddress: accountAddress,
    },
    { headers: headers }
  );

  if (!response) return false;

  return response.data;
};

const isWhitelisted = async (accountAddress, auth) => {
  console.log("front: accountAddress", accountAddress);
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/whitelist-check`,
    {
      accountAddress: accountAddress,
    },
    { headers: headers }
  );

  if (!response) return false;

  return response.data;
};

const verify = async (company, callerAddress, auth) => {
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + `/verify`,
    {
      company: company,
      address: callerAddress,
    },
    { headers: headers }
  );

  return response.data;
};

const trade_services = {
  sell_nft,
  getMarketItems,
  isWhitelisted,
  isContractOwner,
  addToWhitelist,
  verify,
  stopSale,
  buyNft,
};

export default trade_services;
