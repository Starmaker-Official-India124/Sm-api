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

  try {
    const response = await fetch(`https://starmaker.id.vn/wp-json/sm-user/v1/lookup?sid=${sid}`);
    const data = await response.json();

    if (!data || !data.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = data.user;
    const family = data.family || {};

    // Sirf important details nikaal rahe hain
    const result = {
      sid: user.sid || sid,
      name: user.name || user.stage_name || null,
      user_level: user.user_level || null,
      
      // VIP Details
      is_vip: user.is_vip || false,
      vip_level: user.vip_level || null,
      vip_name_color: user.vip_name_color || null,
      vip_level_anim_icon: user.vip_level_anim_icon || null,

      // Asset / Wealth
      asset_range: user.asset_range || null,

      // Noble Details
      is_noble: user.is_noble || false,
      noble_name: user.noble_name || null,
      noble_icon: user.noble_icon || null,
      noble_end_date: user.noble_end_date || null,

      // Extra useful
      profile_image: user.profile_image || null,
      created_on: user.created_on || null,
      family_name: family.name || null,
      family_id: family.id || null
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
