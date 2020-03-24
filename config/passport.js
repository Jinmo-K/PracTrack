const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Activity = mongoose.model('Activity');
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
// Add req as the first parameter
opts.passReqToCallback = true;

module.exports = passport => {
  passport.use(
    'user',
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => { return done(err) });
    })
  );

  // Using passport as middleware to authenticate API calls
  passport.use(
    'admin',
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      if (jwt_payload.role === 0) {
        return done(null, jwt_payload);
      }
      else {
        return done(null, false, { message: "Please login as admin" });
      }
    })
  )

  passport.use(
    'personal',
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      if (jwt_payload.id === req.params.userId) {
        return done(null, jwt_payload);
      }
      else {
        return done(null, false);
      }
    })
  )

  passport.use(
    'activityOwner',
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      Activity.findById(req.params.activityId)
        .then(activity => {
          // activity.userId is not type string, jwt is
          if (activity.userId == jwt_payload.id) {
            return done(null, jwt_payload);
          }
          return done(null, false);
        })
        .catch(err => { return done(err) });
    })
  )
};

