/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0x1314b04cfd452a9d4dab2049a53d51e9ea830e4f699260e001636e43686ad01c","balance":"1000000000000000000000"},{"privateKey":"0x36a81bbf4e2c9dbf5277040ccd0998d0684d0860c5e6eb13c98904be98f91682","balance":"1000000000000000000000"},{"privateKey":"0xcec29064de7d87afafaccd46caba36feea2059bac3c9ed7f1aaafdcc0cd54bf7","balance":"1000000000000000000000"},{"privateKey":"0xb3f557f50d260d37eb1e913e8e35d6393c5edda071c2e0596dfe7c9313a291ce","balance":"1000000000000000000000"},{"privateKey":"0x16086974a116e7fadb40c10057bba4c30512265a412384e889a9db66a285ab56","balance":"1000000000000000000000"},{"privateKey":"0x1b86c850d5af8cf79f1a9152953989d733df4e9e9b292cc3ebbcfe3e42fd8d16","balance":"1000000000000000000000"},{"privateKey":"0x57e0948d037a1fd86bedd168b1c16d33f2fa09fbf118dbd19c8a997b44e2321e","balance":"1000000000000000000000"},{"privateKey":"0x6a4d636d192a3b898c38b7f0548009932c5783d93e9d001e7cb6962bc4c0af17","balance":"1000000000000000000000"},{"privateKey":"0x421f752863991335cfcad46bf12d27af3f546566e3fca818925c266fbe1c3479","balance":"1000000000000000000000"},{"privateKey":"0x092ec68f626a1275b4bc169520341a881b7a3498e83f13076b8de963c1f3abbb","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};