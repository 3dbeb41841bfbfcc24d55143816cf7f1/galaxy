// const GitHubApi = require("github");
const GitHubApi = require("node-github");
const credentials = require("./credentials");

(function() {

  const github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional args
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "/",        // for some GHEs; none for GitHub
    timeout: 30000,
    Promise: require('bluebird'),

    // default: true; there's currently an issue with non-get redirects,
    // so allow ability to disable follow-redirects
    followRedirects: false,

    headers: {
      "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    }
  });

  const authenticate = function() {
    github.authenticate( { type: "basic", username: credentials.username, password: credentials.password } );
  };

  const reposForOrg = function(org, callback) {
    github.repos.getForOrg({ org: org}, function(err, repos) {
      if (err) {
        console.log('ERROR:', err);
      }
      else {
        repos.forEach(function(repo) {
          callback(repo);
        });
      }
    });
  };

  module.exports.github = github;
  module.exports.authenticate = authenticate;
  module.exports.reposForOrg = reposForOrg;

})();
