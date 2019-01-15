const request = require('request');
const secrets = require('./secrets');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader');

function getRepoContributors(cb) {
  const repoOwner = process.argv[2];
  const repoName = process.argv[3];
  if (!repoOwner || !repoName) { return console.log('Invalid input. \n correct syntax: node download_avatars.js <repoOwner> <repoName>'); }
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    bodyParsed = JSON.parse(body);
    cb(err, bodyParsed);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(error) {
      throw error;
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(function(err, result) {
  if (err) { console.log("Errors:", err); }
  for (let i = 0; i < result.length; i++) {
    const filePath = 'avatars/' + result[i].login + '.jpg';
    downloadImageByURL(result[i].avatar_url, filePath);
  }
  if (result) { console.log('Images downloading'); }
});