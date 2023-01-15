import { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
} from "mdb-react-ui-kit";
import trade_services from "../services/market_serv";

//INTERNAL IMPORT

const AddToWhitelist = ({ addToWhitelist }) => {
  const [name, setUserame] = useState("");
  const [wallet, setWallet] = useState("");

  return (
    <form>
      <MDBInput
        className="mb-4"
        type="text"
        id="form1Example1"
        label="username"
        onChange={(e) => setUserame(e.target.value)}
        placeholder="Please enter company name"
      />
      <MDBInput
        className="mb-4"
        type="text"
        id="form1Example2"
        label="walletAddress"
        onChange={(e) => setWallet(e.target.value)}
        placeholder="Please enter Wallet Address"
      />

      <MDBBtn
        type="submit"
        block
        handleClick={async () =>
          await trade_services.addToWhitelist(name, wallet)
        }
      >
        Add
      </MDBBtn>
    </form>
  );
};

export default AddToWhitelist;
