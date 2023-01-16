import { MDBIcon, MDBCard,MDBCardBody, MDBRow, MDBCol, MDBTable, MDBTableBody, MDBTableHead} from 'mdb-react-ui-kit';
import '.././style/css-itemactivity.css';

function ItemActivity(props) 
{
  return (
      <div>
          <MDBCard className="my-4 item-activity--card">
                <MDBCardBody className='item-activity--card__body'>
                    <MDBCol className='border-bottom item-activity--card__title'>
                        <MDBIcon icon="exchange-alt" />
                        <span
                        className="align-middle">Item Activity</span>
                    </MDBCol>
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>Event</th>
                                <th>Price</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody className='item-activity__tbody'>
                            <tr>
                                <td><MDBIcon icon="tag" /><span>
                                    List</span></td>
                                <td><MDBIcon fab icon="ethereum"  style={{color:"#A30774"} } /> <span>0,75</span></td>
                                <td><a href="#">Sadigulbey</a></td>
                                <td><a href="#">sadi</a></td>
                                <td><span href="#972384">A day ago</span></td>
                            </tr>
                            <tr>
                                <td><MDBIcon icon="shopping-cart" /><span>
                                    Sale</span></td>
                                <td><MDBIcon fab icon="ethereum"  style={{color:"#A30774"} } /> <span>0,75</span></td>
                                <td><a href="#">Sadigulbey</a></td>
                                <td><a href="#">sadi</a></td>
                                <td><span href="#972384">A day ago</span></td>
                            </tr>
                            <tr>
                                <td><MDBIcon icon="exchange-alt" /><span>
                                    Transfer</span></td>
                                <td><MDBIcon fab icon="ethereum"  style={{color:"#A30774"} } /> <span>0,75</span></td>
                                <td><a href="#">Sadigulbey</a></td>
                                <td><a href="#">sadi</a></td>
                                <td><span href="#972384">A day ago</span></td>
                            </tr>

                            
                        </MDBTableBody>
                    </MDBTable>
                </MDBCardBody>
            </MDBCard>
      </div>
  );
}

export default ItemActivity;