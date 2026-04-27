require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Database connection ko aise hi rehne dein par then/catch ko chota karein
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// PORT ko upar define karein aur listen ko bahar nikal dein
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});