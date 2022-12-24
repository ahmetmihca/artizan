import { MDBRow, MDBCol, MDBCardFooter, MDBCard, MDBCardBody, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import './style/productCard.css'
import { useNavigate } from "react-router-dom";
import AssertURL from "../helpers/asset_url"

/** 
 * @param {{img: string, name: string, favorited: string, className: string, offer: string, buyable: boolean, address: string, token: string, creator: string }} props 
 */

function ProductCard(props) {

    let navigate = useNavigate();
    const go_asset = () => {
        let path = `/asset/${props.address}/${props.token}`;
        navigate(path);
    }

    return (
        <MDBCard className={`mb-5 ${props.className}`} style={{ fontSize: 13, cursor: 'pointer' }} onClick={go_asset}>
            <MDBCardImage style={{ height: 180, backgroundSize: 'contain' }} src={AssertURL.convert_img(props.img)} position='top' alt='...' />

            <MDBCardBody className='p-2'>
                <MDBRow className='d-flex justify-content-between'>
                    <MDBCol className="text-start" size='md'>
                        {props.token ? <span className='fw-light'>Token { parseInt(props.token,16)} <br /></span> 
                            : <span></span>}
                        <span className='fw-bold'>{props.name}</span>
                    </MDBCol>

                    {props.offer != null ?

                        <MDBCol className="text-end" size='md'>
                            Best Offer <br />
                            <span className='fw-bold'>
                                <img className='eth-icon' src='/weth.svg'></img> {props.offer}
                            </span>
                        </MDBCol>
                        : <div></div>
                    }
                </MDBRow>
            </MDBCardBody>

            <MDBCardFooter className='text-muted p-2' >

                <MDBRow className='d-flex justify-content-between'>
                    {props.buyable ?
                        <MDBCol className="text-start" size='md'>
                            <a href=''>Buy Now</a>
                        </MDBCol>
                        : <div></div>}

                    <MDBCol className="text-end" size='md'>
                        {props.favorited}  <MDBIcon far icon="heart" />
                    </MDBCol>

                </MDBRow>

            </MDBCardFooter>
        </MDBCard>
    );
}

export default ProductCard;