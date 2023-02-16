import {
    MDBIcon, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBTable, MDBTableBody, MDBTableHead, MDBBtn,
    MDBPagination, MDBPaginationItem, MDBPaginationLink
} from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import '.././style/css-itemactivity.css';
import user_services from '../../services/user_serv';

/** 
 * @param {{user_id: String }} props 
 */

function UserActivity(props) {

    const [currentPage, setCurrentPage] = useState(0);
    const [table, setTable] = useState();


    useEffect(async () => {
        fetch_user_history(1);
    }, [])

    const fetch_user_history = async (page_id) => {

        if(page_id != -1)
        {
            setCurrentPage(page_id);
        }
        else
        {
            page_id = currentPage + 1;
        }

        let history = await user_services.get_history(props.user_id, page_id);
        console.log("sdasdasdas");
        setTable(history.response);
    };


    return (
        <div>
            <MDBTable>
                <MDBTableHead>
                    <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>See on Etherscan</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody className='item-activity__tbody'>

                    {table ? table.map((element, i) => {
                        return (
                            <tr>

                                {(() => {
                                    switch (element.type) {
                                        case 'Sale': return <td><MDBIcon fas icon="shopping-cart" /><span>{element.type}</span></td>;
                                        case 'Listing': return <td><MDBIcon fas icon="hand-paper" /><span>{element.type}</span></td>;
                                        case 'Mint': return <td><MDBIcon fas icon="stamp" /><span>{element.type}</span></td>;
                                        case 'Transfer': return <td><MDBIcon fas icon="exchange-alt" /><span>{element.type}</span></td>;
                                        default: return <td>< MDBIcon fas icon="exchange-alt" /><span>Transaction</span></td>;
                                    }
                                })()}

                                <td><MDBIcon far icon="calendar" /><span>{element.time}</span></td>
                                <td ><a href="#" className='addr'>{element.from}</a></td>
                                <td ><a href="#" className='addr'>{element.to}</a></td>
                                <td><MDBIcon fas icon="file-import" /><a href={'https://mumbai.polygonscan.com/tx/' + element.hash} target="_blank" rel="noreferrer"> See</a></td>
                            </tr>
                        );
                    }) : '...'}


                </MDBTableBody>
            </MDBTable>

            <nav aria-label='Page navigation example'>
                <MDBPagination center className='mb-0'>
                    <MDBPaginationItem disabled>
                        <MDBPaginationLink href='#' tabIndex={-1} aria-disabled='true'>
                            Previous
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink onClick={() => {fetch_user_history(1)}}>1</MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink onClick={() => {fetch_user_history(2)}}>2</MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink onClick={() => {fetch_user_history(3)}}>3</MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem>
                        <MDBPaginationLink onClick={() => {fetch_user_history(-1)}}>Next</MDBPaginationLink>
                    </MDBPaginationItem>
                </MDBPagination>
            </nav>

        </div >
    );
}

export default UserActivity;