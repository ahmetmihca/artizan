import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBIcon,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import "./style/css-navbar.css";
import logo from "./logo.png";
import DropdownList from "./dropdown-list";
import { useState, useEffect } from "react";
import metamask_operations from "../services/metamask";
import { useNavigate } from "react-router-dom";
import utils from "../services/utils";
import login_services from "../services/login_serv";
import trade_services from "../services/market_serv";
import Cookies from "js-cookie";

function Navbar(props) {
  const [walletConnected, setWalletConneted] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState("");
  const [isContractOwner, setIsContractOwner] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    metamask_operations.checkConnection();
    console.log(metamask_operations.walletConnected);

    setIsWhitelisted(localStorage.getItem("isWhitelisted"));
    setIsContractOwner(localStorage.getItem("isContractOwner"));

    console.log("isContractOwner from useEffect", isContractOwner);
    console.log("isWhitelisted from useEffect", isWhitelisted);

    setInterval(() => {
      if (metamask_operations.checkWallet()) {
        setWalletConneted(true);
      } else {
        setWalletConneted(false);
        // setIsWhitelisted("");
        // localStorage.setItem("isWhitelisted", "false");
      }
    }, 500);
  }, [isWhitelisted, isContractOwner]);

  async function searchHandler(event) {
    event.preventDefault();
    let path = `/search/${event.target[0].value}/${event.target[1].value}`;
    window.location = path;
  }

  async function verifyHandler(event) {
    event.preventDefault();
    const company = event.target[0].value;

    const res = await trade_services.verify(
      company,
      localStorage.getItem("wallet"),
      Cookies.get("token")
    );

    console.log("res.data:", res.data);
    console.log("from navbar, verify result:", res);
  }

  async function ProfileHandler() {
    let wallet = localStorage.getItem("wallet");

    if (wallet == null) {
      wallet = await metamask_operations.onLoginHandler();
    }

    let path = `/user/${wallet}`;
    navigate(path);
  }

  return (
    <MDBNavbar expand="lg" className="navbar">
      <MDBContainer fluid className="w-100">
        <MDBNavbarBrand href="/" className="mx-3">
          <img
            src={logo}
            id="nav-logo"
            alt=""
            style={{ width: 60, height: 60 }}
          />
          Artizan
        </MDBNavbarBrand>
        <form className="input-group ms-4" onSubmit={searchHandler}>
          <input
            type="search"
            className="form-control-custom px-2 search-bar"
            placeholder="Search items, collections and accounts"
          />
          <MDBBtn className="search-btn" style={{ margin: 0 }}>
            <MDBIcon icon="search py-0" size="lg" />
          </MDBBtn>
        </form>

        <form className="input-group ms-4" onSubmit={verifyHandler}>
          <input
            type="verify"
            className="form-control-custom px-2 search-bar"
            placeholder="Verify your memberships"
          />
          <MDBBtn className="search-btn" style={{ margin: 0 }}>
            <MDBIcon icon="calendar-check py-0" size="lg" />
          </MDBBtn>
        </form>

        <MDBNavbarNav className="justify-content-end mx-5 my-1">
          {walletConnected & (isContractOwner == "true") ? (
            <MDBNavbarItem className="dropdown">
              <MDBNavbarLink href="/add-to-whitelist" aria-current="page">
                <MDBIcon icon="check" size="lg" />
                <span> Whitelist Companies</span>
              </MDBNavbarLink>
            </MDBNavbarItem>
          ) : null}

          <MDBNavbarItem className="dropdown">
            <MDBNavbarLink
              href="/explore"
              aria-current="page"
              className="dropbtn"
            >
              🔎 Explore Memberships
            </MDBNavbarLink>
            <DropdownList dropdowntype="Explore"></DropdownList>
          </MDBNavbarItem>

          {walletConnected ? (
            <MDBNavbarItem className="dropdown">
              <MDBNavbarLink href="/my_nfts" aria-current="page">
                🎫 My Memberships
              </MDBNavbarLink>
            </MDBNavbarItem>
          ) : null}

          {walletConnected & (isWhitelisted === "true") ? (
            <MDBNavbarItem>
              <MDBNavbarLink href="/create" aria-current="page">
                📐 Create
              </MDBNavbarLink>
            </MDBNavbarItem>
          ) : null}

          <MDBNavbarItem className="dropdown">
            <MDBNavbarLink onClick={ProfileHandler} aria-current="page">
              <MDBIcon far icon="user-circle" size="lg" />
            </MDBNavbarLink>
            <DropdownList dropdowntype="Profile"></DropdownList>
          </MDBNavbarItem>
          <MDBNavbarItem></MDBNavbarItem>
          <MDBNavbarItem className=".bg-transparent">
            <MDBBtn
              aria-current="page"
              className="px-3"
              onClick={() => {
                login_services.login_system();
              }}
            >
              {walletConnected ? (
                <span>
                  <MDBIcon fas icon="wallet" size="lg" />{" "}
                  {metamask_operations.getWalletId()
                    ? metamask_operations.getWalletId().substring(0, 4) +
                      "..." +
                      metamask_operations
                        .getWalletId()
                        .substring(
                          metamask_operations.getWalletId().length - 4,
                          metamask_operations.getWalletId().length
                        )
                    : ""}
                </span>
              ) : (
                <MDBIcon fas icon="wallet" size="lg" />
              )}
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Navbar;
