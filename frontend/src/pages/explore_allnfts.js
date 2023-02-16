import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";

import { useEffect, useState } from "react";
import AssetServices from "../services/asset_serv";
import ProductCard from "../components/productCard";
import AssertURL from "../helpers/asset_url";

function Explore(props) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);

  const nftContractAddress =
    "0x3D8893443F72D437eBbBCe46e4B37dFB4CAe01fa".toLocaleLowerCase();

  useEffect(() => {
    const fetchCollections = async () => {
      const result = await AssetServices.get_all_assets();

      // Eliminate NFTs which are minted on older/outdated contracts
      const resultUpToDate = result.filter(
        (item) => item.contract.toLocaleLowerCase() == nftContractAddress
      );

      setItems(resultUpToDate);
      setIsLoading(false);
      return result;
    };

    fetchCollections();
  }, []);

  return (
    <main>
      <MDBContainer className="mt-3">
        <MDBRow className="d-flex justify-content-center">
          {isLoading ? (
            <div>loading</div>
          ) : (
            items.map((item, i) => (
              <MDBCol size="3">
                <ProductCard
                  img={AssertURL.convert_img(item.metadata.imgURL)}
                  name={item.metadata.name}
                  address={item.contract}
                  token={item.tokenID}
                />
              </MDBCol>
            ))
          )}
        </MDBRow>
      </MDBContainer>
    </main>
  );
}

export default Explore;
