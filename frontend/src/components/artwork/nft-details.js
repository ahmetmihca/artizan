import { MDBIcon, MDBCard,MDBCardBody, MDBRow, MDBCol, MDBBtn} from 'mdb-react-ui-kit';
import '.././style/css-nftdetails.css';


/** 
 * @param {{description: string, contract_address: string, token_id: string, token_standard: string, chain: string }} props 
 */
function ArtworkDetails(props) 
{
  return (
      <div >
          
            {props.description ? 
            <MDBCard id="nft-details" className="my-4">
                <MDBCardBody>
                    <MDBCol className='border-bottom ocard--title'>
                        <MDBIcon icon="book-open" />
                        <span
                        className="align-middle">Description</span>
                
                    </MDBCol>
                    <MDBCol className='nft-details--box'>
                        <span>{props.description}</span>
                    </MDBCol>
                </MDBCardBody>
            </MDBCard>
            : ''}

            <MDBCard id="nft-details" className="my-4">
                <MDBCardBody>
                    <MDBCol className='border-bottom ocard--title'>
                        <MDBIcon icon="clipboard-list" />
                        <span
                        className="align-middle">Details</span>
                
                    </MDBCol>
                    <MDBCol className='nft-details--box'>
                        <div className='clearfix'>
                            <p className='details--content'>Contract Address</p>
                            <a className='details--content' href=''>{props.contract_address}</a>
                        </div>
                        <div className='clearfix'>
                            <p className='details--content'>Token ID</p>
                            <a className='details--content' href=''>{props.token_id}</a>
                        </div>
                        
                        <div className='clearfix'>
                            <p className='details--content'>Token Standard</p>
                            <p className='details--content'>{props.token_standard}</p>
                        </div>
                        <div className='clearfix'>
                            <p className='details--content'>Blockchain</p>
                            <p className='details--content'>{props.chain}</p>
                        </div>
                        
                    </MDBCol>
                </MDBCardBody>
            </MDBCard>
      </div>
  );
}

export default ArtworkDetails;