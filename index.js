const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/avatar/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const userRes = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
    const userData = await userRes.json();

    if (!userData.Id) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userData.Id;

    const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`);
    const thumbData = await thumbRes.json();

    if (!thumbData.data || !thumbData.data[0]) {
      return res.status(500).json({ error: 'Failed to fetch avatar thumbnail' });
    }

    res.json({
      username,
      userId,
      avatarUrl: thumbData.data[0].imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
