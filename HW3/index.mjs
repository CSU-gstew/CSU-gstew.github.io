import express from "express";
import * as Astronomy from "astronomy-engine";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const nasaKey = "LMs5bqZHs62bFnkSMG1cfGZnVSr155gf4Ln0nQFu";

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function prettyDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
}

function shuffleArray(array) {
    let copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}


app.get("/", async (req, res) => {
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);

        const startDate = formatDate(start);
        const endDate = formatDate(end);

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${nasaKey}`;
        const response = await fetch(url);
        const flares = await response.json();

        const randomFlares = shuffleArray(flares).slice(0, 3);

        // Monterey, CA area
        const observer = new Astronomy.Observer(36.6002, -121.8947, 0);
        const now = new Date();

        const sunrise = Astronomy.SearchRiseSet(
            "Sun",
            observer,
            +1,
            now,
            1
        );

        const sunset = Astronomy.SearchRiseSet(
            "Sun",
            observer,
            -1,
            now,
            1
        );

        let sunriseText = "Not available";
        let sunsetText = "Not available";
        let dayLengthText = "Not available";

        if (sunrise && sunset) {
            const sunriseDate = sunrise.date;
            const sunsetDate = sunset.date;

            sunriseText = sunriseDate.toLocaleString();
            sunsetText = sunsetDate.toLocaleString();

            const diffMs = sunsetDate - sunriseDate;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            dayLengthText = `${hours} hours ${minutes} minutes`;
        }

        res.render("home", {
            randomFlares,
            prettyDate,
            sunriseText,
            sunsetText,
            dayLengthText
        });
    } catch (error) {
        console.error(error);
        res.render("home", {
            randomFlares: [],
            prettyDate,
            sunriseText: "Not available",
            sunsetText: "Not available",
            dayLengthText: "Not available"
        });
    }
});


app.get("/recent", async (req, res) => {
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);

        const startDate = formatDate(start);
        const endDate = formatDate(end);

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${nasaKey}`;
        const response = await fetch(url);
        const flares = await response.json();

        res.render("recent", {
            flares,
            startDate,
            endDate,
            prettyDate
        });
    } catch (error) {
        console.error(error);
        res.render("recent", {
            flares: [],
            startDate: "",
            endDate: "",
            prettyDate
        });
    }
});


app.get("/search", (req, res) => {
    res.render("search");
});


app.get("/results", async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        if (!startDate || !endDate) {
            return res.render("results", {
                flares: [],
                startDate: "",
                endDate: "",
                errorMsg: "Please enter both dates.",
                prettyDate
            });
        }

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${nasaKey}`;
        const response = await fetch(url);
        const flares = await response.json();

        res.render("results", {
            flares,
            startDate,
            endDate,
            errorMsg: "",
            prettyDate
        });
    } catch (error) {
        console.error(error);
        res.render("results", {
            flares: [],
            startDate: "",
            endDate: "",
            errorMsg: "Unable to load solar flare data.",
            prettyDate
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});