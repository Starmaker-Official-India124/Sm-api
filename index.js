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
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/', (req, res) => {
  res.send('StarMaker API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
