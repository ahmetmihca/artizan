import {
    MDBContainer, MDBRow, MDBCol, MDBBtn
} from 'mdb-react-ui-kit';
import ProductCard from "../components/productCard";

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CollectionServices from "../services/collection_serv"
import CollectionCard from "../components/collectionCard";

/** Profile Card Component
 * @param {{category: string }} props 
 */
function ExploreCategory(props) {

    const { category } = useParams();

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState([true])

    useEffect(() => {
        const fetchCollections = async () => {
            console.log(category);
            const result = await CollectionServices.get_collections(category);
            setItems(result)
            setIsLoading(false)
            return result;
        }
        fetchCollections();
    }, []);

    return (

        <main>

            <MDBContainer className='mt-3'>

                <h3 className='text-center' style={{ color: "black" }}>{category.toUpperCase()} Collections</h3>

                <MDBRow className='d-flex justify-content-center'>

                    {isLoading ? <div>loading</div> : items.map((item, i) =>
                        <MDBCol size='3'>
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

export default ExploreCategory;