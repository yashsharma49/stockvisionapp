const express = require("express");
const axios = require("axios");

const app = express();

const API_KEY = "d9fjo19r01qu5nhepis0d9fjo19r01qu5nhepisg";

app.use(express.static("public"));

app.get("/price", async (req, res) => {

    const symbol = req.query.symbol;

    try {

        const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );

        res.json(response.data);

    }
    catch (err) {

        res.json({
            error: "Unable to fetch data."
        });

    }

});

app.get("/profile", async (req, res) => {

    const symbol = req.query.symbol;

    try {

        const response = await axios.get(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
        );

        res.json(response.data);

    }
    catch(error){

        res.json({
            error : "Unable to fetch company profile."
        });

    }

});

app.get("/news", async (req, res) => {

    const symbol = req.query.symbol;

    const today = new Date();

    const to = today.toISOString().split("T")[0];

    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 30);

    const from = fromDate.toISOString().split("T")[0];

    try {

        const response = await axios.get(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`
        );

        res.json(response.data);

    } catch (error) {

        res.json({
            error: "Unable to fetch news."
        });

    }

});

app.listen(5000, () => {

    console.log("Server Running on http://localhost:5000");

});