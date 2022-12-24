import {  MDBCard, MDBCardBody, MDBCardImage } from 'mdb-react-ui-kit';
import './style/productCard.css'
import { useNavigate } from "react-router-dom";

/** Profile Card Component
 * @param {{img: string, name: string, id: string, description: string, avatar: string }} props 
 */
function CollectionCard(props) {

    let navigate = useNavigate();
    const go_collection = () => {
        let path = `/collection/${props.id}`;
        navigate(path);
    }

    return (
        <MDBCard className="mb-5 w-100 collection-card h-100" style={{cursor : 'pointer'}} onClick={go_collection}>
            <MDBCardImage src={props.img} className='collection-banner' position='top' alt='...' />

            <MDBCardBody className='p-2 text-center'>

                <img
                    src={props.avatar}
                    className='img-fluid rounded-circle collection-avatar'
                    alt=''
                />

                <h3 className='fw-light'>{props.name}</h3>
                <div className='cardDesc-wrapper'>
                    <p className='fw-light cardDesc' style={{overflowWrap: 'break-word'}}>{props.description}</p>
                </div>
            </MDBCardBody>

        </MDBCard>
    );
}

export default CollectionCard;