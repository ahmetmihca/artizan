import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBContainer,
    MDBBtn,
    MDBRow
} from 'mdb-react-ui-kit';
import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './style/css-mycollection.css'
import user_services from '../services/user_serv';
import asset_services from '../services/asset_serv';
import AssertURL from '../helpers/asset_url';



function Favorites() {

    const [nfts, setNfts] = useState([]);
    const [token, setToken] = useState(0);

    useEffect(async () => {

        if (Cookies.get('token') == null) 
        {
            alert("It has been succesfully added to favorites!");
            window.location = '/';
        }
        else {
            let tokenz = Cookies.get('token');
            await setToken(tokenz);
            
            await fetch_user_favorited();
        }
    }, []);

    async function removeFavorite(event){
        console.log(token);
        let contract = event.currentTarget.dataset.contract;
        let ctoken = event.currentTarget.dataset.token;
        await user_services.removeFavoriteNft(contract,ctoken,token);
        window.location = '/favorites';
    }

    const fetch_user_favorited = async () => {
     
        let nftsz = await user_services.get_my_favorites(Cookies.get('token'));

        for (const element of nftsz) {
            let asset = await asset_services.get_asset(element.contract, element.tokenID,"meta");
            let a = { "asset": asset, "token": "0x" + element.tokenID.toString(16), "contract": element.contract }
            setNfts(nfts => [...nfts,a])
            console.log(nfts)
        };
    };

    return (
        <main>
            <MDBContainer>

                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Contract</th>
                            <th scope='col'>TokenID</th>
                            <th scope='col'>Remove</th>

                        </tr>
                    </MDBTableHead>
                    <MDBTableBody >

                        {nfts ? nfts.map((nft, i) => {
                            return (
                                <tr className='mycollection-table'>
                                    <th scope='row'><a href={`/asset/${nft.contract}/${nft.token}`}><img className='mycollection-avatar' src={AssertURL.convert_img(nft.asset.imgURL)}></img></a></th>
                                    <td>{nft.contract}</td>
                                    <td>{nft.token}</td>
                                    <td><MDBBtn color='danger' data-contract={nft.contract} data-token={nft.token} onClick={removeFavorite}>Remove</MDBBtn></td>
                                </tr>
                            );
                        }) : '...'}

                    </MDBTableBody>
                </MDBTable>
            </MDBContainer>
        </main>
    );
}

export default Favorites;
