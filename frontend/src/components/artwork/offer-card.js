import { MDBIcon, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useEffect } from 'react';
import '.././style/css-offercard.css';

/** 
 * @param {{offers: JSON}} props 
 */
function OfferCard(props) {

    useEffect (() => {
        console.log(props.offers)
    })

    return (
        <div>
            <MDBCard className="my-4 ocard">
                <MDBCardBody className='ocard--body'>
                    <MDBCol className='border-bottom ocard--title'>
                        <MDBIcon icon="bars" />
                        <span
                            className="align-middle">Offers</span>
                    </MDBCol>
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>Price</th>
                                {/* <th>Floor Difference</th>
                                <th>Expiration</th> */}
                                <th>From</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody id="ocard--body__tbody">

                            {props.offers ? props.offers.map((element, i) => {
                                return (
                                    <tr>
                                        <td><MDBIcon fab icon="ethereum" style={{ color: "#A30774" }} /> <span>{element.value / 1e18} WETH</span></td>
                                        {/* <td><span>60% below</span></td>
                                        <td><span>about 2 hours</span></td> */}
                                        <td>{element.bidder}</td>
                                    </tr>
                                )
                            })
                                : ''}
                        </MDBTableBody>
                    </MDBTable>
                </MDBCardBody>

            </MDBCard>
        </div>
    );
}

export default OfferCard;