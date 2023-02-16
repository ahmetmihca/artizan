import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import ProfileCard from "../components/profileCard";
import ProductCard from "../components/productCard";
import SearchInput from "../components/search";
import "../components/style/profile.css";
import metamask_operations from "../services/metamask";
import user_services from "../services/user_serv";
import { useParams } from "react-router";
import asset_services from "../services/asset_serv";
import Cookies from "js-cookie";
import AssertUrl from "../helpers/asset_url";
import UserActivity from "../components/artwork/user-item-activity";

/** Profile Card Component
 * @param {{id: string }} props
 */
function Profile(props) {
  const { id } = useParams();
  const [fillActive, setFillActive] = useState("tab1");
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState([]);
  const [user_nfts, setUserNfts] = useState([]);
  const [favorite_nfts, setFavorites] = useState([]);
  const [created_nfts, setCreated] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

  const nftContractAddress =
    "0x3D8893443F72D437eBbBCe46e4B37dFB4CAe01fa".toLocaleLowerCase();

  const handleFillClick = (value) => {
    if (value === fillActive) {
      return;
    }
    setFillActive(value);
  };

  useEffect(async () => {
    const fetch_user_nfts = async (id) => {
      setUserNfts([]);

      let nfts = await user_services.get_nfts(id);

      await Promise.all(
        nfts.nfts.map(async (element) => {
          let asset = await asset_services.get_asset(
            element.contractAddress,
            element.tokenId,
            "meta"
          );
          let a = {
            asset: asset,
            token: element.tokenId,
            contract: element.contractAddress,
          };

          if (
            a.asset &&
            a.asset.name &&
            a.asset.imgURL &&
            element.contractAddress === nftContractAddress
          ) {
            setUserNfts((user_nfts) => [...user_nfts, a]);
          } else {
            console.log("bad ", a);
          }
        })
      );
    };

    let user = await user_services.get_user(id);
    setUser(user.user);
    fetch_user_nfts(user.user.id);
  }, []);

  const fetch_user_favorited = async (id) => {
    if (!Cookies.get("token")) {
      alert("You need to login !");
    }

    if (favorite_nfts.length != 0) {
      return;
    }

    let nfts = await user_services.get_user_favorites(id);
    console.log(nfts);

    for (const element of nfts) {
      let asset = await asset_services.get_asset(
        element.contract,
        element.tokenID,
        "meta"
      );
      let a = {
        asset: asset,
        token: "0x" + element.tokenID.toString(16),
        contract: element.contract,
      };

      if (
        a.asset &&
        a.asset.name &&
        a.asset.imgURL &&
        element.contractAddress === nftContractAddress
      ) {
        setFavorites((favorite_nfts) => [...favorite_nfts, a]);
      } else {
        console.log("corrupted input");
      }
    }
  };

  const fetch_user_created_nfts = async () => {
    if (created_nfts.length != 0) {
      return;
    }

    let nfts = await user_services.get_user_created_nfts(id);

    await Promise.all(
      nfts.createdNFTs.map(async (element) => {
        let asset = await asset_services.get_asset(
          element.contract,
          element.tokenID,
          "meta"
        );
        let a = {
          asset: asset,
          token: "0x" + element.tokenID.toString(16),
          contract: element.contract,
        };
        if (
          a.asset &&
          a.asset.name &&
          a.asset.imgURL &&
          element.contract === nftContractAddress
        ) {
          setCreated((created_nfts) => [...created_nfts, a]);
        } else {
          console.log("corrupted input");
        }
      })
    );
  };

  const fetch_user_history = async () => {
    let history = await user_services.get_history(id);

    console.log(history.response);
    setUserHistory(history.response);
  };

  return (
    <div>
      <MDBContainer className="mt-3">
        <MDBRow>
          <MDBCol size="3">
            <ProfileCard
              username={user.username}
              avatar={
                "http://localhost:3001/public/users/" + user.id + "_avatar.png"
              }
              bio={user.bio}
              wallet={user.id}
            />

            <div style={{ textAlign: "center" }}>
              <h5>Shortcuts</h5>
            </div>
            <hr></hr>
            <MDBBtn
              className="w-100 float-left"
              color="light"
              onClick={() => {
                window.location = "/my_nfts";
              }}
            >
              {" "}
              <MDBIcon fas icon="paint-brush" /> My Memberships
            </MDBBtn>
          </MDBCol>

          <MDBCol>
            <MDBTabs fill style={{ fontSize: 18 }}>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => handleFillClick("tab1")}
                  active={fillActive === "tab1"}
                >
                  <MDBIcon fas icon="folder-minus" /> Collected
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => {
                    handleFillClick("tab2");
                    fetch_user_created_nfts();
                  }}
                  active={fillActive === "tab2"}
                >
                  <MDBIcon fas icon="paint-roller" /> Created
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => {
                    fetch_user_favorited(id);
                    handleFillClick("tab3");
                  }}
                  active={fillActive === "tab3"}
                >
                  <MDBIcon fas icon="heart" /> Favorited
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  onClick={() => {
                    handleFillClick("tab4");
                  }}
                  active={fillActive === "tab4"}
                >
                  <MDBIcon fas icon="chart-line" /> Activity
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
            <hr style={{ marginTop: 0, marginBottom: 18 }} />

            <MDBTabsContent>
              <MDBTabsPane show={fillActive === "tab1"}>
                <input
                  id="search_profile"
                  className="form-control"
                  placeholder="🔎 Search Membership"
                  onChange={(evt) => {
                    setFilter(document.getElementById("search_profile").value);
                  }}
                ></input>
                <MDBRow>
                  {user_nfts
                    .filter(
                      (f) =>
                        f.asset.name.toLowerCase().includes(filter) ||
                        filter === ""
                    )
                    .map((object, i) => (
                      <ProductCard
                        className="nft-card"
                        img={object.asset.imgURL}
                        name={object.asset.name}
                        token={object.token}
                        address={object.contract}
                        favorited={object.asset.favorited}
                      />
                    ))}
                </MDBRow>
              </MDBTabsPane>

              <MDBTabsPane show={fillActive === "tab2"}>
                <MDBRow>
                  {created_nfts
                    ? created_nfts
                        .filter(
                          (f) =>
                            f.asset.name.toLowerCase().includes(filter) ||
                            filter === ""
                        )
                        .map((object, i) => (
                          <ProductCard
                            className="nft-card"
                            img={object.asset.imgURL}
                            name={object.asset.name}
                            token={object.token}
                            address={object.contract}
                            favorited={object.asset.favorited}
                          />
                        ))
                    : ".."}
                </MDBRow>
              </MDBTabsPane>

              <MDBTabsPane show={fillActive === "tab3"}>
                <MDBRow>
                  {favorite_nfts
                    ? favorite_nfts
                        .filter(
                          (f) =>
                            f.asset.name.toLowerCase().includes(filter) ||
                            filter === ""
                        )
                        .map((object, i) => (
                          <ProductCard
                            className="nft-card"
                            img={object.asset.imgURL}
                            name={object.asset.name}
                            token={object.token}
                            address={object.contract}
                            favorited={object.asset.favorited}
                          />
                        ))
                    : ".."}
                </MDBRow>
              </MDBTabsPane>

              <MDBTabsPane show={fillActive === "tab4"}>
                <MDBRow>
                  {userHistory ? (
                    <UserActivity user_id={id}></UserActivity>
                  ) : (
                    ".."
                  )}
                </MDBRow>
              </MDBTabsPane>
            </MDBTabsContent>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile;
