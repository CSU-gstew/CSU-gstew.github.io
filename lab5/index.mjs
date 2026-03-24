import express from "express";
import planets from "npm-solarsystem";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const nasaApiKey = "9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";
const pixabayKey = "20426927-497d14db9c234faf7d0df8317";

app.get("/", async (req, res) => {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&per_page=50&orientation=horizontal&q=solar system`
    );
    const data = await response.json();

    let randomImageURL = "";
    if (data.hits && data.hits.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.hits.length);
      randomImageURL = data.hits[randomIndex].webformatURL;
    }

    res.render("home", { image: randomImageURL });
  } catch (error) {
    console.error(error);
    res.render("home", { image: "" });
  }
});

app.get("/planetInfo", (req, res) => {
  const planet = req.query.planet;

  try {
    const planetInfo = planets[`get${planet}`]();
    res.render("planet", { title: planet, planetInfo });
  } catch (error) {
    console.error(error);
    res.send("Planet not found.");
  }
});

app.get("/nasa", async (req, res) => {
  try {
    const now = new Date();

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const today = formatDate(now);

    let response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${today}`
    );
    let data = await response.json();

    if (!data.url) {
      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(now.getDate() - 1);

      const yesterday = formatDate(yesterdayDate);

      response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${yesterday}`
      );
      data = await response.json();
    }

    res.render("nasa", { pod: data });

  } catch (error) {
    console.error(error);
    res.send("Unable to load NASA POD.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});