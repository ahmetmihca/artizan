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
import login_services from '../services/login_serv';
import metamask_operations from '../services/metamask';
import Cookies from 'js-cookie';
import collection_services from '../services/collection_serv';
import './style/css-mycollection.css'
import user_services from '../services/user_serv';


function Watchlist() {

    const [collections, setCollections] = useState(0);
    const [token, setToken] = useState();

    useEffect(async () => {

        if (Cookies.get('token') == null) {

            let walletId = localStorage.getItem("wallet");

            if (walletId == null) {
                walletId = await metamask_operations.onLoginHandler();
            }

            let res = await login_services.get_nonce(walletId);
            console.log(res.user.nonce);

            console.log('0x' + walletId.toUpperCase().substring(2));

            let signature = await metamask_operations.signMessage(res.user.nonce, walletId);
            console.log(signature);

            let res2 = await login_services.login(res.user.nonce, signature);
            console.log(res2);
            document.cookie = `token=${res2.token}`
        }
        else {
            let token = Cookies.get('token');
            setToken(token);

            let res = await user_services.get_my_watchlist(token);
            console.log(res);

            if (res != null) {
                console.log(res.length);
                setCollections(res);
            }
        }
    }, []);



    return (
        <main>
            <MDBContainer>

                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Artizan ID</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Description</th>
                            <th scope='col'>Remove from Watchlist</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody >

                        {collections ? collections.map((collection, i) => {
                            return (
                                <tr className='mycollection-table'>
                                    <th scope='row'><img className='mycollection-avatar' src={'http://localhost:3001/public/collections/' + collection._id + "_logo.png"} ></img>  </th>
                                    <td>{collection._id}</td>
                                    <td>{collection.name}</td>
                                    <td>{collection.description}</td>
                                    <td><MDBBtn color='danger' onClick={() => user_services.removeWatchlist(token,collection._id)}>Remove</MDBBtn></td>
                                </tr>
                            );
                        }) : '...'}

                    </MDBTableBody>
                </MDBTable>
            </MDBContainer>
        </main>
    );
}

export default Watchlist;
