const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/lookup', async (req, res) => {
  const sid = req.query.sid;

  if (!sid || !/^\d+$/.test(sid)) {
    return res.status(400).json({ error: 'Valid numeric StarMaker ID required' });
  }

  const ts = Math.floor(Date.now() / 1000);
  const url = `https://pay.starmakerstudios.com/rapid/user?category=6&id=\( {sid}&ts= \){ts}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 14; en-in; SM-E546B Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36 HeyTapBrowser/45.11.5.1',
        'Accept': 'application/json, text/plain, */*',
        'origin': 'https://m.starmakerstudios.com',
        'referer': 'https://m.starmakerstudios.com/',
        'accept-language': 'en-IN,en-US;q=0.9,en;q=0.8'
      }
    });

    const data = await response.json();

    if (!data || data.code !== 0 || !data.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = data.user;

    const result = {
      sid: user.id || sid,
      uid: user.uid || null,
      name: user.stage_name || null,
      stage_name: user.stage_name || null,
      user_level: user.level || null,
      profile_image: user.profile_image || null,
      country: user.country || null,

      // VIP
      is_vip: user.vip === 'vip' || user.vip === true || false,
      vip_level: null,           // is API me level nahi aata
      asset_range: null,         // is API me wealth nahi aata
      is_noble: null,            // is API me noble nahi aata
      noble_name: null,
      noble_end_date: null
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/', (req, res) => {
  res.send('StarMaker API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
