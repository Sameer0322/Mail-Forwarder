const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

app.get('/emails', async (req, res) => {
  try {
    let allEmails = [];
    let pageToken;

    do {
      const response = await gmail.users.messages.list({
        userId: 'me',
        pageToken: pageToken,
        maxResults: 100, // Adjust as needed
      });
      allEmails = allEmails.concat(response.data.messages || []);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    res.json(allEmails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send('Failed to fetch emails');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
