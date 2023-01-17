import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBTextArea,
  MDBSwitch,
} from "mdb-react-ui-kit";
import React from "react";
import { useEffect, useState } from "react";
import login_services from "../services/login_serv";
import metamask_operations from "../services/metamask";
import Cookies from "js-cookie";
import user_services from "../services/user_serv";
import currency from "../services/currency";
import ImgUpload from "../components/img-upload";

function Settings() {
  const [basicModal, setBasicModal] = useState(false);
  const [walletId, setWalletId] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);

  useEffect(async () => {
    if (Cookies.get("token") == null) {
      let walletId = localStorage.getItem("wallet");

      if (walletId == null) {
        walletId = await metamask_operations.onLoginHandler();
      }

      setWalletId(walletId);

      let res = await login_services.get_nonce(walletId);
      console.log(res.user.nonce);

      console.log("0x" + walletId.toUpperCase().substring(2));

      let signature = await metamask_operations.signMessage(
        res.user.nonce,
        walletId
      );
      console.log(signature);

      let res2 = await login_services.login(res.user.nonce, signature);
      console.log(res2);
      document.cookie = `token=${res2.token}`;
    } else {
      let walletId = localStorage.getItem("wallet");
      setWalletId(walletId);
    }
  }, []);

  let handleSubmit = async (event) => {
    event.preventDefault();
    let avatar = event.target[0].files[0];
    let display_name = event.target[2].value;
    let username = event.target[3].value;
    let bio = event.target[4].value;
    let token = Cookies.get("token");
    console.log("token");
    let res = await user_services.update_user(
      avatar,
      display_name,
      username,
      bio,
      token
    );

    if (res != null) {
      setBasicModal(true);
    }
  };

  function changeConversionRate(event) {
    const selectedIndex = event.target.options.selectedIndex;
    console.log(event.target.options[selectedIndex].getAttribute("data-key"));
    currency.change_rate(
      event.target.options[selectedIndex].getAttribute("data-key")
    );
    alert("Your currency changed");
  }

  return (
    <main>
      <MDBContainer className="mt-3">
        <p>Conversion Rate</p>
        <select
          className="form-select"
          onChange={changeConversionRate}
          defaultChecked={() => {
            currency.get_current_rate();
          }}
        >
          <option key={"eth"} data-key={"eth"}>
            ETH
          </option>
          <option key={"matic"} data-key={"matic"}>
            MATIC
          </option>
          <option key={"try"} data-key={"try"}>
            Turkish Lira
          </option>
          <option key={"usd"} data-key={"usd"}>
            American Dolar
          </option>
        </select>

        {/* <MDBSwitch checked={currency_check} id='flexSwitchCheckDefault' label='Switch to Dollar' onChange={changeConversionRate} /> */}

        <br />

        <fieldset>
          <legend>Profile Settings</legend>

          <form onSubmit={handleSubmit}>
            <ImgUpload shape="circle" fileId="logo-img"></ImgUpload>

            <MDBInput
              wrapperClass="mb-4"
              textarea
              id="form4Example3"
              label="Wallet ID"
              disabled="true"
              value={walletId}
            />
            <MDBInput
              id="form4Example1"
              wrapperClass="mb-4"
              label="Display Name"
            />
            <MDBInput id="form4Example2" wrapperClass="mb-4" label="Username" />
            <MDBTextArea id="form4Example2" wrapperClass="mb-4" label="Bio" />

            <MDBBtn type="submit" className="mb-4">
              Update My Profile
            </MDBBtn>
          </form>
        </fieldset>
      </MDBContainer>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Profile Settings Updated</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </main>
  );
}

export default Settings;
