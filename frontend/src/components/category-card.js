import {  MDBCard, MDBCardBody, MDBCardImage } from 'mdb-react-ui-kit';
import './style/css-category-card.css';
function CategoryCard(props) 
{
    const name = props.name;
    const img = props.img;
  return (
      <MDBCard className='category-card'>
          <MDBCardImage src={img} className="category-card-img">
              
          </MDBCardImage>
          <MDBCardBody>
            <h4 className='text-center'>{name}</h4>
          </MDBCardBody>
      </MDBCard>
  );
}

export default CategoryCard;