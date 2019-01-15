const request = require('request');
require('dotenv').config();
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader');

/**
  * @desc makes a request to provided repo, parses data and passes to callback function
  * @param function $cb callback function
  * @return void
*/

function getRepoContributors(cb) {
  // takes repoOwner and repoName from command line
  const repoOwner = process.argv[2];
  const repoName = process.argv[3];
  if (!repoOwner || !repoName || process.argv.length !== 4) {
    return console.log('Invalid input. \n correct syntax: node download_avatars.js <repoOwner> <repoName>');
  }
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    bodyParsed = JSON.parse(body);
    cb(err, bodyParsed);
  });
}

/**
  * @desc pipes file from specified url and writes to specified file path
  * @param string $url - the url to request from
  * @param string $filePath - the path to write the file to
  * @return void
*/

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(error) {
      throw error;
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(function(err, result) {
  if (err) { console.log("Errors:", err); }
  if (!fs.existsSync()) { fs.mkdirSync('avatars'); }
  for (let i = 0; i < result.length; i++) {
    const filePath = 'avatars/' + result[i].login + '.jpg';
    downloadImageByURL(result[i].avatar_url, filePath);
  }
  if (result) { console.log('Images downloading'); }
});