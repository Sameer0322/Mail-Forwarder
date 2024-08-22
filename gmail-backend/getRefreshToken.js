const { google } = require('googleapis');
const open = require('open');
const readline = require('readline');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function getAccessToken(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  open(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oauth2Client.setCredentials(token);
      console.log('Access Token:', token.access_token);
      console.log('Refresh Token:', token.refresh_token);
    });
  });
}

getAccessToken(oauth2Client);
