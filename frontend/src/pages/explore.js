import {
    MDBContainer, MDBRow, MDBCol, MDBBtn
} from 'mdb-react-ui-kit';
import ProductCard from "../components/productCard";

import { useEffect, useState } from 'react';
import CollectionServices from "../services/collection_serv"
import CollectionCard from "../components/collectionCard";
import CategoryCard from '../components/category-card';

function Explore(props) {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState([true])

    useEffect(() => {
        const fetchCollections = async () => {
            const result = await CollectionServices.get_collections();
            setItems(result)
            setIsLoading(false)
            return result;
        }

        fetchCollections();
    }, []);


    return (

        <main>

            <MDBContainer className=''>
                <h3 className='text-center mt-4' style={{ color: "black" }}>Explore Artizan</h3>
                <MDBRow className='d-flex justify-content-center mt-5'>
                    <MDBCol className='d-flex justify-content-center' onClick={() =>{window.location = "/explore/art"} }>
                        <CategoryCard img="https://www.pictureframesexpress.co.uk/blog/wp-content/uploads/2020/05/7-Tips-to-Finding-Art-Inspiration-Header-1024x649.jpg" name="Art"></CategoryCard>
                    </MDBCol>
                    <MDBCol className='d-flex justify-content-center' onClick={() =>{window.location = "/explore/collectible"} }  >
                        <CategoryCard img="https://s32678.pcdn.co/wp-content/uploads/2022/01/nft-free.jpg" name="Collectibles"></CategoryCard>
                    </MDBCol>
                    <MDBCol className='d-flex justify-content-center' onClick={() =>{window.location = "/explore/gif"} }>
                        <CategoryCard img="https://img-s1.onedio.com/id-623c2bc6946ff15116e75466/rev-0/w-600/h-352/f-gif/s-2afe635e7566a33ee208e48cf11c9b2a53c57681.gif" name="Gifs" ></CategoryCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow className='d-flex justify-content-center mt-5'>
                    <MDBCol className='d-flex justify-content-center' onClick={() =>{window.location = "/explore/photography"} } >
                        <CategoryCard img="https://static.dw.com/image/59176388_101.jpg" name="Photography"></CategoryCard>
                    </MDBCol>
                    <MDBCol className='d-flex justify-content-center' onClick={() =>{window.location = "/explore/sports"} }>
                        <CategoryCard img="https://www.cliftonhillphysiotherapy.com.au/wp-content/uploads/2020/06/sport.jpg" name="Sports"></CategoryCard>
                    </MDBCol>
                </MDBRow>

            </MDBContainer>

            <MDBContainer className='mt-3'>

                <h3 className='text-center  mh-10' style={{ color: "black" }}>Collections</h3>

                <MDBRow className='d-flex justify-content-center'>

                    {isLoading ? <div>loading</div> : items.map((item, i) =>
                        <MDBCol size='3' className='mb-3'>
                            {/* <CollectionCard 
                               name={item.name}
                                id='1'
                            /> */}
                            <CollectionCard
                                img={'http://localhost:3001/public/collections/' + item._id + "_banner.png"}
                                avatar={'http://localhost:3001/public/collections/' + item._id + "_logo.png"}
                                name={item.name}
                                id={item._id}
                                description={item.description}
                            />
                        </MDBCol>
                    )}
                </MDBRow>
            </MDBContainer>
        </main>

    );
}

export default Explore;