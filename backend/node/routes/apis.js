const express = require("express");
const axios = require("axios").default;
const fs = require("fs");
const util = require("util");
const FormData = require("form-data");
const Nft = require("../models/nft");
const Auction = require("../contracts/Auction");

require("dotenv").config();

const lodash = require("lodash")

const Hash = require("ipfs-only-hash");
const auth = require("../middlewares/auth");
const check = require("../middlewares/check")

const alchemyAPIKey = process.env["ALCHEMY_API_KEY"];
const alchemyAPIUrl = process.env["ALCHEMY_API_URL"];
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

// Using HTTPS
const web3 = createAlchemyWeb3(
    alchemyAPIUrl // `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const ContractDetails = require("../contracts/ContractDetails");

const contractABI = require("../contracts/ArtizanNFT.json");
const marketContractABI = require("../contracts/ArtizanMarket.json");
const { default: mongoose } = require("mongoose");
const Collection = require("../models/collection");
const { collection } = require("../models/nft");
const req = require("express/lib/request");

const NftContract = new web3.eth.Contract(contractABI.abi, ContractDetails.nftContractAddress);//loadContract();
const MarketContract = new web3.eth.Contract(marketContractABI.abi, ContractDetails.marketContractAddress);

let Nft1155Helper = require("../contracts/Nft1155");
let Market1155Helper = require("../contracts/Market1155");

const User = require("../models/user");

const router = express.Router();

var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });

function errlog(data) {
    var datetime = new Date();
    log_file.write(
        datetime.toISOString().slice(0, 10) +
        ":" +
        Date.now() +
        "\n" +
        util.format(data) +
        "\n\n"
    );
}

async function getNftMetadataFromChain(tokenID) {
    let data = {}
    try {
        let token = await NftContract.methods.tokenURI(tokenID).call();

        console.log(token);

        let resp;
        if (token.startsWith("ipfs://")) {
            resp = await axios.get(`https://gateway.ipfs.io/ipfs/${token.split("//")[1]}`);
        }
        else {
            resp = await axios.get(`https://gateway.ipfs.io/ipfs/${token.split("ipfs/")[1]}`);
        }

        return resp.data;
    }
    catch
    {
        console.log("problem");
        return data;
    }
}


let LATEST_TOKEN_ID = -1;

async function update() {
    // Check tokenID
    let returned_token = -1;

    returned_token = await NftContract.methods.tokenID().call();

    if (LATEST_TOKEN_ID == returned_token || returned_token == 0) {
        console.log("System up to date ", new Date());
        return;
    }

    console.log("New token " + returned_token);

    let db_details = await Nft.findOne({
        contract: ContractDetails.nftContractAddress,
        tokenID: returned_token,
    });

    if (db_details != null) {
        LATEST_TOKEN_ID = returned_token;
        console.log("System up to date already in database", new Date());
        return;
    }
    else {

        let resp = await getNftMetadataFromChain(returned_token);

        console.log("resp: ", resp);

        if (resp != null) {
            let db_details = await Nft.findOne({
                contract: ContractDetails.nftContractAddress,
                tokenID: returned_token,
            });

            if (db_details == null) {
                if (!(resp.image && resp.name)) {
                    return;
                }

                await Nft.create
                    ({
                        contract: ContractDetails.nftContractAddress,
                        tokenID: returned_token,
                        metadata: {
                            imgURL: resp.image,
                            name: resp.name,
                            description: resp.description,
                        },
                        creator: resp.creator
                    });
                LATEST_TOKEN_ID = returned_token
            }
        }
        else {
            console.log("This node is not ready will be tried again");
        }
    }
}

// Live Check
setInterval(update, 30000, "Updating...");

// Get NFT information API
router.get("/asset/:contract/:token", async (req, res) => {
    const filter = req.query["filter"];
    res.contentType("application/json");
    let contractAddr = req.params["contract"].toLocaleLowerCase();
    const tokenId = req.params["token"];

    console.log(contractAddr);

    var data = {};

    try {
        if (filter == "nft_meta") {

            let metadata;
            let data = {};

            try {
                if (contractAddr.toLocaleLowerCase() == ContractDetails.nftContractAddress.toLocaleLowerCase()) {
                    metadata = await getNftMetadataFromChain(tokenId);
                    console.log("Chainden verdim")
                }
                else {
                    metadata = await web3.alchemy.getNftMetadata({
                        contractAddress: contractAddr,
                        tokenId: tokenId,
                    });

                    metadata = metadata.metadata;
                }

            }
            catch {
                res.send({})
                return;
            }


            if (metadata == null) {
                res.send({})
                return;
            }

            let db_details = await Nft.findOne({
                contract: contractAddr,
                tokenID: tokenId,
            });

            data.name = metadata.name;
            data.imgURL = metadata.image;
            data.description = metadata.description;
            data.favorited = db_details.favorited ? db_details.favorited : 0 ;
    
            res.send(data);
        }
        else {

            if(!ContractDetails.list1155contracts.includes(contractAddr))
            {
                p1 = web3.alchemy.getTokenMetadata(contractAddr);
                
                p3 = axios({
                    method: "get",
                    url: `${alchemyAPIUrl}/getOwnersForToken?contractAddress=${contractAddr}&tokenId=${tokenId}`,
                    headers: {},
                });
            }


            if (contractAddr.toLocaleLowerCase() == ContractDetails.nftContractAddress.toLocaleLowerCase()) 
            {
                p2 = getNftMetadataFromChain(tokenId);
                console.log("Fetched from chain");
            }
            else 
            {
                p2 = web3.alchemy.getNftMetadata({
                    contractAddress: contractAddr,
                    tokenId: tokenId,
                });
            }
           
            p4 = axios({
                url: `https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${contractAddr}&page=1&offset=10000&startblock=0&endblock=latest&sort=asc&apikey=${process.env["ETHERSCAN_API_KEY"]}`,
                method: "GET",
            });

            p5 = Nft.findOne({ contract: contractAddr, tokenID: tokenId });
            let metadata, response, owner, history, mongoresp;

            if(ContractDetails.list1155contracts.includes(contractAddr))
            {
                [response, history, mongoresp] = await Promise.all(
                    [p2, p4, p5]
                );   
            }
            else
            {
                [metadata, response, owner, history, mongoresp] = await Promise.all(
                    [p1, p2, p3, p4, p5]
                );    
            }
        

            if (contractAddr.toLocaleLowerCase() != ContractDetails.nftContractAddress.toLocaleLowerCase()) {
                response = response.metadata;
            }

            let history_data = [];

            try {
                history_data = history.data.result.filter((element) => {
                    return +element["tokenID"] == +tokenId;
                });
            }
            catch {
                history_data = [];
            }


            if(ContractDetails.list1155contracts.includes(contractAddr))
            {
                data.contract = {
                    address: contractAddr,
                    name: "ERC1155",
                    symbol: "ERC1155",
                    type: "ERC1155",
                };


                let amount = await Nft1155Helper.getAmount(tokenId);

                console.log(amount);

                let owners = [];

                if(amount != 0)
                {
                    owners = await Market1155Helper.getNFT(tokenId);                   
                    owners = owners.owners;

                    if(owners.length == 0)
                    {
                        owners = Array(parseInt(amount)).fill(response.creator);
                    }
                }

                data.amount = amount; 
                data.multiple_owners = owners;
            }
            else
            {
                data.contract = {
                    address: contractAddr,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    type: "ERC721",
                };
            }

            data.tokenID = tokenId;
            data.name = response.name;
            data.imgURL = response.image;
            data.creator = response.creator;
            data.description = response.description;
            data.chain = "eth-ropsten";

            if(!ContractDetails.list1155contracts.includes(contractAddr))
            {
                data.owner = owner.data.owners[0];
            }

            data.activity = history_data.map((element) => ({
                date: element.timeStamp,
                from: element.from,
                to: element.to,
                tx_hash: element.hash,
            }));

            if (mongoresp != null) {
                data.favorited = mongoresp.favorited == null ? 0 : mongoresp.favorited;
            } else {
                data.favorited = 0;
            }

            // This should have a price
            if (contractAddr.toLowerCase() == ContractDetails.nftContractAddress || ContractDetails.list1155contracts.includes(contractAddr))
            {
                // On Auction
                if (await Auction.isTokenOnAuction(contractAddr, tokenId)) {
                    let auctionDetails = await Auction.getAuctionDetails(contractAddr, tokenId);

                    console.log(auctionDetails);

                    data.onBidding = true;
                    data.auctionEnds = auctionDetails.endAt
                    data.highestBid = auctionDetails.highestBid;

                    let biddingDetails = await Auction.getAuctionBiddingDetails(contractAddr, tokenId);

                    let bids = []
                    biddingDetails.forEach((element) => {
                        bids.push({
                            "bidder": element.bidder,
                            "value": element.bid
                        })
                    })

                    data.bidHistory = bids
                }

                // On Sale
                else if( contractAddr.toLowerCase() == ContractDetails.nftContractAddress) {
                    let item = await MarketContract.methods.NFTItem(tokenId).call();

                    if (!item["sold"] && item["nftContract"] != "0x0000000000000000000000000000000000000000") {
                        data.price = web3.utils.fromWei(item["price"], 'ether');
                    }
                }
                else
                {
                    
                    let item = await Market1155Helper.getNFT(tokenId);

                    console.log(item)

                    if (!item["solds"][0] && item["nftContract"] != "0x0000000000000000000000000000000000000000") {
                        data.price = web3.utils.fromWei(item["prices"][0], 'ether');
                    }

                }
            }

            res.send(data)

            try {
                const liveUpdate = true

                if (liveUpdate) {
                    if (mongoresp == null) {
                        Nft.create({
                            contract: contractAddr,
                            tokenID: tokenId,
                            metadata: {
                                imgURL: data.imgURL,
                                name: data.name,
                                description: data.description,
                                attributes: data.attributes
                            },
                            creator: data.creator
                        })
                    }
                }
            }
            catch (err) {
                console.log("Error on DB write" + err.message);
                return;
            }

            return;
        }
    }
    catch (e) {
        res.sendStatus(404);
        console.log(e);
        return;
    }
});

// List NFT
// if token does not exists, default request is made
router.get("/listNFT/contract/:contract/:token?", (req, res) => {
    res.contentType("application/json");

    const baseURL = `${alchemyAPIUrl}/getNFTsForCollection`;
    const contractAddr = req.params.contract;
    const startToken = req.params.token;
    const withMetadata = "false";

    var config = {
        method: "get",
        url: startToken
            ? `${baseURL}?contractAddress=${contractAddr}&startToken=${startToken}&withMetadata=${withMetadata}`
            : `${baseURL}?contractAddress=${contractAddr}&withMetadata=${withMetadata}`,
        headers: {},
    };

    let data = [];

    axios
        .request(config)
        .then((response) => {
            response.data.nfts.forEach((element) => {
                data.push(element.id.tokenId);
            });
            res.send({
                tokens: data,
                nextToken: response.data.nextToken,
            });
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(404);
        });
});

// List nfts owned by
router.get("/listNFT/owner/:owner", (req, res) => {
    res.contentType("application/json");
    const nfts = web3.alchemy.getNfts({
        owner: req.params.owner,
        withMetadata: false,
    });
    nfts
        .then((response) => {
            data = [];
            response.ownedNfts.forEach((nft) => {
                data.push({
                    contractAddress: nft.contract.address,
                    tokenId: nft.id.tokenId,
                    balance: nft.balance,
                });
            });
            res.send({
                totalCount: response.totalCount,
                nfts: data,
            });
        })
})


router.post('/pre-mint', auth, async (req, res) => {
    // TODO: Add authentication (captcha or some other)
    // TODO: Add concurrency
    const { name, description, art, multi, amount } = req.body;

    // TODO: NFT database'e ekle

    const img_buffer = await Buffer.from(art, "base64")
    let img_hash = await upload(img_buffer)

    if (img_hash.Status != "Success") {
        return;
    }

    let send_json = {
        "name": name,
        "description": description,
        "image": "ipfs://" + img_hash.Hash,
        "creator": req.user.id
    };

    const json_buffer = Buffer.from(JSON.stringify(send_json), "utf-8")
    let json_hash = await upload(json_buffer)
    let contract1 = new web3.eth.Contract(contractABI.abi, ContractDetails.nftContractAddress);//loadContract();


    let transactionParameters = {}

    // ERC721
    if (multi != true) {
        console.log("MINTING with ERC721");

        try{
            let data = contract1.methods.mintNFT(`ipfs://${json_hash.Hash}`).encodeABI();
            transactionParameters = {
            to: ContractDetails.nftContractAddress, // Required except during contract publications.
            from: req.user.id, // must match user's active address.
            data: data
            };
            res.json(transactionParameters)

        }catch(e)
        {
            res.json({fail: true});
        }

        
    }
    else {
        console.log("MINTING with ERC1155");
        try{
            let data = Nft1155Helper.mintNftAbi(`ipfs://${json_hash.Hash}`, amount);
            transactionParameters = {
            to: ContractDetails.nftContractAddress1155,
            from: req.user.id,
            data: data
            };
            res.json(transactionParameters)

        }catch(e)
        {
            res.json({fail:true});
        }

        
    }

})

router.get("/listTransaction/user/:user/:page?", async (req, res) => {

    res.contentType("application/json");

    const user = req.params.user;
    const page = req.params.page == null ? 1 : req.params.page;

    let config = {
        method: "get",
        url: `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${user}&startblock=0&endblock=99999999&page=${page}&offset=10&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`,
    };

    let etherscan_response = await axios.request(config);

    function getType(data) {
        return check.getTransactionType(data.input)
    }

    let results = etherscan_response.data.result;
    console.log(results.length);

    let response = results.map((data) => ({
        from: data.from,
        to: data.to,
        value: +data.value / 1e18,
        type: getType(data),
        time: new Date(+data.timeStamp * 1000).toDateString(),
        hash: data.hash
    }));

    res.json({
        response: response,
        page: page,
    });
});

// Top Creators (by quantity, from database)
router.get("/top/creator", async (req, res) => {
    let cursor = Nft.find({ "creator": { "$ne": null } })

    ret = {}

    for await (const doc of cursor) {
        if (ret[doc.creator] == null) {
            ret[doc.creator] = 1
        } else {
            ret[doc.creator]++
        }
    }

    ret = Object.entries(ret);
    
    let q = []
    if(req.query["detailed"] == "1")
    {
        for (const obj of ret)
        {
            let user = await User.findOne({"id": obj[0]}).select(['username','_id']);

            q.push({
                "id": obj[0],
                "count": obj[1],
                "user_obj": user  
            })
        }
        
        ret = q;
    }

    res.send(ret);
})

// Top NFTs (nftby sale price)
router.get("/top/nft", async (req, res) => {
    let colSale = mongoose.connection.db.collection("Sales")
    let cursor = colSale.find({}).sort({ "value": -1 })

    sales = []

    for await (const doc of cursor) {
        delete doc._id
        sales.push(doc)
    }

    let colERC721 = mongoose.connection.db.collection("ERC721_Transfers")

    for (let i = 0; i < sales.length; i++) {
        ercinfo = await colERC721.findOne({ "txHash": sales[i].txHash })
        sales[i].tokenID = ercinfo.tokenID
        sales[i].contract = ercinfo.contract
    }

    res.send(sales);
})


// Top Collections / by total nft sale
router.get("/top/collection", async (req, res) => {
    //TODO: Bullshit complexity. find good solution, maybe add to database on sale
    let cursor = Collection.find({})
    let colSale = mongoose.connection.db.collection("Sales")
    let colERC721 = mongoose.connection.db.collection("ERC721_Transfers")


    collections = []

    for await (let doc of cursor) {
        // loop all nfs if they sold before

        doc.totalValue = 0

        for (let nft of doc.NFTs) {
            nft.totalValue = 0
            // check if transaction for that NFT
            let ercCursor = colERC721.find({ "tokenID": `${nft.tokenID}`, "contract": `${nft.contract}` })
            for await (const ercTrans of ercCursor) {
                //chek if sale with that trans hash
                let sale = await colSale.findOne({ "txHash": ercTrans.txHash })
                if (sale != null) {
                    nft.totalValue += +sale.value
                }
            }
            doc.totalValue += nft.totalValue
        }

        collections.push(
            lodash.pick(doc, ["name", "description", "wallet_id", "NFTs", "totalValue", "_id", "watched"])
        )
    }

    collections.sort((a, b) => b.totalValue - a.totalValue)

    res.send(collections)
})

// IPFS upload API
router.post("/ipfs/push", async (req, res) => {
    // TODO: Add authentication (captcha or some other)
    // TODO: Add concurrency

    res.type("application/json");

    try {
        const data_b64 = req.body["data"];
        const data_buffer = Buffer.from(data_b64, req.body["encoding"]);
        await upload(data_buffer);
        res.end();
    } catch (err) {
        errlog(err);
        if (err.code === "ERR_UNKNOWN_ENCODING") {
            res.status(400);
            res.send("UNKNOWN ENCODING. Some valid ones are: utf-8, bas64 ...").end();
            return;
        }
        res.sendStatus(500);
    }
});



async function upload(data_buffer) {
    try {
        let hash = await Hash.of(data_buffer);
        fs.writeFile("/tmp/" + hash, data_buffer, (err) => {
            if (err) {
                console.log("Error while writing to file : " + hash);
                throw err;
            }
        });

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append("file", fs.createReadStream("/tmp/" + hash));

        let response = await axios.post(url, data, {
            maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: process.env["PINATA_API_KEY"],
                pinata_secret_api_key: process.env["PINATA_SECRET_API_KEY"],
            },
        });

        fs.unlink("/tmp/" + hash, (err) => {
            if (err) {
                console.log("Error while deleting file : " + hash);
                throw err;
            }
        });

        if (response.data["IpfsHash"] == hash) {
            return {
                Status: "Success",
                Hash: hash,
            };
        } else {
            throw "Hash mismatch " + response.data["IpfsHash"] + "!=" + hash;
        }
    } catch (err) {
        console.log("Error");
        errlog(err);
    }
}


module.exports = router;
