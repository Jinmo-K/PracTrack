const chai = require('chai');
const expect = chai.expect;
const server = require('../../server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const setDummyUser = require('../dummyUser');
const User = require('../../models/User.model');

const authenticatedUser = request.agent(server);



describe('Users-----------------', () => {
  const fields = [
    'role',
    'activities',
    '_id',
    'name',
    'email',
    'password',
    'created',
  ];
  var token, userId = null;

  // Add dummy user to db before each test and save token 
  beforeEach(async () => {
    ({token, userId} = await setDummyUser());
  });

  // Clear db after each test
  afterEach(async () => {
    await User.collection.drop();
  })

  describe('GET', () => {
    it('should return unauthorized status on GET /users with non-admin user', (done) => {
      authenticatedUser 
        .get('/api/users')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        })
    });
    it('should return unauthorized status on GET /users/{userId} when current user._id != userId', (done) => {
      authenticatedUser
        .get('/api/users/' + '1234567890')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('should return unauthorized status on GET /users/{userId} when no authorization token is present', (done) => {
      authenticatedUser
        .get(`/api/users/${userId}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        })
    });
    it('should return a single user on GET /users/{userId} when current user._id == userId', (done) => {
      authenticatedUser
        .get(`/api/users/${userId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body)).to.include.members(fields);
          expect(res.body.role).to.equal(1);
          expect(res.body.activities).to.be.a('array');
          expect(res.body.activities.length).to.equal(0);
          expect(res.body._id).to.equal(userId);
          expect(res.body.name).to.equal('Dummy User');
          expect(res.body.email).to.equal('dummy@test.com');
          expect(res.body.created).to.be.a('string');
          bcrypt.compare('tester', res.body.password)
            .then(isMatch => {
              expect(isMatch).to.be.true;
              done();
            });
        });
    });
  });

  describe('User signup', () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'tester2',
      password2: 'tester2'
    };
    // Valid signup
    it('should create and return a new user on POST /users/register', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body)).to.include.members(fields);
          expect(res.body.role).to.equal(1);
          expect(res.body.activities).to.be.a('array');
          expect(res.body.activities.length).to.equal(0);
          expect(res.body.name).to.equal('Test User');
          expect(res.body.email).to.equal('testuser@test.com');
          expect(res.body.created).to.be.a('string');
          bcrypt.compare('tester2', res.body.password)
            .then(isMatch => {
              expect(isMatch).to.be.true;
              done();
            });
        })
    });

    // Name validations
    it('should return 400 status on POST /users/register with empty name field', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, name: ''})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.name).to.exist;
          expect(res.body.name).to.equal('Name field is required');
          done();
        });
    });
    it('should return 400 status on POST /users/register without name field', (done) => {
      const {name, ...userNoName} = newUser;
      authenticatedUser
        .post('/api/users/register')
        .send(userNoName)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.name).to.exist;
          expect(res.body.name).to.equal('Name field is required');
          done();
        });
    });

    // Email validations
    it('should return 400 status on POST /users/register with empty email field', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, email: ''})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email field is required');
          done();
        });
    });
    it('should return 400 status on POST /users/register without email field', (done) => {
      const {email, ...userNoEmail} = newUser;
      authenticatedUser
        .post('/api/users/register')
        .send(userNoEmail)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email field is required');
          done();
        });
    });
    it('should return 400 status on POST /users/register with invalid email field', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, email: 'testuser@gmail'})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email is invalid');
          done();
        });
    });
    it('should return 400 status on POST /users/register with already existing email', (done) => {
      const user2 = {
        name: 'Test User 2',
        email: 'dummy@test.com',
        password: 'tester',
        password2: 'tester'
      };
      authenticatedUser
        .post('/api/users/register')
        .send(user2)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email already exists');
          done();
        })
    });

    // Password validations
    // password 1 empty, password2 not empty
    it('should return 400 status errors on POST /users/register with empty password1 field', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, password: ''})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(2);
          expect(res.body.password).to.exist;
          expect(res.body.password2).to.exist;
          expect(res.body.password).to.equal('Password field is required')
          expect(res.body.password2).to.equal('Passwords must match')
          done();
        });
    });
    // password1 missing, password2 not empty
    it('should return 400 status errors on POST /users/register missing password1 field', (done) => {
      const {password, ...userNoPw} = newUser;
      authenticatedUser
        .post('/api/users/register')
        .send(userNoPw)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(2);
          expect(res.body.password).to.exist;
          expect(res.body.password2).to.exist;
          expect(res.body.password).to.equal('Password field is required')
          expect(res.body.password2).to.equal('Passwords must match')
          done();
        });
    });
    // password1 invalid length, password2 not empty and not matching
    it('should return 400 status errors on POST /users/register with invalid password', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, password: '12j5d'})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body.password).to.exist;
          expect(res.body.password2).to.exist;
          expect(Object.keys(res.body).length).to.equal(2);
          expect(res.body.password).to.equal('Password must be at least 6 characters')
          expect(res.body.password2).to.equal('Passwords must match')
          done();
        });
    });
    // password1 ok, password2 empty
    it('should return 400 status errors on POST /users/register with empty password2 field', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, password2: ''})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.password2).to.exist;
          expect(res.body.password2).equal('Confirm password field is required');
          done();
        });
    });
    // password1 ok, password2 missing
    it('should return 400 status errors on POST /users/register without password2 field', (done) => {
      const {password2, ...userNoPw2} = newUser;
      authenticatedUser
        .post('/api/users/register')
        .send(userNoPw2)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.password2).to.exist;
          expect(res.body.password2).equal('Confirm password field is required');
          done();
        });
    });
    // password1 ok, password2 not matching
    it('should return 400 status errors on POST /users/register with non-matching passwords', (done) => {
      authenticatedUser
        .post('/api/users/register')
        .send({...newUser, password2: 'tester'})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.password2).to.exist;
          expect(res.body.password2).to.equal('Passwords must match');
          done();
        });
    });
  });

  describe('User Login', () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'tester2',
      password2: 'tester2'
    };
    var userId = null;
    // Register new user before each test
    beforeEach((done) => {
      authenticatedUser
        .post('/api/users/register')
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          userId = res.body._id;
          done();
        });
    });
    // Valid login
    it('should login a user with valid credentials and return a token on POST /users/login', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({email: newUser.email, password: newUser.password})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.token).to.exist;
          expect(res.body.token).to.be.a('string');
          expect(res.body.token).to.include('Bearer ');
          expect(res.body.userId).to.exist;
          expect(res.body.userId).to.equal(userId);
          done();
        });
    });
    // Missing email
    it('should return 400 status errors on POST /users/login with missing email field', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({password: newUser.password})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email field is required');
          done();
        });
    }); 
    // Invalid email
    it('should return 400 status errors on POST /users/login with invalid email field', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({email: 'testeruser@t', password: newUser.password})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email is invalid');
          done();
        });
    }); 
    // User doesn't exist
    it('should return 404 status errors on POST /users/login with non-existent email', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({email: newUser.email.slice(0,-1), password: newUser.password})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.email).to.exist;
          expect(res.body.email).to.equal('Email not found');
          done();
        });
    });
    // Missing password 
    it('should return 400 status errors on POST /users/login with missing password field', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({email: newUser.email})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.password).to.exist;
          expect(res.body.password).to.equal('Password field is required');
          done();
        });
    }); 
    // Incorrect password
    it('should return 400 status errors on POST /users/login with incorrect password', (done) => {
      authenticatedUser
        .post('/api/users/login')
        .send({email: newUser.email, password: 'tester'})
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.password).to.exist;
          expect(res.body.password).to.equal('Password incorrect');
          done();
        });
    }); 
  });

  describe('PUT', () => {
    // TODO 
  });

  describe('DELETE', () => {
    // TODO
  });


});
