const request = require("supertest");
const apis = require("../routes/user");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(apis);

mongoose
  .connect(process.env["MONGO_URI"])
  .then(() => console.log("db connceted"))
  .catch((err) => console.log(err));

test('user check cyilmaz', async () => {
    let resp = await request(app).get(
        `/?publicAdress=0x447d77828101ba9455bf1feb94d844af68788399`
      );

    expect(resp.statusCode).toBe(200);
    expect(resp.type).toBe("application/json");

    expect(resp.body.user.username).toBe('cyilmaz')
})

test('user check auth', async () => {
    let resp = await request(app).get(
        `/watchlist`
      );

    expect(resp.statusCode).toBe(401);
})