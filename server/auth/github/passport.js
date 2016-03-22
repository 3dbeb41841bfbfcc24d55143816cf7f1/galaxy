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
    .then(function(user) {
      if (!user) {
        return Cohort.findOne({ name: 'ATL WDI #6' })
        .then(currentCohort => {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            role: 'student',
            cohort: currentCohort._id,
            provider: 'github',
            github: profile._json
          });
          user.save()
          .then(function(user) {
            return done(null, user);
          })
          .catch(function(err) {
            return done(err);
          });
        });
      }
      else {
        return done(null, user);
      }
    })
    .catch(function(err) {
      return done(err);
    });
  }));
};
