import NFTCard from "../components/artwork/nft-card";
import PriceCard from "../components/artwork/price-card";
import ArtworkDetails from "../components/artwork/nft-details";
import "./style/css-artwork.css";
import {
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";
import ItemActivity from "../components/artwork/nft-item-activity";
import CollectionSlider from "../components/artwork/collection-slider";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AssetServices from "../services/asset_serv";
import AssetUrl from "../helpers/asset_url";
import user_services from "../services/user_serv";
import Cookies from "js-cookie";
import OfferCard from "../components/artwork/offer-card";

/**
 * @param {{contract: string, id: string, related: JSON }} props
 */
function Artwork() {
  const { contract, id, related } = useParams();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);
  const [collection, setCollection] = useState();

  const marketContractAddress =
    "0xaF47F2896Cf59F7620eB700B89DBb495C6aa944a".toLocaleLowerCase();

  useEffect(() => {
    const fetchCollections = async () => {
      console.log(id);
      const result = await AssetServices.get_asset(contract, id);
      const collection = await AssetServices.get_asset_collection(contract, id);

      if (
        result.activity[result.activity.length - 1].to.toLocaleLowerCase() ==
        marketContractAddress
      )
        result.notSale = false;
      else result.notSale = true;

      if (
        result.activity[result.activity.length - 1].from.toLocaleLowerCase() ==
        "0x0000000000000000000000000000000000000000"
      )
        result.notListed = true;
      else result.notListed = false;

      setItems(result);

      setCollection(collection);
      setIsLoading(false);
      return result;
    };

    fetchCollections();
    console.log(collection);
  }, []);

  async function add_favorite() {
    if (Cookies.get("token") == null) {
      alert("You need to login first");
    } else {
      let res = await user_services.addFavoriteNft(
        contract,
        id,
        Cookies.get("token")
      );
      alert(res.status);
    }
  }
  console.log("items:", items);

  return (
    <div>
      {isLoading ? (
        "..."
      ) : (
        <MDBContainer className="my-2">
          <MDBRow>
            <MDBCol className="col-5">
              {items.imgURL ? (
                <NFTCard img={AssetUrl.convert_img(items.imgURL)} />
              ) : (
                ".."
              )}
              <ArtworkDetails
                description={items.description}
                token_id={parseInt(id, 16)}
                chain={items.chain}
                contract_address={items.contract.address.substr(0, 10) + "..."}
                token_standard={items.contract.type}
              />
            </MDBCol>

            <MDBCol className="col-7 p-lg-1 p-5">
              <a href={"/collection/" + collection._id}>{collection.name}</a>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="my-4">
                  {items.name ? items.name : `#` + items.tokenID}
                </h2>
                <MDBBtn
                  style={{ height: 45, textAlign: "center", fontSize: 12 }}
                  onClick={() => add_favorite()}
                >
                  <MDBIcon icon="heart" size="lg"></MDBIcon>
                </MDBBtn>
              </div>

              <div className="owner-fav">
                {/* <span className="pr-4">Owned by <a href="#">ART3io</a></span> */}
                <MDBIcon icon="heart" className="px-2" />
                <span>{items.favorited ? items.favorited : "0"} Favorites</span>
              </div>

              {items.price ? (
                <PriceCard
                  notSale={items.notSale}
                  price={items.price}
                  token={id}
                  contract={contract}
                  notListed={items.notListed}
                ></PriceCard>
              ) : (
                ""
              )}
              {items.price == null ? (
                <PriceCard
                  notSale={items.notSale}
                  notListed={items.notListed}
                ></PriceCard>
              ) : (
                ""
              )}

              <ItemActivity table={items.activity}></ItemActivity>
            </MDBCol>
          </MDBRow>

          {related ? <CollectionSlider></CollectionSlider> : ""}
        </MDBContainer>
      )}
    </div>
  );
}

export default Artwork;
