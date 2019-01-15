const request = require('request');
require('dotenv').config();
const fs = require('fs');


/**
  * @desc makes a request to provided repo, parses data and passes to callback function
  * @param function $cb callback function
  * @return void
*/

function getRepoContributors(cb) {
  // takes repoOwner and repoName from command line
  const repoOwner = process.argv[2];
  const repoName = process.argv[3];
  
  // error handling checks
  if (!fs.existsSync('./.env')) {
    return console.log('.env file missing \nsee https://github.com/motdotla/dotenv for details on configuring .env file.');
  }

  if (!process.env.GITHUB_TOKEN) {
    return console.log('GITHUB_TOKEN variable missing from .env \nsee https://github.com/motdotla/dotenv for details on configuring .env file.');
  }
  
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
    if (res.headers.status === '401 Unauthorized') {
      return console.log('GITHUB_TOKEN is invalid \nCheck your token or reset here https://github.com/settings/tokens');
    }
    if (res.headers.status !== '200 OK') { return console.log('Repo not found'); }
    bodyParsed = JSON.parse(body);
    cb(err, bodyParsed);
  });
}

let starCount = {};

function getMostStarred(err, result) {
  if (err) { console.log("Errors:", err); }
  
  for (let i = 0; i < result.length; i++) {
    let url = result[i].starred_url;
    url = url.substr(0, url.length - 15);
    
    const options = {
      url,
      headers: {
        'User-Agent': 'request',
        'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    };
    
    let dataString = '';
    request(options)
      .on('error', function(error) {
        throw error
      })
      .on('data', function(data) {
        dataString += data;
      })
      .on('end', function(data) {
        const dataObject = JSON.parse(dataString);
        for (key in dataObject) {
          const repoName = dataObject[key].name;
          if (Object.keys(starCount).includes(repoName)) starCount[repoName]++;
          else starCount[repoName] = 1;
        }
      });
  }
  
  setTimeout(wait, 2000);
  
  function wait() {
    let starArray = []
    for (key in starCount) {
      starArray.push([key, starCount[key]]);
    }
    starArray = starArray.sort(function(a,b) {
      return b[1] - a[1]; 
    })
    console.log('Recommended Repos:\n')
    for (let i = 0; i < 5; i++) console.log('[ ' + starArray[i][1] + ' stars ]\t' + starArray[i][0]);
  }
}

getRepoContributors(function(err, result) {
  if (err) { console.log("Errors:", err); }
  getMostStarred(err, result);
  
});