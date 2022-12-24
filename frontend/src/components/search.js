import { MDBRow, MDBCol, MDBCardFooter, MDBCard, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import '../components/style/css-navbar.css'

/** Profile Card Component
 * @param {{img: string }} props 
 */
function SearchInput(props) {

    function onFieldChange(event) {
        // for a regular input field, read field name and value from the event
        const fieldValue = event.target.value;
        props.onChange(fieldValue);
    }

    return (
        <form className='d-flex input-group w-auto py-2'>
            <input type='search' className='form-control-custom' placeholder="Search for NFT's" aria-label='Search' onChange={(evt) => { onFieldChange(evt) }} />
            <MDBBtn className='text-center' color='primary' > <MDBIcon fas icon="search" style={{color: 'black'}} /></MDBBtn>
        </form>
    );
}

export default SearchInput;