const request = require("supertest");
const apis = require("../routes/apis");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(apis);

mongoose
  .connect(process.env["MONGO_URI"])
  .then(() => console.log("db connceted"))
  .catch((err) => console.log(err));

it("GET NFT information api --> ", async () => {
  const contract = "0xcb82814c42d7b5ab540bfc16705bd30a0491d563";
  const token = "1";

  let resp = await request(app).get(`/asset/${contract}/${token}`);

  expect(resp.statusCode).toBe(200);
  expect(resp.type).toBe("application/json");
});

it("GET NFT information quick --> ", async () => {
  const contract = "0xcb82814c42d7b5ab540bfc16705bd30a0491d563";
  const token = "1";

  let resp = await request(app).get(
    `/asset/${contract}/${token}?filter=nft_meta`
  );

  expect(resp.statusCode).toBe(200);
  expect(resp.type).toBe("application/json");
});

it("GET NFTs owned by --> ", async () => {
  const walletID = "0x447d77828101ba9455bf1feb94d844af68788399";

  let resp = await request(app).get(`/listNFT/owner/${walletID}`);

  expect(resp.statusCode).toBe(200);
  expect(resp.type).toBe("application/json");
});

it("GET top users --> ", async () => {
  let resp = await request(app).get(`/top/creator`);

  expect(resp.statusCode).toBe(200);
  expect(resp.type).toBe("application/json")
})

it("GET top sales --> ", async () => {
  let resp = await request(app).get(`/top/nft`);

  expect(resp.statusCode).toBe(200);
  expect(resp.type).toBe("application/json")
})