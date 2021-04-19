
import mongoose from 'mongoose'
import app from '../../app'
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../model/user'


chai.use(chaiHttp);

describe("auth", () => {
  let server: any;
  before(async () => {
    server = await app();
  });

  after(async () => {
    console.log('after')

    await mongoose.connection.db.dropCollection("user");

    server.close();
    await mongoose.disconnect();
  });

  it("should register and login successfully", async () => {
    const username = "usernametest";
    const password = "passwordtest";

    const res = await chai
      .request(server)
      .post('/api/admin/register')
      .send({
        username,
        password,
        firstName: 'tai',
        lastName: 'pham',
        adminPass: '123456',
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      "msg": "success"
    });

    const res2 = await chai
      .request(server)
      .post('/api/admin/register')
      .send({
        username,
        password,
        firstName: 'tai',
        lastName: 'pham',
        adminPass: '123456',
      });

    expect(res2.status).to.equal(400);
    expect(res2.body).to.deep.equal({
      "msg": "Duplicated code"
    });
  });
});
