const request = require('request');
const secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    const images = [];
    body = JSON.parse(body);
    cb(err, body);  
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) console.log("Errors:", err);
  for (let i = 0; i < result.length; i++) {
    console.log("Result:", result[i].avatar_url);
  }
});