import mongoose from "mongoose";
import app from "../../../app";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

describe("customer", () => {
  let server: any;
  let token;

  before(async () => {
    server = await app();

    const username = "usernametest";
    const password = "passwordtest";

    await chai.request(server).post("/api/admin/register").send({
      username,
      password,
      firstName: "Aiden",
      lastName: "Pearce ",
      adminPass: "123456",
    });

    const res = await chai.request(server).post("/api/admin/login").send({
      username,
      password,
    });

    token = res.body.token;
  });

  after(async () => {
    try {
      await mongoose.connection.db.dropCollection("user");
      await mongoose.connection.db.dropCollection("customer");
    } catch (error) {}

    server.close();
    await mongoose.disconnect();
  });

  it("should CRUD customer successfully", async function () {
    this.timeout(10000);
    const res = await chai
      .request(server)
      .post("/api/admin/auth/customer")
      .set("Authorization", "Bearer " + token)
      .type("json")
      .send({
        firstName: "Aiden",
        lastName: "Pearce ",
        phone: "0909123456",
        address: "103/123 Huynh Tan Phat, Q7",
        email: "meagsdvioh@gmail.com",
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      msg: "success",
    });

    const res2 = await chai
      .request(server)
      .get("/api/admin/auth/customers")
      .set("Authorization", "Bearer " + token)
      .type("json");

    expect(res2.status).to.equal(200);
    expect(res2.body[0]).to.deep.include({
      firstName: "Aiden",
      lastName: "Pearce ",
      phone: "0909123456",
      address: "103/123 Huynh Tan Phat, Q7",
      email: "meagsdvioh@gmail.com",
    });

    const id = res2.body[0]._id;

    const res3 = await chai
      .request(server)
      .put("/api/admin/auth/customer/" + id)
      .set("Authorization", "Bearer " + token)
      .type("json")
      .send({
        firstName: "Aiden2",
        lastName: "Pearce 2",
        phone: "09091234562",
        address: "103/123 Huynh Tan Phat, Q72",
        email: "meagsdvioh@gmail.com2",
      });

    expect(res3.status).to.equal(200);
    expect(res3.body).to.deep.equal({
      msg: "success",
    });

    const res4 = await chai
      .request(server)
      .get("/api/admin/auth/customer/" + id)
      .set("Authorization", "Bearer " + token)
      .type("json");

    expect(res4.status).to.equal(200);
    expect(res4.body).to.deep.include({
      _id: id,
      firstName: "Aiden2",
      lastName: "Pearce 2",
      phone: "09091234562",
      address: "103/123 Huynh Tan Phat, Q72",
      email: "meagsdvioh@gmail.com2",
    });

    const res5 = await chai
      .request(server)
      .delete("/api/admin/auth/customer/" + id)
      .set("Authorization", "Bearer " + token)
      .type("json");

    expect(res5.status).to.equal(200);
    expect(res5.body).to.deep.include({ msg: "success" });

    const res6 = await chai
      .request(server)
      .get("/api/admin/auth/customers")
      .set("Authorization", "Bearer " + token)
      .type("json");

    expect(res6.status).to.equal(200);
    expect(res6.body).to.deep.equal([]);
  });
});
