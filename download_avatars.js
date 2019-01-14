const request = require('request');
const secrets = require('./secrets');
const fs = require('fs');

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

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(error) {
      throw error;
    })
    .on('response', function(response) {
      console.log('downloading image...');
    })
    .on('end', function() {
      console.log('download complete');
    })
    .pipe(fs.createWriteStream(filePath))
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) console.log("Errors:", err);
  for (let i = 0; i < result.length; i++) {
    console.log("Result:", result[i].avatar_url);
  }
});

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");