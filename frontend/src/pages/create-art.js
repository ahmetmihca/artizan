import Navbar from "../components/navbar";
import UploadFile from "../components/upload-file";
import "./style/css-create-art.css";
import {
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalHeader,
  MDBBtn,
  MDBModalTitle,
} from "mdb-react-ui-kit";
import Message from "../components/alert";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import mint_services from "../services/mint_serv";
import ReactLoading from "react-loading";

function CreateArt() {
  const [loading, setLoading] = useState(false);
  const [showModal, setModal] = useState(false);
  const [nft_status, setSatus] = useState();
  const [progress, setProgress] = useState(true);

  useEffect(async () => {
    if (Cookies.get("token") == null) {
      window.location = "/";
    }
  }, []);

  let handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      alert("On progress event");
      return;
    }

    setLoading(true);
    setModal(true);
    setSatus("Uploading to IPFS");

    let asset = event.target[0].files[0];
    let name = event.target[1].value;
    let description = event.target[2].value;
    let amount = event.target[3].value;

    if (parseInt(amount) <= 0) {
      alert("You can not mint less than 1 unit");
      return;
    }

    let category = "a";
    let token = Cookies.get("token");

    let res = await mint_services.pre_mint(
      asset,
      name,
      description,
      category,
      token,
      amount
    );

    setSatus("Waiting for Confirmation");

    try {
      if (res != null) {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: res.to,
              from: res.from,
              data: res.data,
              gas: "110000",
            },
          ],
        });

        setSatus(
          "✅ Check out your transaction on Mumbai: https://mumbai.polygonscan.com/tx/" +
            txHash
        );
        setProgress(false);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setProgress(false);
  };

  return (
    <div>
      <form action="" id="create-nft__form" onSubmit={handleSubmit}>
        <h1>Create New Membership NFT</h1>
        <h4>Image, Video, Audio, or 3D Model</h4>
        <p>File types supported: JPG, PNG, MP4, GIF. Max Size: 40MB</p>

        <UploadFile></UploadFile>

        <h4 style={{ margin: "0.5rem 0px 0.5rem 0px" }}>Name *</h4>
        <p>Name of your NFT, dear artizan!</p>
        <input type="text" name="nft-name" required />
        <h4>Description</h4>
        <p>The description will be included on the item's detail page.</p>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="10"
        ></textarea>

        {/* <h4>Collection</h4>
                <p>This is the collection where your item will appear.</p>
                <select name="collection" id="collection">
                    <option value="collection-data">Collection data</option>
                </select> */}

        <h4>Supply</h4>
        <p>The number of copies that can be minted.</p>
        <input
          type="number"
          placeholder="1"
          defaultValue={1}
          name="mint-count"
        />

        {/* <h4>Blockchain</h4>

                <select name="chain" id="chain">
                    <option value="eth" id="eth" name="eth">
                        Ethereum
                    </option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select> */}

        <hr className="solid"></hr>
        <button type="submit" className="btn-hover color-9">
          Create
        </button>
      </form>

      <MDBModal show={showModal} setShow={setModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle
                style={{ justifyContent: "center", textAlign: "center" }}
              >
                Creating NFT
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={setModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody
              style={{
                justifyContent: "center",
                textAlign: "center",
                overflowWrap: "break-word",
              }}
            >
              <h3>{nft_status}</h3>
              <div style={{ justifyContent: "center", marginLeft: 200 }}>
                {progress ? (
                  <ReactLoading type={"spokes"} color={"#0000DF"} />
                ) : (
                  ""
                )}
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default CreateArt;
