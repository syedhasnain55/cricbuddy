from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const liveUrl = "https://www.cricbuzz.com/cricket-match/live-scores";
const upcomingUrl = "https://www.cricbuzz.com/cricket-schedule/upcoming-series";

// Middleware
app.use(cors());

const axiosOptions = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  },
};

const fetchLiveMatches = async () => {
  try {
    const { data } = await axios.get(liveUrl, axiosOptions);
    const $ = cheerio.load(data);
    let matches = [];

    $("div[class*='cb-mtch-lst']").each((index, element) => {
      const matchDetails = $(element);
      const title = matchDetails.find("h3.cb-lv-scr-mtch-hdr").text().trim();
      const fullScoreText = matchDetails.find(".cb-scr-wll-chvrn").text().trim();
      const scoreParts = fullScoreText.split(/\s+(?=\w+\d)/);

      const team1 = scoreParts[0]?.match(/^[A-Z]+/)?.[0] || "N/A";
      const score1 = scoreParts[0]?.replace(/^[A-Z]+/, "").trim() || "N/A";
      const team2 = scoreParts[1]?.match(/^[A-Z]+/)?.[0] || "N/A";
      const score2 = scoreParts[1]?.replace(/^[A-Z]+/, "").trim() || "N/A";

      const status =
        matchDetails.find(".cb-text-complete").text().trim() ||
        matchDetails.find(".cb-text-live").text().trim() ||
        matchDetails.find(".cb-text-preview").text().trim() ||
        "Upcoming";

      if (title) {
        matches.push({ title, team1, score1, team2, score2, status });
      }
    });

    return matches;
  } catch (error) {
    console.error("Error fetching live matches:", error.message);
    return [];
  }
};


// 📌 API Routes
app.get("/", (req, res) => {
  res.send(
    "Welcome to CricBuddy Live Match API! Use /live-matches or /upcoming-matches to get match data."
  );
});

app.get("/live-matches", async (req, res) => {
  const matches = await fetchLiveMatches();
  res.json(matches);
});

app.get("/upcoming-matches", async (req, res) => {
  const matches = await fetchUpcomingMatches();
  res.json(matches);
});

// Start Server
app.listen(PORT, () => console.log(✅ Server running on port ${PORT}));
