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
    const [biddingTime, setBiddingTime] = useState(0);
    const [bidding, setBidding] = useState(false);
    let bidTime = 0;

    useEffect(async () => {
        let curr = localStorage.getItem('currency');
        setCurrency(curr)

        // setBidTime(props.bidEnds * 1000);
        bidTime = props.bidEnds;

        console.log(bidTime * 1000 > Date.now() );
        setBidding(bidTime * 1000 > Date.now());

        if (curr == 'eth') {
            setMoney(props.price)
        } else {
            let money = await currency_service.convert_rate(props.price)
            setMoney(money)
        }


        if (props.bidEnds) 
        {
            startTimer();
        }

    }, []);


    function startTimer() {
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;

        let bidCounter = setInterval(function () {

            var distance = (bidTime * 1000) - Date.now();

            if (distance < 0) {
                clearInterval(bidCounter);
                setBiddingTime('This Auction Ended!');
                return;
            }

            var days = Math.floor(distance / _day);
            var hours = Math.floor((distance % _day) / _hour);
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);

            setBiddingTime(days + 'days ' + hours + 'hrs ' + minutes + 'mins ' + seconds + 'secs');

        }, 1000);
    }

    let sendOffer = async () => {

        console.log(document.getElementById("offer").value);

        if (document.getElementById("offer").value < props.highestBid) {
            alert("You can not create a bid lower than highest bid");
            return;
        }

        let transactionContract =
            await market_service.sendBidOffer(props.token, document.getElementById("offer").value, Cookies.get('token'));

        try {
            if (transactionContract != null) {

                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: transactionContract.to,
                                from: localStorage.getItem('wallet'),
                                data: transactionContract.data,
                                gas: '100000',
                                value: (document.getElementById("offer").value * 1e18).toString(16)
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

                alert("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash);
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

                    {!props.notSale && props.isBidding == false ?
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
                                    <span>But This NFT</span>
                                    <MDBIcon icon="wallet" />
                                </MDBBtn>
                            </MDBCol>
                        </span>
                        : ''}

                    {props.isBidding && bidding ?
                        <div>
                            <MDBRow className='pcard--items'>
                                <span className='d-flex justify-content-between'>
                                    <span>Maximum bid</span>
                                    <span><b>Remaining Time</b>: {biddingTime} </span>
                                </span>
                            </MDBRow>
                            <MDBCol className='pcard--items pb-3'>
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
                                <span style={{ fontWeight: 'bolder', fontSize: 22 }}>{props.highestBid}</span>
                            </MDBCol>
                            <MDBCol className='d-flex' style={{ display: 'grid' }}>
                                <MDBInput id='offer' className='text flex-fill' placeholder='Your offer'></MDBInput>
                                <div style={{ width: 5 }}>

                                </div>
                                <MDBBtn color='warning' className='flex-fill' onClick={sendOffer}>
                                    <span>Send an offer  </span>
                                    <MDBIcon icon="wallet" />
                                </MDBBtn>
                            </MDBCol>
                        </div>
                        : ''}

                    {props.notSale && props.isBidding == false ?
                        <span>

                            <MDBRow className='pcard--items'>
                                <span>This asset is not currently sold by the seller.</span>
                            </MDBRow>
                            <MDBCol>
                                <MDBBtn color='light' className='pcard--button disabled w-100'>
                                    <span>Place Bid</span>
                                    <MDBIcon icon="wallet" />
                                </MDBBtn>
                            </MDBCol>
                        </span>
                        : ''
                    }

                </MDBCardBody>
            </MDBCard>
        </div>
    )
}


export default PriceCard;