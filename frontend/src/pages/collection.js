import {
    MDBContainer, MDBRow, MDBCol,
} from 'mdb-react-ui-kit';
import ProductCard from "../components/productCard";
import ColletionCard from "../components/collectionCard";
import { useParams } from 'react-router';
import { useEffect,useState } from 'react';
import CollectionServices from "../services/collection_serv"
import CollectionBanner from '../components/collectionBanner';
import AssetUrl from '../helpers/asset_url';
import utils from '../services/utils';
import asset_services from '../services/asset_serv';
import AssertURL from '../helpers/asset_url'

/** Profile Card Component
 * @param {{id: string }} props 
 */
function CollectionPage(props) {
    
    const { id } = useParams();

    const [collection, setCollection] = useState([])
    const [items, setItems] = useState([])

    const [isLoading, setIsLoading] = useState([true])
    const [isLoadingMeta, setIsLoadingMeta] = useState([true])


    useEffect(async ()=> {
        
        const fetch_collection_meta = async () =>{
            const res = await utils.search(0,"collection",id);
            let collection_response = res[0]
            setCollection(collection_response);
            console.log(collection_response);

            await Promise.all(collection_response.NFTs.map(async (element) => {
                let asset = await asset_services.get_asset(element.contract, element.tokenID, "meta");
                let a = { "asset": asset, "token": element.tokenID, "contract": element.contract }
    
                if(a.asset && a.asset.name && a.asset.imgURL){
                    console.log(a);
                    setItems(items => [...items, a])
                }
                else{
                    console.log("corrupted input");
                }
            }));

            setIsLoadingMeta(false);
            return collection_response.data;
        };

        // const fetchCollections = async () => {
        //     const result = await CollectionServices.get_nfts_under_collection(id);
        //     setItems(result)
        //     console.log(result);
        //     setIsLoading(false)
        //     return result;
        // }

        let collection_meta = await fetch_collection_meta();
        console.log(collection_meta);

        
        // fetchCollections();
    },[]);


    return (
        <main>
            <MDBContainer className='mt-3'>

                { isLoadingMeta ? "..." :
                <CollectionBanner
                    banner={'http://localhost:3001/public/collections/' + collection._id + "_banner.png"}
                    name={collection.name}
                    avatar={'http://localhost:3001/public/collections/' + collection._id + "_logo.png"}
                    description={collection.description}
                    id={id}
                />
                }

                
                <MDBRow className='d-flex justify-content-center'>

                { items.map((item,i) =>
                        <MDBCol size='2'>
                            {/* <CollectionCard 
                               name={item.name}
                                id='1'
                            /> */}
                            <ProductCard 
                                img= {AssertURL.convert_img(item.asset.imgURL)}
                                name={item.asset.name}
                                address={item.contract}
                                token={item.token}
                            />

                        </MDBCol>
                    )}
                </MDBRow>
            </MDBContainer>
        </main>
    );
}

export default CollectionPage;