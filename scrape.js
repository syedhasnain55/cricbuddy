import axios from "axios";
import cheerio from "cheerio";

// Cricbuzz URL for live scores
const CRICBUZZ_URL = "https://www.cricbuzz.com/cricket-match/live-scores";

const fetchLiveScores = async () => {
  try {
    // Fetch HTML content
    const { data } = await axios.get(CRICBUZZ_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Mimic a real browser to avoid blocking
      },
    });

    const $ = cheerio.load(data);
    let matches = [];

    // Select all match blocks
    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((index, element) => {
      const matchTitle = $(element).find(".cb-lv-scr-mtch-hdr").text().trim();
      const matchStatus = $(element).find(".cb-text-live, .cb-text-complete").text().trim();
      const teams = $(element).find(".cb-ovr-flo").text().split(" vs ");

      if (teams.length === 2) {
        matches.push({
          team1: teams[0].trim(),
          team2: teams[1].trim(),
          status: matchStatus || "Upcoming",
        });
      }
    });

    return matches;
  } catch (error) {
    console.error("Error fetching live scores:", error);
    return [];
  }
};

export default fetchLiveScores;
