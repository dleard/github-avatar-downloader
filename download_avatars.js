const request = require('request');
const secrets = require('secrets');

console.log('Welcome to the GitHub Avatar Downloader');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("lighthouse-labs", "tweeter", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});