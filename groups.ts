import fs from "fs";
import { parseRatings, Rating } from "./common";

const input = fs.readFileSync("./ratings.csv", "utf-8");

const ratings = parseRatings(input)
  .sort((a, b) => {
    const score = b.YourRating - a.YourRating
    if (score == 0) {
      return a.Title.localeCompare(b.Title);
    }
    return score;
  });

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'Z';

function ratingToTier(rating: number): Tier {
  return (
    rating >= 10 ? 'S' :
    rating >= 9  ? 'A' :
    rating >= 7  ? 'B' :
    rating >= 4  ? 'C' :
    rating >= 2  ? 'D' :
    'Z'
  );
}

const groups: { [key: string]: Rating[] } = {
  'S': [],
  'A': [],
  'B': [],
  'C': [],
  'D': [],
  'Z': []
};


for (const rating of ratings) {
  const key = ratingToTier(rating.YourRating);
  groups[key] = [...groups[key], rating];
}

let html = "";
for (const [key, ratings] of Object.entries(groups)) {
  html += `<section id="${key}"><h2><div>${key}</div></h2><div>\n`;

  for (const rating of ratings) {
    html += `
      <a target="_blank" href="https://imdb.com/title/${rating.ID}">
        <img src="posters/${rating.ID}.jpg" alt="${rating.Title}" />
      </a>
    `;
  }
  html += `</div></section>\n`;
}

console.log(html);