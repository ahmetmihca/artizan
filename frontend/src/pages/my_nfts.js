import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBContainer,
    MDBBtn,
    MDBRow,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBIcon,
    MDBCol,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalTitle,
    MDBModalHeader,
    MDBModalBody,
    MDBInput
} from 'mdb-react-ui-kit';
import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import collection_services from '../services/collection_serv';
import asset_services from '../services/asset_serv';
import user_services from '../services/user_serv';
import AssertURL from "../helpers/asset_url"
import market_services from '../services/market_serv';

import './style/css-mycollection.css'

function MyNft() {

    const [collections, setCollections] = useState([]);
    const [user_nfts, setUserNfts] = useState([])
    const [auctions, setAuctions] = useState([])
    const [fillActive, setFillActive] = useState('tab1');
    const [onsale_nfts, setOnSale] = useState([])
    const [centredModal, setCentredModal] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState();
    const [sellingOption, setSellingOption] = useState('default');

    const toggleModal = () => {
        setCentredModal(!centredModal)
        setSellingOption('default');
    };

    const changeSelling = (option) => setSellingOption(option);


    const handleFillClick = (value) => {
        if (value === fillActive) {
            return;
        }
        setFillActive(value);
    };

    useEffect(async () => {

        if (Cookies.get('token') == null) {
            window.location = '/';
        }
        else {
            const fetch_user_nfts = async (id) => {

                setUserNfts([]);

                let nfts = await user_services.get_nfts(id);

                await Promise.all(nfts.nfts.map(async (element) => {
                    let asset = await asset_services.get_asset(element.contractAddress, element.tokenId, "meta");
                    let a = { "asset": asset, "token": element.tokenId, "contract": element.contractAddress }
                    console.log(a)
                    setUserNfts(user_nfts => [...user_nfts, a])
                }));
            };

            let token = Cookies.get('token');
            let res = await collection_services.get_my_collection(token);

            if (res != null) {
                setCollections(res);
            }

            fetch_user_nfts(localStorage.getItem("wallet"))
        }
    }, []);

    let getOnSaleNfts = async (event) => {

        const fetch_onSale_nfts = async () => {

            setOnSale([]);

            let nfts = await market_services.getMarketItems(localStorage.getItem('wallet'));

            await Promise.all(nfts.map(async (element) => {
                let asset = await asset_services.get_asset(element.contract, element.token, "meta");
                let a = { "asset": asset, "token": element.token, "contract": element.contract, "price": element.cost }
                setOnSale(onsale_nfts => [...onsale_nfts, a])
            }));
        };

        fetch_onSale_nfts();
    }


    let handleSubmit = async (event) => {
        event.preventDefault()

        let token = event.target[0].value;
        let contract = event.target[1].value;
        let collection_id = event.target[2].value;
        let res = await collection_services.update_collection(token, contract, collection_id, Cookies.get('token'));

        alert(res.status);
    }

    let fetchAuctions = async (event) => {
        const fetch_auctions = async () => {

            setAuctions([]);

            let nfts = await market_services.getMarketItems(localStorage.getItem('wallet'), true);

            await Promise.all(nfts.map(async (element) => {
                let asset = await asset_services.get_asset(element.contract, element.token, "meta");
                let a = { "asset": asset, "token": element.token, "contract": element.contract, "highestBid": element.highestBid, "endAt": element.endAt }
                setAuctions(auctions => [...auctions, a])
            }));
        };

        fetch_auctions();
    }

    let createAuctionHandler = async (event) => {
        event.preventDefault()

        let tokenID = event.target[0].value;
        let contract = event.target[1].value;
        let date = new Date(document.getElementById("datetime").value)
        let price = event.target[3].value;

        let res = await market_services.create_auction(contract, tokenID, price, date, Cookies.get('token'));
        if (res["status"]) {
            alert(res["status"]);
            return;
        }

        try {
            if (res != null) {

                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: res.to,
                                from: res.from,
                                data: res.data,
                                gas: '100000',
                                value: '0x2386F26FC10000'
                            }
                        ],
                    });

                alert("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash);
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    let sellNftHandler = async (event) => {
        event.preventDefault()

        let tokenID = event.target[0].value;
        let contract = event.target[1].value;
        let price = event.target[2].value;

        console.log(tokenID);

        let res = await market_services.sell_nft(contract, tokenID, price, Cookies.get('token'));

        if (res["status"]) {
            alert(res["status"]);
            return;
        }

        try {
            if (res != null) {

                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: res.to,
                                from: res.from,
                                data: res.data,
                                gas: '100000',
                                value: '0x2386F26FC10000'
                            }
                        ],
                    });

                alert("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash);
            }

        }
        catch (err) {
            console.log(err)
        }
    }


    let stopSaleHandler = async (event) => {

        event.preventDefault()

        let tokenID = event.target[0].value;
        let contract = event.target[1].value;

        let res = await market_services.stopSale(contract, tokenID, Cookies.get('token'));

        try {
            if (res != null) {

                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: res.to,
                                from: res.from,
                                data: res.data,
                                gas: '100000',
                            }
                        ],
                    });

                alert("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash);
            }

        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <main>
            <MDBContainer>
                <MDBCol className='pt-4'>
                    <MDBTabs fill style={{ fontSize: 18 }}>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleFillClick('tab1')} active={fillActive === 'tab1'}>
                                <MDBIcon fas icon="folder-minus" /> My NFTs
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => {

                                getOnSaleNfts();
                                handleFillClick('tab2');

                            }} active={fillActive === 'tab2'}>
                                <MDBIcon fas icon="paint-roller" /> On Sale
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => {
                                handleFillClick('tab3');
                                fetchAuctions();
                            }} active={fillActive === 'tab3'}>
                                <MDBIcon fas icon="stopwatch" /> On Auction
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>
                    <hr style={{ marginTop: 0, marginBottom: 18 }} />

                    <MDBTabsContent>
                        {/* TAB 1 ================================================================================ TAB 1 */}
                        <MDBTabsPane show={fillActive === 'tab1'}>

                            <MDBRow className='pt-3'>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Name</th>
                                            <th scope='col'>Contract</th>
                                            {/* <th scope='col'>Description</th> */}
                                            <th scope='col'>Collection</th>
                                            <th scope='col'>Sell NFT</th>
                                            {/* <th scope='col'>Update</th> */}
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody >
                                        {user_nfts ? user_nfts.map((nft, i) => {
                                            return (
                                                <tr className='mycollection-table'>
                                                    <th scope='row'>
                                                        <a href={`/asset/${nft.contract}/${nft.token}`}>
                                                            <img className='mycollection-avatar' src={AssertURL.convert_img(nft.asset.imgURL)} ></img>
                                                        </a>
                                                    </th>
                                                    <td>{nft.asset.name}</td>
                                                    <td>{nft.contract}</td>
                                                    {/* <td>{nft.asset.description}</td> */}
                                                    <td>
                                                        <form onSubmit={handleSubmit}>

                                                            <input hidden='true' value={nft.token}></input>
                                                            <input hidden='true' value={nft.contract.slice(0, 3) + '...' + nft.contract.slice(10)}></input>


                                                            <span style={{ display: '-webkit-box' }}>
                                                                <select className='form-select w-50' name='collection'>
                                                                    <option>Collection</option>

                                                                    {collections.map((c, i) => {
                                                                        return <option value={c._id}>{c.name}</option>
                                                                    })}
                                                                </select>
                                                                <div style={{ width: 4 }}>

                                                                </div>
                                                                <MDBBtn className='ml-2 pl-2' color='success'><MDBIcon fas icon="save" />  Update</MDBBtn>
                                                            </span>
                                                        </form>
                                                    </td>
                                                    <td>
                                                        <MDBBtn color='warning'
                                                            data-contract={nft.contract} data-token={nft.token}
                                                            onClick={() => {
                                                                toggleModal();
                                                                console.log(nft.token);
                                                                setSelectedNFT({
                                                                    "token": nft.token,
                                                                    "contract": nft.contract,
                                                                    "img": AssertURL.convert_img(nft.asset.imgURL),
                                                                    "name": nft.asset.name
                                                                })
                                                            }}
                                                        >
                                                            <MDBIcon fas icon="shopping-cart" /> Sell NFT
                                                        </MDBBtn>

                                                        {/* <form onSubmit={sellNftHandler}>
                                                            <input hidden='true' value={nft.token}></input>
                                                            <input hidden='true' value={nft.contract}></input>
                                                            <input placeholder='Price'></input>
                                                            <MDBBtn color='success'>Sell NFT</MDBBtn>

                                                        </form> */}

                                                    </td>
                                                </tr>
                                            );
                                        }) : '...'}

                                    </MDBTableBody>
                                </MDBTable>

                            </MDBRow>
                        </MDBTabsPane>

                        {/* TAB 2 ================================================================================ TAB 2 */}
                        <MDBTabsPane show={fillActive === 'tab2'}>
                            <MDBRow className='pt-3'>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Token</th>
                                            <th scope='col'>Name</th>
                                            {/* <th scope='col'>Current Price</th> */}
                                            <th scope='col'>Withdrawn</th>

                                            {/* <th scope='col'>Description</th> */}
                                            {/* <th scope='col'>Update</th> */}
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody >
                                        {onsale_nfts ? onsale_nfts.map((nft, i) => {
                                            return (
                                                <tr className='mycollection-table'>
                                                    <th scope='row'>
                                                        <a href={`/asset/${nft.contract}/${nft.token}`}>
                                                            <img className='mycollection-avatar' src={AssertURL.convert_img(nft.asset.imgURL)} ></img>
                                                        </a>
                                                    </th>
                                                    <td>{nft.token}</td>
                                                    <td>{nft.asset.name}</td>
                                                    {/* <td><MDBIcon fab icon="ethereum" /> {(parseInt(nft.price) / 1e18).toLocaleString()}</td> */}
                                                    <td>
                                                        <form onSubmit={stopSaleHandler}>
                                                            <input hidden='true' value={nft.token}></input>
                                                            <input hidden='true' value={nft.contract}></input>
                                                            <MDBBtn color='danger' type='submit'>Widthdraw Sale</MDBBtn>
                                                        </form>
                                                    </td>

                                                    {/* <td>{nft.asset.description}</td> */}
                                                </tr>
                                            );
                                        }) : '...'}

                                    </MDBTableBody>
                                </MDBTable>
                            </MDBRow>
                        </MDBTabsPane>

                        {/* TAB 3 ================================================================================ TAB 3 */}
                        <MDBTabsPane show={fillActive === 'tab3'}>
                            <MDBRow>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Contract</th>
                                            <th scope='col'>Token</th>
                                            <th scope='col'>Name</th>
                                            <th scope='col'>Highest Bid</th>
                                            <th scope='col'>Time Left</th>

                                            {/* <th scope='col'>Description</th> */}
                                            {/* <th scope='col'>Update</th> */}
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody >
                                        {auctions ? auctions.map((nft, i) => {
                                            return (
                                                <tr className='mycollection-table'>
                                                    <th scope='row'>
                                                        <a href={`/asset/${nft.contract}/${nft.token}`}>
                                                            <img className='mycollection-avatar' src={AssertURL.convert_img(nft.asset.imgURL)} ></img>
                                                        </a>
                                                    </th>
                                                    <td>{nft.contract}</td>
                                                    <td>{nft.token}</td>
                                                    <td>{nft.asset.name}</td>
                                                    <td><MDBIcon fab icon="ethereum" /> {(parseInt(nft.highestBid) / 1e18).toLocaleString()}</td>
                                                    <td><MDBBtn color='warning' href={`/asset/${nft.contract}/${nft.token}`}>See Listing</MDBBtn></td>

                                                    {/* <td>{nft.asset.description}</td> */}
                                                </tr>
                                            );
                                        }) : '...'}

                                    </MDBTableBody>
                                </MDBTable>
                            </MDBRow>
                        </MDBTabsPane>

                    </MDBTabsContent>


                </MDBCol>


            </MDBContainer>

            <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>You're Going To Sell Your NFT</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <p> <u>Selected NFT:</u> {selectedNFT ? selectedNFT.name : ''} </p>
                            <p> <u>Selected token:</u> {selectedNFT ? parseInt(selectedNFT.token, 16) : '.'}</p>

                            <img src={selectedNFT ? selectedNFT.img : ''} width={150}></img>

                            <p className='mb-5'>
                                Dear user, you have two options two make create selling.

                            </p>


                            {sellingOption == 'default' ?
                                <MDBRow>
                                    <MDBCol>
                                        <MDBBtn className='w-100' onClick={() => { changeSelling('bid') }}>Create Bidding</MDBBtn>
                                    </MDBCol>

                                    <MDBCol className='floatRight'>
                                        <MDBBtn className='w-100' onClick={() => { changeSelling('onehand') }}> Create One-hand Sale</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                                : ''}

                            {sellingOption == 'onehand' ?
                                <form onSubmit={sellNftHandler}>
                                    <input hidden='true' value={selectedNFT.token}></input>
                                    <input hidden='true' value={selectedNFT.contract}></input>
                                    <MDBInput type={'text'} placeholder='Price'></MDBInput>
                                    <MDBBtn color='success'>Sell NFT</MDBBtn>
                                </form>
                                : ''}

                            {sellingOption == 'bid' ?
                                <form onSubmit={createAuctionHandler}>
                                    <input hidden='true' value={selectedNFT.token}></input>
                                    <input hidden='true' value={selectedNFT.contract}></input>

                                    <br />
                                    <p>Select the end date of bid</p>
                                    <MDBInput id='datetime' name='date' type={'datetime-local'}></MDBInput>

                                    <p>Minimum price</p>
                                    <MDBInput name='price' type={'text'} placeholder='Price'></MDBInput>
                                    <MDBBtn color='success'><MDBIcon fas icon="shopping-cart" />  Sell NFT</MDBBtn>
                                </form>
                                : ''}

                        </MDBModalBody>

                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </main>
    );
}

export default MyNft;
