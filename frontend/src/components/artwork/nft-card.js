import '.././style/css-nftcard.css';
import {MDBCol, MDBCard,MDBCardBody,MDBCardImage, MDBIcon, MDBCardText} from 'mdb-react-ui-kit';

/** Profile Card Component
 * @param {{img: string, like: string }} props 
 */
function NFTCard(props)
{
    console.log(props.img)

    return(
        <MDBCol id="nft-img-col">
            <MDBCard>
                <MDBCardBody className='clearfix'>
                    <MDBIcon icon="lock" />
                    <div id="fav" className='clearfix'>
                        <MDBIcon far icon="heart" className='mx-auto p-1'/>
                        <span className="fw-light">{props.like}</span>
                    </div>
                </MDBCardBody>
                {/* <MDBCardImage className="img-fluid nft-img" src={props.img}>

                </MDBCardImage> */}
                <MDBCardImage className="img-fluid nft-img" src={props.img}>

                </MDBCardImage>
            </MDBCard>
        </MDBCol>
    );
} 

export default NFTCard;