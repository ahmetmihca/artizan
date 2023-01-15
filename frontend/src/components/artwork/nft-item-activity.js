import { MDBIcon, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBTable, MDBTableBody, MDBTableHead, MDBBtn } from 'mdb-react-ui-kit';
import '.././style/css-itemactivity.css';


/** 
 * @param {{table: Array }} props 
 */

function ItemActivity(props) {

    let tr_table = props.table;
    console.log(tr_table)

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
                                <th>From</th>
                                <th>To</th>
                                <th>View Transaction</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody className='item-activity__tbody'>

                            {tr_table ? tr_table.map((element, i) => {
                                return (
                                    <tr>
                                        {parseInt(element.from, 16) == 0 ?
                                            <td><MDBIcon far icon="hand-paper" /><span> Mint</span></td> : <td><MDBIcon fas icon="exchange-alt" /><span> TX</span></td>
                                        }
                                        <td  ><a href="#" className='addr'>{element.from}</a></td>
                                        <td ><a href="#" className='addr'>{element.to}</a></td>
                                        <td><MDBIcon fas icon="file-import" /><a href={'https://mumbai.polygonscan.com/tx/' + element.tx_hash} target="_blank" rel="noreferrer"> See</a></td>
                                    </tr>
                                );
                            }) : '...'}


                        </MDBTableBody>
                    </MDBTable>
                </MDBCardBody>
            </MDBCard>
        </div>
    );
}

export default ItemActivity;