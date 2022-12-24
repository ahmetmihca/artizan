import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBIcon, MDBBtnGroup } from 'mdb-react-ui-kit';


/** Profile Card Component
 * @param {{username: string, bio: string, avatar: string, joined: string, wallet: string}} props 
 */
function ProfileCard(props) {
    return (
        <MDBCard className="mb-5 w-100"  >
            <MDBCardImage className='px-3' src={props.avatar} position='top' alt='...' />
            <MDBCardBody className='px-3'>
                <MDBCardTitle>@ { props.username }</MDBCardTitle>
                <MDBCardText className='fw-light'>
                    { props.bio }
                </MDBCardText>

                {/* <MDBBtnGroup className='w-100' shadow='0' aria-label='Basic example'>
                    <MDBBtn outline>
                        <span className='fw-bold' style={{ fontSize: 18 }} >10</span> <br /> Items
                    </MDBBtn>
                    <MDBBtn outline>
                        <span className='fw-bold' style={{ fontSize: 18 }} >0</span> <br /> Owner
                    </MDBBtn>
                    <MDBBtn outline>
                        <span className='fw-bold' style={{ fontSize: 18 }} >0</span> <br /> Traded
                    </MDBBtn>
                </MDBBtnGroup> */}

                <hr />

                <MDBCardText style={{fontSize: 14}} >
                    <MDBIcon fas icon="wallet" /> <b>Wallet Address</b> 
                    <span style={{overflowWrap: 'break-word'}}>  {props.wallet}</span> 
                </MDBCardText>

                {/* <MDBCardText style={{fontSize: 14}}>
                    <MDBIcon fas icon="calendar" /> <span className='fw-light'>Joined</span>  <span className='fw-bold'> {props.joined} </span> 
                </MDBCardText> */}


                {/* <MDBBtn href='#' className='px-2 py-2'><MDBIcon fas icon="user-plus" />  Follow</MDBBtn> */}
            </MDBCardBody>
        </MDBCard>
    );
}

export default ProfileCard;