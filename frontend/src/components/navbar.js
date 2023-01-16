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
          <img src={logo} id="nav-logo" alt="" />
          Artizan
        </MDBNavbarBrand>
        <form className="input-group ms-4" onSubmit={searchHandler}>
          <select
            style={{ maxWidth: 160, textAlign: "center" }}
            className="form-control-custom"
            name="category"
            id="category"
          >
            <option value="collection">Collections 📚 </option>
            <option value="user">Users 🤠 </option>
            <option value="asset">Assets 🧿 </option>
          </select>

          <input
            type="search"
            className="form-control-custom px-2 search-bar"
            placeholder="Search items, collections and accounts"
          />
          <MDBBtn className="search-btn">
            <MDBIcon icon="search py-0" size="lg" />
          </MDBBtn>
        </form>

        <MDBNavbarNav className="justify-content-end mx-5 my-1">
          {walletConnected & (isContractOwner == "true") ? (
            <MDBNavbarItem className="dropdown">
              <MDBNavbarLink href="/add-to-whitelist" aria-current="page">
                Add to whitelist
              </MDBNavbarLink>
            </MDBNavbarItem>
          ) : null}

          <MDBNavbarItem className="dropdown">
            <MDBNavbarLink
              href="/explore"
              aria-current="page"
              className="dropbtn"
            >
              🔎 Explore
            </MDBNavbarLink>
            <DropdownList dropdowntype="Explore"></DropdownList>
          </MDBNavbarItem>

          <MDBNavbarItem className="dropdown">
            <MDBNavbarLink href="/my_nfts" aria-current="page">
              🎒 My Items
            </MDBNavbarLink>
          </MDBNavbarItem>

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
