import mongoose from "mongoose";
import app from "../../app";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

describe("user", () => {
  let server: any;
  before(async () => {
    server = await app();
  });

  after(async () => {
    console.log("after");

    await mongoose.connection.db.dropCollection("user");

    server.close();
    await mongoose.disconnect();
  });

  it("should register and login successfully", async function () {
    this.timeout(10000);
    const username = "usernametest";
    const password = "passwordtest";

    const res = await chai.request(server).post("/api/admin/register").send({
      username,
      password,
      firstName: "tai",
      lastName: "pham",
      adminPass: "123456",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      msg: "success",
    });

    const res2 = await chai.request(server).post("/api/admin/login").send({
      username,
      password,
    });

    expect(res2.status).to.equal(200);
    expect(res2.body).to.have.keys(["token"]);

    const res3 = await chai
      .request(server)
      .get("/api/admin/auth/user")
      .set("Authorization", "Bearer " + res2.body.token);

    expect(res3.status).to.equal(200);
    expect(res3.body).to.deep.includes({
      firstName: "tai",
      lastName: "pham",
      username: "usernametest",
    });
  });

  it("it should return failed", async function () {
    const res = await chai
      .request(server)
      .get("/api/admin/auth/user")
      .set("Authorization", "Bearer " + "asc");

    expect(res.status).to.equal(401);
    expect(res.text).to.equal("Unauthorized");
  });
});
