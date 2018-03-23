var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'abc';

module.exports = function(app, passport){

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  passport.serializeUser(function(user, done) {
    token = jwt.sign({
      username: user.username,
      email: user.email
    }, secret, { expiresIn: '24h' });
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: '345641079266524',
    clientSecret: '8d1da6bc867e0b295affd7a6149066d9',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({email: profile._json.email}).select('username password email').exec(function(err, user) {
      if(err) {
        done(err);
      }
      if(user && user != null) {
        done(null, user);
      }else {
        var newUser = new User();
        newUser.username = profile._json.name;
        newUser.password = profile._json.id;
        newUser.email = profile._json.email;
        if(newUser.username == null || newUser.username == '' || newUser.email == null || newUser.email == '' || newUser.password == null || newUser.password == '') {
          done(err);
        } else {
          newUser.save(function(err) {
            if(err) {
              done(err);
            } else {
              done(null, newUser);
            }
          });
        }
      }
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey: 	'EqbRMtxKufAL7k8IUmwMkyXF3',
    consumerSecret: 'pbn19hHX25c9RdlVopx5IEd55ZMgJGoMexPzkKx13rHRXZDx0Y',
    callbackURL: 'http://localhost:8080/auth/twitter/callback',
    // userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    includeEmail: true
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({email: profile.emails[0].value}).select('username password email').exec(function(err, user) {
      if(err) {
        done(err);
      }
      if(user && user != null) {
        done(null, user);
      }else {
        var newUser = new User();
        newUser.username = profile.username;
        newUser.password = profile.id;
        newUser.email = profile.emails[0].value;
        if(newUser.username == null || newUser.username == '' || newUser.email == null || newUser.email == '' || newUser.password == null || newUser.password == '') {
          done(err);
        } else {
          newUser.save(function(err) {
            if(err) {
              done(err);
            } else {
              done(null, newUser);
            }
          });
        }
      }
    });
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror' }), function(req, res) {
    res.redirect('/facebook/' + token);
  });
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
  );

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res) {
    res.redirect('/twitter/' + token);
  });

  return passport;
};

