import Cookies from 'js-cookie';
import React, { useState, useEffect } from "react";
import { MDBIcon, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import '.././style/css-pricecard.css';
import currency_service from '../../services/currency';
import market_service from '../../services/market_serv';

/** 
 * @param {{notSale: boolean, price: BigInteger, token: string, contract: string, isBidding: boolean, bidEnds: BigInt, highestBid: BigInt}} props 
 */
function PriceCard(props) {

    const [currency, setCurrency] = useState(0);
    const [money, setMoney] = useState(0);


    let buyNft = async () => {

        if (localStorage.getItem('wallet') == null) {
            alert("You need to login to buy NFT");
            return;
        }

        let transactionContract =
            await market_service.buyNft(props.contract, props.token, props.price, localStorage.getItem('wallet'), Cookies.get('token'));

        try {
            if (transactionContract != null) {

                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: transactionContract.to,
                                from: transactionContract.from,
                                data: transactionContract.data,
                                gas: '100000',
                                value: (props.price * 1e18).toString(16)
                            }
                        ],
                    });

                alert("✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/" + txHash);
            }

        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div>
            <MDBCard className="my-4">
                <MDBCardBody>

                    {!props.notSale?
                        <span>
                            <MDBRow className='pcard--items'>
                                <span><u>Owner is selling this awesome NFT with price of:</u></span>
                            </MDBRow>
                            <MDBCol className='pcard--items'>

                                {(() => {
                                    if (currency == 'eth') {
                                        return <MDBIcon fab icon="ethereum" className="pr-2" style={{ color: "#A30774" }} size="2x" />
                                    }
                                    else if (currency == 'usd') {
                                        return <MDBIcon fas icon="dollar-sign" className="pr-2" style={{ color: "#335755" }} size="2x" />
                                    }
                                    else if (currency == 'try') {
                                        return <span>TRY</span>
                                    }
                                })()}
                                <span style={{ fontWeight: 'bolder', fontSize: 22 }}>{money}</span>
                            </MDBCol>
                            <MDBCol>
                                <MDBBtn className='pcard--button w-100' onClick={buyNft}>
                                    <span>Buy This NFT</span>
                                    <MDBIcon icon="wallet" />
                                </MDBBtn>
                            </MDBCol>
                        </span>
                        : ''}


                </MDBCardBody>
            </MDBCard>
        </div>
    )
}


export default PriceCard;