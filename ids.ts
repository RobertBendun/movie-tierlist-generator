import fs from "fs";
import { parseRatings } from "./common";

const input = fs.readFileSync("./ratings.csv", "utf-8");
const ratings = parseRatings(input);

for (const rating of ratings) {
  console.log(rating.ID);
}