import { MDBCol,MDBCard,MDBCardImage,MDBCardBody,MDBCardText,MDBBtn,MDBCardTitle } from "mdb-react-ui-kit";
import './style/css-feature-card.css';
function FeatureCard() 
{
  return (
      <div>
          <MDBCol >
            <MDBCard className="hoverable" style={{ borderRadius:"15px", borderTop:"0px solid #fff"}}>
                <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.webp" waves style={{borderRadius:"15px 15px 0px 0px",}}/>
                <MDBCardBody className="mx-2 mb-2 mt-1">
                <MDBCardTitle style={{color: "black"}}>Modern Trauma</MDBCardTitle>
                <MDBCardText>
                    An example NFT
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </div>
      
  );
}

export default FeatureCard;