const chai = require('chai');
const expect = chai.expect;
const server = require('../../server');
const request = require('supertest');
const mongoose = require("mongoose");
const setDummyUser = require('../dummyUser');

const Activity = require('../../models/Activity.model');
const User = require('../../models/User.model');

var authenticatedUser = request.agent(server);

// Wait for db to connect before running tests
before(() => {
  it('should wait for db to connect', (done) => {
    if (mongoose.connection.readyState !== 1) {
      mongoose.connection.on('connected', () => {
        done();
      });
    }
    else {
      done();
    }
  }).timeout(10000)
})


describe('Activities----------', () => {
  const fields = [
    'totalDuration',
    'logs',
    'active',
    '_id',
    'userId',
    'title',
    'goal',
    'created',
    'updated',
    'start',
  ];
  var dummyActivity = {};
  var token, userId = null;
  // Helper function to get the dummy activity from the db and set it to variable
  const setDummy = async () => {
    let res = await authenticatedUser
                .get(`/api/users/${userId}/activities`)
                .set('Authorization', token)
    dummyActivity = res.body[0];
  };

  // Save dummy activity and user to db and retrieve auth creds
  beforeEach(async () => {
    ({token, userId} = await setDummyUser())
    await new Activity({ 
            userId, 
            title: 'Dummy', 
            goal: 10000 
          }).save();
  });
  // Clear the db after each test
  afterEach(async () => {
    await Activity.collection.drop();
    await User.collection.drop();
  })

  describe('GET', () => {
    it('should return unauthorized status on GET /activities with non-admin user', (done) => {
      authenticatedUser 
        .get('/api/activities')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        })
    });

    // GET /users/{userId}/activities ---------------
    it('should return unauthorized status on GET /users/{userId}/activities when current user._id != userId', (done) => {
      authenticatedUser
        .get('/api/users/' + '1234567890' + '/activities')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('should return unauthorized status on GET /users/{userId}/activities when no authorization token is present', (done) => {
      authenticatedUser
        .get(`/api/users/${userId}/activities`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(401);
          done();
        })
    });
    it('should return all activities of a user on GET /users/{userId}/activities', (done) => {
      authenticatedUser
        .get(`/api/users/${userId}/activities`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(1);
          expect(res.body[0].title).to.equal('Dummy');
          expect(res.body[0].goal).to.equal(10000);
          expect(res.body[0].userId).to.equal(userId);
          done();
        });
    });

    // GET /activities/{activityId} ---------------
    it('should return unauthorized status on GET /activities/{activityId} for incorrect user', (done) => {
      // First save a new activity to the db for a different userId
      const newActivity = new Activity({
        userId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'), 
        title: 'Guitar',
        goal: 100
      });
      newActivity.save((err, data) => {
        if (err) done(err);
        // Retrieve it with dummyUser's token
        authenticatedUser
          .get(`/api/activities/${data._id}`)
          .set('Authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).to.equal(401);
            done();
          })
      }); 
    });
    it('should return unauthorized status on GET /activities/{activityId} when no authorization token is present', (done) => {
      // First save a new activity to the db for a different userId
      const newActivity = new Activity({
        userId, 
        title: 'Guitar',
        goal: 100
      });
      newActivity.save((err, data) => {
        if (err) done(err);
        // Retrieve it with dummyUser's token
        authenticatedUser
          .get(`/api/activities/${data._id}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).to.equal(401);
            done();
          })
      }); 
    });
    it('should return a single activity on GET /activities/{activityId}', (done) => {
      // First save a new activity to the db
      const newActivity = new Activity({
        userId, 
        title: 'Guitar',
        goal: 100
      });
      newActivity.save((err, data) => {
        if (err) done(err);
        // Retrieve it using its id
        authenticatedUser
          .get(`/api/activities/${data._id}`)
          .set('Authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('object');
            expect(res.body.title).to.equal('Guitar');
            expect(res.body.goal).to.equal(100);
            done();
          })
      }); 
    });
    it('should return 404 on GET /activities/{activityId} when activity does not exist', (done) => {
      authenticatedUser
        .get('/api/activities/4edd40c86762e0fb12000003')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Activity not found');
          done();
        })
    });

  })


  describe('POST', () => {
    it('should add an activity on POST /users/{userId}/activities', (done) => {
      const testActivity = {
        'title':'Piano',
        'goal': 5
      };
      authenticatedUser
        .post(`/api/users/${userId}/activities`)
        .send(testActivity)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          // Check that all fields are present
          expect(Object.keys(res.body)).to.include.members(fields);
          // Check the values
          expect(res.body.totalDuration).to.equal(0);
          expect(res.body.logs).to.be.a('array');
          expect(res.body.logs.length).to.equal(0)
          expect(res.body.active).to.equal(false);
          expect(res.body._id).to.be.a('string');
          expect(res.body.userId).to.equal(userId);
          expect(res.body.title).to.equal(testActivity.title);
          expect(res.body.goal).to.equal(testActivity.goal);
          expect(res.body.created).to.be.a('string');
          expect(res.body.updated).to.be.a('string');
          expect(res.body.start).to.be.a('string');
  
          done();
        })
    });
  })

  describe('PUT', function() {
    // Make sure dummy has been retrieved before each test
    beforeEach(async () => {
      await setDummy();
    });

    it('should return unauthorized status on PUT /activities/{activityId} for incorrect user', (done) => {
      // Create an activity for a different user
      const newActivity = new Activity({
        userId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'), 
        title: 'Guitar',
        goal: 100
      });
      newActivity.save((err, data) => {
        if (err) done(err);
        // Try to update it
        authenticatedUser
          .get(`/api/activities/${data._id}`)
          .set('Authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).to.equal(401);
            expect(res.body).to.be.a('object');
            done();
          })
      }); 
    });

    it('should update an activity on PUT /activities/{activityId}', (done) => {
      let nextValues = {
        title: 'Dummy -> testing', 
        goal: 999,
        active: true,
        updated: Date.now(),
      };
      authenticatedUser
        .put(`/api/activities/${dummyActivity._id}`)
        .set('Authorization', token)
        .send(nextValues)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body.title).to.exist;
          expect(res.body.goal).to.exist;
          // All fields present
          expect(Object.keys(res.body)).to.include.members(fields);
          // Check if updated values have changed
          expect(res.body.title).to.equal(nextValues.title);
          expect(res.body.goal).to.equal(nextValues.goal);
          expect(res.body.active).not.equal(dummyActivity.active);
          expect(res.body.active).to.equal(nextValues.active);
          expect(res.body.updated).not.equal(dummyActivity.updated);
          expect(res.body.start).to.equal(dummyActivity.start);
          expect(res.body.created).to.equal(dummyActivity.created);

          done();
        });
    });
    it('should not change any values on PUT /activities/{activityId} with no values', (done) => {
      authenticatedUser
        .put(`/api/activities/${dummyActivity._id}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(dummyActivity);
          done();
        });
    });

  });

  describe('DELETE', () => {
    beforeEach(async () => {
      await setDummy();
    });

    it('should return unauthorized status on DELETE /users/{userId}/activities/{activityId} for incorrect user', (done) => {
      // Save a new activity to the db for a different userId
      const newActivity = new Activity({
        userId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'), 
        title: 'Guitar',
        goal: 100
      });
      newActivity.save((err, data) => {
        if (err) done(err);
        // Try to delete it with dummyUser's token
        authenticatedUser
          .get(`/api/activities/${data._id}`)
          .set('Authorization', token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).to.equal(401);
            done();
          })
      }); 
    });
    it('should delete an activity of the logged in user on DELETE /users/{userId}/activities/{activityId}', (done) => {
      authenticatedUser
        .delete(`/api/users/${userId}/activities/${dummyActivity._id}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(dummyActivity);
          done();
        });
    });
    it('should return 404 on DELETE /users/{userId}/activities/{activityId} for non-existent activity', (done) => {
      authenticatedUser
        .delete(`/api/users/${userId}/activities/4edd40c86762e0fb12000003`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('Adding a log', () => {
    beforeEach(async () => {
      await setDummy();
    });
    it('should add a new log to an activity on POST /activities/{activityId}/logs and update the activity', (done) => {
      const newLog = {
        userId,
        activityId: dummyActivity._id,
        start: 1585293326000,
        end: 1585296926000,
        duration: 3600000,
        comments: ''
      };
      authenticatedUser
        .post(`/api/activities/${dummyActivity._id}/logs`)
        .set('Authorization', token)
        .send(newLog)
        .end((err, res) => {
          if (err) done(err);
          let savedLog = res.body;
          expect(res.statusCode).to.equal(200);
          expect(savedLog).to.be.a('object');
          expect(savedLog.userId).to.equal(newLog.userId);
          expect(savedLog.activityId).to.equal(newLog.activityId);
          expect(new Date(savedLog.start).valueOf()).to.equal(newLog.start);
          expect(new Date(savedLog.end).valueOf()).to.equal(newLog.end);
          expect(savedLog.duration).to.equal(newLog.duration);
          expect(savedLog.comments).to.equal(newLog.comments);
          authenticatedUser
            .get(`/api/activities/${dummyActivity._id}`)
            .set('Authorization', token)
            .end((err, res) => {
              if (err) done(err);
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body.totalDuration).to.equal(newLog.duration);
              expect(res.body.logs).to.include(savedLog._id);
              expect(res.body.updated).to.not.equal(res.body.created);
              done();
            })
        });
    });
  });

  


}).timeout(5000);

