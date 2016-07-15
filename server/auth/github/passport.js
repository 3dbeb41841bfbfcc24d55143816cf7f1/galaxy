import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github';
import Cohort from '../../api/cohort/cohort.model';

exports.setup = function(User, config) {
  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'github.id': Number(profile.id)
    })
    .then(user => {
      if (!user) {
        return User.findOne({ name: 'Admin' })
        .then(adminUser => {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            role: 'student',
            cohort: adminUser.cohort._id,
            provider: 'github',
            github: profile._json
          });
          user.save()
          .then(user => {
            return done(null, user);
          })
          .catch(err => {
            return done(err);
          });
        });
      }
      else {
        // TODO: update user
        user.name = profile.displayName;
        user.username = profile.username;
        user.github = profile._json;
        user.save()
        .then(user => {
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
      }
    })
    .catch(err => {
      return done(err);
    });
  }));
};
