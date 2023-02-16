import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBContainer,
} from "mdb-react-ui-kit";

import trade_services from "../services/market_serv";

//INTERNAL IMPORT

const AddToWhitelist = () => {
  const [username, setUsername] = useState("");
  const [addressToAdd, setAddressToAdd] = useState("");

  return (
    <MDBContainer style={{ padding: 50, width: 500, height: 500 }}>
      <form>
        <MDBInput
          className="mb-4"
          type="text"
          id="form1Example1"
          label="Company Name"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Please enter company name"
        />
        <MDBInput
          className="mb-4"
          type="text"
          id="form1Example2"
          label="Address To Add"
          onChange={(e) => setAddressToAdd(e.target.value)}
          placeholder="Please enter wallet address"
        />

        <MDBBtn
          type="submit"
          block
          onClick={async (e) => {
            e.preventDefault();
            const res = await trade_services.addToWhitelist(
              addressToAdd,
              localStorage.getItem("wallet"),
              username,
              Cookies.get("token")
            );
            console.log("from add-to-whitelist, res:", res);
            await window.ethereum.request({
              method: "eth_sendTransaction",
              params: [
                {
                  to: res.to,
                  from: res.from,
                  gas: "100000",
                  data: res.data,
                },
              ],
            });
          }}
        >
          Add
        </MDBBtn>
      </form>
    </MDBContainer>
  );
};

export default AddToWhitelist;
