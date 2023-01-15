import axios from "axios";
import api_config from "../config/api";

let BASE_URL = "http://localhost:3001/api/v1/user";

var headers = {
  "Access-Control-Allow-Origin": "*",
};

const get_user = async (wallet) => {
  const response = await axios.get(
    BASE_URL + `?publicAdress=${wallet}`,
    {},
    headers
  );
  return response.data;
};

const get_my_watchlist = async (auth) => {
  headers["Authorization"] = `jwt ${auth}`;
  const response = await axios.get(BASE_URL + "/watchlist", {
    headers: headers,
  });
  return response.data.watchlist;
};

const get_nfts = async (id) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/listNFT/owner/${id}`,
    { headers: headers }
  );
  return response.data;
};

const get_user_favorites = async (user_id) => {
  const response = await axios.get(BASE_URL + `/favorites/${user_id}`, {
    headers: headers,
  });
  return response.data.favoriteNFTs;
};

const addWatchlist = async (auth, collection) => {
  headers["Authorization"] = `jwt ${auth}`;
  const response = await axios.post(
    BASE_URL + "/add-watchlist",
    {
      collection_id: collection,
    },
    { headers: headers }
  );

  return response.data.status;
};

const removeWatchlist = async (auth, collection) => {
  headers["Authorization"] = `jwt ${auth}`;
  const response = await axios.post(
    BASE_URL + "/remove-watchlist",
    {
      collection_id: collection,
    },
    { headers: headers }
  );

  window.location.reload();
};

const addFavoriteNft = async (contract, token, auth) => {
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + "/add-favorite-nft",
    {
      contract: contract,
      token: token,
    },
    { headers: headers }
  );

  return response.data;
};

const removeFavoriteNft = async (contract, token, auth) => {
  headers["Authorization"] = `jwt ${auth}`;

  const response = await axios.post(
    BASE_URL + "/remove-favorite-nft",
    {
      contract: contract,
      token: token,
    },
    { headers: headers }
  );

  return response.data;
};

const update_user = async (avatar, name, username, bio, auth) => {
  headers["Authorization"] = `jwt ${auth}`;

  let formData = new FormData();

  formData.append("avatar", avatar);
  formData.append("name", name);
  formData.append("username", username);
  formData.append("bio", bio);

  headers[
    "Content-Type"
  ] = `multipart/form-data; boundary=${formData._boundary}`;

  const response = await axios.post(BASE_URL + "/update", formData, {
    headers: headers,
  });

  return response.data;
};

const get_my_favorites = async (auth) => {
  headers["Authorization"] = `jwt ${auth}`;
  const response = await axios.get(BASE_URL + "/favorites", {
    headers: headers,
  });
  return response.data.favoriteNFTs;
};

const get_history = async (id, page) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/listTransaction/user/${id}/${page}`,
    { headers: headers }
  );
  return response.data;
};

const get_user_created_nfts = async (id) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/user/created/${id}`,
    { headers: headers }
  );
  return response.data;
};

const user_services = {
  update_user,
  get_user,
  get_my_watchlist,
  removeWatchlist,
  addFavoriteNft,
  get_user_favorites,
  removeFavoriteNft,
  get_nfts,
  addWatchlist,
  get_my_favorites,
  get_history,
  get_user_created_nfts,
};

export default user_services;
