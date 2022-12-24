import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import './style/productCard.css'
import { useNavigate } from "react-router-dom";
import collection_services from '../services/collection_serv';
import user_services from '../services/user_serv';
import Cookies from 'js-cookie';

/** Profile Card Component
 * @param {{banner: string, name: string, id: string, description: string, avatar: string }} props 
 */
function CollectionBanner(props) {

    return (
        <MDBCard className="mb-5 w-100">
            <MDBCardImage src={props.banner} className='collection-banner-t' position='top' alt='...' />

            <MDBCardBody className='p-2 text-center'>

                <img
                    src={props.avatar}
                    className='img-fluid rounded-circle collection-avatar'
                    alt=''
                />

                <h3 className='fw-light'>{props.name}</h3>

                <div className='collection-desc'>
                    <p className='fw-light'>{props.description}</p>
                </div>

                <MDBBtn color='light' onClick={async () => {
                    let res = await user_services.addWatchlist(Cookies.get('token'), props.id);
                    alert(res);
                }}><MDBIcon icon='plus'></MDBIcon> Add to Watchlist</MDBBtn>
            </MDBCardBody>

        </MDBCard>
    );
}

export default CollectionBanner;