import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github';

exports.setup = function(User, config) {
  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('searching for user with github id:', profile.id);
    User.findOne({
      'github.id': Number(profile.id)
    })
    .then(function(user) {
      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
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
      } else {
        return done(null, user);
      }
    })
    .catch(function(err) {
      return done(err);
    });
  }));
};
