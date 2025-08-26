const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // ✅ one folder up
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); // ✅ one folder up

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.render("result", { error: "API key not configured!" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;
    res.render("result", {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    });
  } catch (error) {
    res.render("result", { error: "City not found! Try again." });
  }
});

// ✅ IMPORTANT: Export app for Vercel
module.exports = app;


