import express from "express";
import axios from "axios";
import { config } from "dotenv";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { weather: null, error: null });
})

app.post("/", async (req, res) => {
    const city = req.body.city;
    const api = process.env.API_KEY;
    const unit = "metric";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${api}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        console.log("City:", city);
        console.log("API Key:", api);

        const weather = {
            city: weatherData.name,
            country: weatherData.sys.country,
            temp: weatherData.main.temp,
            desc: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
        };
        res.render("index.ejs", { weather, error: null});
    } catch (error) {
        res.render("index.ejs", { weather: null, error: "City not found. Try Again"});
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})