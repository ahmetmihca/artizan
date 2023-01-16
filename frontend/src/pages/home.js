import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBCarouselElement,
  MDBCarouselCaption,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import React from "react";
import CollectionCard from "../components/collectionCard";
import CollectionServices from "../services/collection_serv";
import "./style/css-home.css";
import { useEffect, useState } from "react";
import FeatureCard from "../components/home-feature-card";
import CategoryCard from "../components/category-card";
function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);

  useEffect(() => {
    const fetchCollections = async () => {
      const result = await CollectionServices.get_collections();
      setItems(result);
      setIsLoading(false);
      return result;
    };

    fetchCollections();
  }, []);

  return (
    <main>
      <div id="home-content">
        <div id="home-wrapper">
          <section id="home-content--spacer">
            <MDBRow className="home--banner">
              <MDBCol className="col-6">
                <MDBRow>
                  <h1>NFT Marketplace for Memberships </h1>
                  <h3 className="w-50 mt-2">
                    Unlock exclusive access with Artizan, the ultimate bridge
                    connecting companies and their loyal members.
                  </h3>
                </MDBRow>
                <MDBRow className="mt-5">
                  <MDBBtn
                    color="primary"
                    className="w-25 mx-3 home--banner__button"
                    onClick={() => {
                      window.location = "/explore";
                    }}
                  >
                    Explore
                  </MDBBtn>

                  {/* <MDBBtn outline color="primary" className='w-25 home--banner__button' onClick={() => {
                                        window.location = '/create';
                                    }}>Create</MDBBtn> */}
                </MDBRow>
              </MDBCol>
              <MDBCol className="col-6">
                <FeatureCard></FeatureCard>
              </MDBCol>
            </MDBRow>
            <MDBContainer className="mh-10">
              <h3 className="text-center mh-10" style={{ color: "black" }}>
                Top Collections
              </h3>
              <MDBRow className="d-flex justify-content-center">
                {isLoading ? (
                  <div>loading</div>
                ) : (
                  items.map((item, i) => (
                    <MDBCol size="3" className="mt-5">
                      <CollectionCard
                        img={
                          "http://localhost:3001/public/collections/" +
                          item._id +
                          "_banner.png"
                        }
                        avatar={
                          "http://localhost:3001/public/collections/" +
                          item._id +
                          "_logo.png"
                        }
                        name={item.name}
                        id={item._id}
                        description={item.description}
                      />
                    </MDBCol>
                  ))
                )}
              </MDBRow>
            </MDBContainer>
            <MDBContainer>
              <h3 className="text-center mh-10" style={{ color: "black" }}>
                Create and sell your NFTs
              </h3>
              <MDBRow className="d-flex justify-content-center">
                <MDBCol>
                  <div className="text-center mt-5">
                    <MDBIcon
                      icon="wallet"
                      className="center"
                      size="3x"
                      color="primary"
                    />
                  </div>
                  <h6 className="text-center mt-3">Set up your wallet</h6>
                  <p className="px-2 text-center">
                    Once you’ve set up your wallet of choice, connect it to
                    Artizan by clicking the wallet icon in the top right corner.
                  </p>
                </MDBCol>
                <MDBCol>
                  <div className="text-center mt-5">
                    <MDBIcon icon="palette" size="3x" color="primary" />
                  </div>
                  <h6 className="text-center mt-3">Create your collection</h6>
                  <p className="px-2 text-center">
                    Click My Collections and set up your collection. Add social
                    links, a description, profile and banner images, and set a
                    secondary sales fee.
                  </p>
                </MDBCol>
                <MDBCol>
                  <div className="text-center mt-5">
                    <MDBIcon far icon="image" size="3x" color="primary" />
                  </div>
                  <h6 className="text-center mt-3">Add your NFTs</h6>
                  <p className="px-2 text-center">
                    Upload your work (image, video, audio, or 3D art), add a
                    title and description, and customize your NFTs with
                    properties, stats, and unlockable content.
                  </p>
                </MDBCol>
                <MDBCol>
                  <div className="text-center mt-5">
                    <MDBIcon icon="tag" size="3x" color="primary" />
                  </div>
                  <h6 className="text-center mt-3">List them for sale</h6>
                  <p className="px-2 text-center">
                    Choose between fixed-price listings, and declining-price
                    listings. You choose how you want to sell your NFTs, and we
                    help you sell them!
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBContainer>

            <MDBContainer>
              <MDBRow className=" justify-content-center mt-5 mh-10">
                <MDBBtn
                  onClick={() => {
                    window.location = "/explore";
                  }}
                  style={{
                    width: "25vw",
                    marginTop: "5em",
                    marginBottom: "5em",
                    height: "50px",
                  }}
                >
                  Explore the marketplace
                </MDBBtn>
              </MDBRow>
            </MDBContainer>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Home;
