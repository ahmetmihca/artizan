import '.././style/css-collection-slider.css';
import ProductCard from '../productCard';
import {MDBCol, MDBCard,MDBCardBody,MDBCardImage, MDBIcon, MDBBtn, MDBRow} from 'mdb-react-ui-kit';
function CollectionSlider(props)
{
    return(
        <MDBRow id="collection-slider--row">
            
            <MDBCard className='d-flex'>
                <MDBCol className='border-bottom collection-slider__title'>
                    <MDBIcon icon="th-large" />
                    <span
                    className="align-middle">More From This Collection</span>
                
                </MDBCol>
                <div className='collection-slider__panel'>
                    <MDBCardBody className='collection-slider__cbody d-flex'>
                        {[...Array(10)].map((object, i) =>
                            <MDBCol size='3' >
                                <ProductCard img='https://lh3.googleusercontent.com/nVuHipJMHvrwCg6lRYcj4xbgp3opdyqiUNxo0sVec-oSWpgQT-PR6BWqlBiKQqS4QcKaZ6JNsA4d3ZYs7vNDnyUan-zhNJQ251xxgd0=w287' />
                            </MDBCol>
                        )}
                    </MDBCardBody>
                </div>
                
            </MDBCard>
            
        </MDBRow>
    );
} 

export default CollectionSlider;