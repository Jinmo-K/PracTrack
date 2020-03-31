const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const request = require('supertest');
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');


/**
 * Add dummyUser to the db and return its ID and authorization token
 * for making private API calls
 * @return {{token: string, userId: string}} The user credentials
 */
const setDummyUser = async () => {
  const dummyUser = {
    name: 'Dummy User',
    email: 'dummy@test.com',
    password: 'tester'
  };

  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(dummyUser.password, salt);
  dummyUser.password = hash;

  await User.findOneAndDelete({email: dummyUser.email})
  // Add dummyUser to the db
  await new User(dummyUser).save();
  
  // Login and retrieve userId, token
  let res = {};
  res = await request.agent(server)
                .post('/api/users/login')
                .send({
                  email: dummyUser.email,
                  password: 'tester'
                });

  expect(res.statusCode).to.equal(200);
  expect(res.body.success).to.equal(true);
  expect(res.body.token).to.exist;
  expect(res.body.token).to.be.a('string');
  expect(res.body.token).to.include('Bearer ');
  expect(res.body.userId).to.exist;
  expect(res.body.userId).to.be.a('string');
  let token = res.body.token;
  let userId = res.body.userId;
  
  return {token, userId};

}

module.exports = setDummyUser;