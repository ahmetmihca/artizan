import {
    MDBContainer, MDBRow, MDBCol,
} from 'mdb-react-ui-kit';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import utils from '../services/utils';
import CollectionCard from '../components/collectionCard';
import ProfileCard from '../components/profileCard';
import ProductCard from '../components/productCard';
import AssetUrl from '../helpers/asset_url';
import SearchInput from '../components/search';

/** Profile Card Component
 * @param {{category: string, search: string }} props 
 */
function SearchPage(props) {

    const { category, search } = useParams();
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [items, setItems] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(async () => {
        let res = await utils.search(search, category);
        console.log(res)
        setItems(res);
    }, []);

    function sortItems() {
        let v = document.getElementById('sortby').value;
        console.log(v)

        if (v == 'Stars') {
            setItems(items.sort(function (a, b) {
                if (a.favorited == null) {
                    return -1;
                } if (b.favorited == null) {
                    return 1;
                }
                return parseInt(a.favorited) - parseInt(b.favorited);
            }).reverse())
        }
        if (v == 'Alphabetic') {
            setItems(items.sort(function (a, b) {
                return ('' + a.name).localeCompare(b.name);
            }))
        }

        setReload(!reload);
    }

    return (
        <main>
            <MDBContainer className='mt-3'>
                <MDBRow>
                    {category == "collection" && items != [] ? items.map((item, i) =>
                        <MDBCol size='3' className='mt-5'>
                            <CollectionCard
                                img={`http://localhost:3001/public/collections/${item._id}_banner.png`}
                                avatar={`http://localhost:3001/public/collections/${item._id}_logo.png`}
                                name={item.name}
                                description={item.description}
                                id={item._id}
                            />
                        </MDBCol>
                    ) : <span></span>}

                    {category == "user" && items != [] ? items.map((item, i) =>

                        <MDBCol size='3' className='mt-5'>

                            <a href={'/user/' + item.id} style={{ all: 'unset' }}>

                                <ProfileCard
                                    username={item.username}
                                    avatar={`http://localhost:3001/public/users/${item.id}_avatar.png`}
                                    bio={item.bio}
                                    wallet={item.id}
                                />
                            </a>

                        </MDBCol>
                    ) : <span></span>}





                    {category == "asset" ?
                        <main>
                            <MDBRow>
                                <MDBCol size='9'>
                                    <input id='search_profile' className='form-control' placeholder='🔎 Search NFT' onChange={(evt) => { setFilter(document.getElementById('search_profile').value) }}></input>
                                </MDBCol>
                                <MDBCol size='3'>
                                    <select id='sortby' className='form-select' onChange={sortItems}>
                                        <option>Stars</option>
                                        <option>Alphabetic</option>
                                    </select>
                                </MDBCol>
                            </MDBRow>


                            <MDBRow>
                                {reload ? items.filter(f => f.metadata.name.toLowerCase().includes(filter) || filter === '').map((item, i) =>

                                    <MDBCol size='2' className='mt-5'>

                                        <ProductCard name={item.metadata.name}
                                            img={AssetUrl.convert_img(item.metadata.imgURL)}
                                            address={item.contract}
                                            token={item.tokenID}
                                            favorited={item.favorited} >
                                        </ProductCard>

                                    </MDBCol>
                                ) :
                                    items.filter(f => f.metadata.name.toLowerCase().includes(filter) || filter === '').map((item, i) =>

                                        <MDBCol size='2' className='mt-5'>

                                            <ProductCard name={item.metadata.name}
                                                img={AssetUrl.convert_img(item.metadata.imgURL)}
                                                address={item.contract}
                                                token={item.tokenID}
                                                favorited={item.favorited} >
                                            </ProductCard>

                                        </MDBCol>
                                    )
                                }
                            </MDBRow>
                        </main>
                        : <span></span>}

                </MDBRow>


            </MDBContainer>
        </main>
    );
}

export default SearchPage;