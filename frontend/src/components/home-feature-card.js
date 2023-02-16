import { MDBCol,MDBCard,MDBCardImage,MDBCardBody,MDBCardText,MDBBtn,MDBCardTitle } from "mdb-react-ui-kit";
import './style/css-feature-card.css';
function FeatureCard() 
{
  return (
      <div>
          <MDBCol >
            <MDBCard className="hoverable" style={{ borderRadius:"15px", borderTop:"0px solid #fff"}}>
                <MDBCardImage className="img-fluid" src="https://static01.nyt.com/images/2020/01/30/business/30Techfix-illo/29Techfix-illo-jumbo.gif?quality=75&auto=webp" waves style={{borderRadius:"15px 15px 0px 0px",}}/>
                <MDBCardBody className="mx-2 mb-2 mt-1">
                <MDBCardTitle style={{color: "black"}}>How many memberships are you using?</MDBCardTitle>
                <MDBCardText>
                    with Artizan you can manage your memberships in one place.
                </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </div>
      
  );
}

export default FeatureCard;