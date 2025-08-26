const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // fix path
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;
    res.render('result', {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed
    });

  } catch (error) {
    res.render('result', { error: "City not found! Try again." });
  }
});

// Export app for Vercel
module.exports = app;

