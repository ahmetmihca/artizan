import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBContainer,
    MDBBtn,
    MDBRow,
    MDBIcon,
    MDBCol,
} from 'mdb-react-ui-kit';

import { useEffect, useState } from 'react';
import CategoryCard from '../components/category-card';
import asset_services from '../services/asset_serv';
import stat_services from '../services/stats';
import AssetURL from "../helpers/asset_url"


function Stats(props) {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState([true])

    const [stat_nfts, setStatNfts] = useState([]);
    const [stat_collections, setStatCollections] = useState([]);
    const [stat_creators, setStatCreators] = useState([]);

    const [selected, setSelected] = useState("collection");


    useEffect(async () => {
        setStatCollections([]);
        let r = await get_stats("collection");
        setStatCollections(r);

        setStatNfts([]);
        let r1 = await get_stats("nft");
        
        await Promise.all(r1.map(async (element) => {
            let asset = await asset_services.get_asset(element.contract, element.tokenID, "meta");
            let a = { "asset": asset, "d": element }
            console.log(a)
            setStatNfts(r1 => [...r1, a])
        }));


        setStatCreators([]);
        let r2 = await get_stats("creator?detailed=1");
        setStatCreators(r2);
    }, []);

    async function get_stats(type) {
        let res = await stat_services.top_stats(type);
        return res;
    }


    return (

        <main>

            <MDBContainer className=''>
                <h3 className='text-center mt-4' style={{ color: "black" }}>Top's in Artizan</h3>
                <MDBRow className='d-flex justify-content-center mt-5'>
                    <MDBCol className='d-flex justify-content-center' onClick={() => { setSelected("nft") }}>
                        <CategoryCard img="https://bestanimations.com/media/art/1239412842van-gogh-art-animated-gif-1.gif" name="NFT"></CategoryCard>
                    </MDBCol>
                    <MDBCol className='d-flex justify-content-center' onClick={() => { setSelected("collection") }}  >
                        <CategoryCard img="https://s32678.pcdn.co/wp-content/uploads/2022/01/nft-free.jpg" name="Collection"></CategoryCard>
                    </MDBCol>
                    <MDBCol className='d-flex justify-content-center' onClick={() => { setSelected("creator") }}>
                        <CategoryCard img="https://media4.giphy.com/media/M52wyuahvQfJK/giphy.gif" name="Creator" ></CategoryCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            <MDBContainer className='mt-3'>



                <MDBRow className='d-flex justify-content-center'>

                    {selected == "collection" ?
                        <main>

                            <h3 className='text-center mh-10' style={{ color: "black" }}>Top Collections</h3>
                            <br></br>

                            <MDBTable >
                                <MDBTableHead light>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Collection</th>
                                        <th scope='col'>Description</th>
                                        <th scope='col'>Watchers</th>
                                        <th>Explore</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody >
                                    {stat_collections ? stat_collections.sort((a) => a.watched).reverse().map((collection, i) => {
                                        return (
                                            <tr style={{ textAlign: 'center' }} className='mycollection-table'>
                                                <td width={200}><img className='rounded-circle' height={80} width={80} src={'http://localhost:3001/public/collections/' + collection._id + '_banner.png'}></img></td>
                                                <td>{collection.name}</td>
                                                <td>{collection.description.substring(0, 55) + ' ...'}</td>
                                                <td><b>{collection.watched}</b></td>
                                                <td><MDBBtn color='light' href={'/collection/' + collection._id} ><MDBIcon fas icon="external-link-alt" /> See</MDBBtn> </td>
                                            </tr>
                                        );
                                    }) : '...'}

                                </MDBTableBody>
                            </MDBTable>
                        </main>
                        : ''}

                    {selected == "creator" ?
                        <main>

                            <h3 className='text-center mh-10' style={{ color: "black" }}>Top Creators</h3>
                            <br></br>

                            <MDBTable>
                                <MDBTableHead light>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th scope='col'>#</th>
                                        <th>Rank</th>
                                        <th scope='col'>Creator</th>
                                        <th scope='col'>Minted NFTs</th>
                                        <th >View Profile</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody >
                                    {stat_creators ? stat_creators.sort((x) => x.count).reverse().map((creator, i) => {
                                        return (
                                            <tr style={{ textAlign: 'center' }} className='mycollection-table'>
                                                <td width={200}><img className='rounded-circle' height={80} width={80} src={'http://localhost:3001/public/users/' + creator.id + '_avatar.png'}></img></td>
                                                <td width={12}><b style={{ fontSize: 21 }}>{i + 1}</b></td>
                                                <td>{creator.user_obj.username}</td>
                                                <td>{creator.count}</td>
                                                <td><MDBBtn color='light' href={'/user/' + creator.id} ><MDBIcon fas icon="external-link-alt" /> See</MDBBtn> </td>
                                            </tr>
                                        );
                                    }) : '...'}

                                </MDBTableBody>
                            </MDBTable>
                        </main>
                        : ''}

                    {selected == "nft" ?
                        <main>

                            <h3 className='text-center mh-10' style={{ color: "black" }}>Top NFTs</h3>
                            <br></br>

                            <MDBTable>
                                <MDBTableHead light>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th scope='col'>#</th>
                                        <th>Name</th>
                                        <th>Favorited By</th>
                                        <th scope='col'>Transaction Volume</th>
                                        <th>Explore NFT</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody >
                                    {stat_nfts ? stat_nfts.filter((x) => x.d.value).reverse().map((nft, i) => {
                                        return (
                                            <tr style={{ textAlign: 'center' }} className='mycollection-table'>
                                                <td width={200}><img className='rounded-circle' height={80} width={80} src={AssetURL.convert_img(nft.asset.imgURL)}></img></td>
                                                <td>{nft.asset.name}</td>
                                                <td>{nft.asset.favorited}</td>
                                                <td>{nft.d.value / 1e18} <MDBIcon fab icon="ethereum" /> </td>
                                                <td><MDBBtn color='light' href={`/asset/${nft.d.contract}/${nft.d.tokenID}`}> <MDBIcon fas icon="external-link-alt" />  See NFT</MDBBtn> </td>
                                            </tr>
                                        );
                                    }) : '...'}

                                </MDBTableBody>
                            </MDBTable>
                        </main>
                        : ''}
                </MDBRow>
            </MDBContainer>
        </main>

    );
}

export default Stats;