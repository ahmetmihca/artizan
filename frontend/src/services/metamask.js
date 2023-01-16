import trade_services from "./market_serv";
const Web3 = require("web3");
const web3 = new Web3(window.ethereum);
let metamask = window.ethereum;

let walletConnected = false;
checkConnection();

const onLoginHandler = async () => {
  if (getWalletId() !== false) {
    return;
  }

  if (metamask) {
    let accounts = await web3.eth.requestAccounts();

    if (accounts !== null) {
      console.log("hello2");

      localStorage.setItem("wallet", accounts[0].toLowerCase());

      let isWhitelisted = await trade_services.isWhitelisted(accounts[0]);
      let isContractOwner = await trade_services.isContractOwner(accounts[0]);

      localStorage.setItem("isWhitelisted", isWhitelisted);
      localStorage.setItem("isContractOwner", isContractOwner);

      walletConnected = true;
      return accounts[0];
    }
  }
};

function getWalletId() {
  checkConnection();

  let walletId = localStorage.getItem("wallet");

  if (walletId == null) {
    return false;
  }

  return walletId;
}

function checkConnection() {
  metamask
    .request({ method: "eth_accounts" })
    .then(async (e) => {
      if (e.length == 0) {
        walletConnected = false;
        localStorage.removeItem("wallet");

        localStorage.removeItem("isWhitelisted");
        localStorage.removeItem("isContractOwner");
      } else {
        walletConnected = true;
        if (localStorage.getItem("wallet") == null) {
          localStorage.setItem("wallet", e[0]);

          let isWhitelisted = await trade_services.isWhitelisted(e[0]);
          let isContractOwner = await trade_services.isContractOwner(e[0]);

          localStorage.setItem("isWhitelisted", isWhitelisted);
          localStorage.setItem("isContractOwner", isContractOwner);
        }
      }
    })
    .catch(console.error);
}

window.ethereum.on("accountsChanged", function (accounts) {
  checkConnection();
});

function checkWallet() {
  return walletConnected;
}

// Web3 Methods
async function signMessage(msg, wallet) {
  let result = await web3.eth.personal.sign(msg, wallet);
  return result;
}

const metamask_operations = {
  onLoginHandler,
  getWalletId,
  signMessage,
  checkConnection,
  checkWallet,
  metamask,
};

export default metamask_operations;
