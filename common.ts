function zipToRating(
  keys: string[],
  vals: string[]
): Rating {
  function fixCellType(key: string, value: string): any {
    switch (key) {
      case "YourRating":
      case "IMDbRating":
      case "Year":
      case "NumVotes":
        return parseFloat(value);

      case "Genres":
      case "Directors":
        return value.split(",").map((entry) => entry.trim());

      default:
        return value;
    }
  }

  return keys.reduce((object, key, index) => {
    object[key] = fixCellType(key, vals[index]);
    return object;
  }, {} as { [key: string]: any }) as Rating;
}

// FIXME: This parser doesn't support quotes quoting
// FIXME: This parser doesn't support multiple quoted fragments inside one cell
function parseRatingsLine(line: string): string[] {
  const result: string[] = [];

  let previous = 0;
  let i = 0;
  let insideQuotes = false;

  let current = "";

  function append() {
    if (current) {
      result.push(current);
      current = "";
    } else {
      result.push(line.substring(previous, i));
    }
    previous = i + 1;
  }

  line += "\0";
  for (; ; ++i) {
    switch (line[i]) {
      case '"':
        if (insideQuotes) {
          current += line.substring(previous + 1, i - 1);
        }
        insideQuotes = !insideQuotes;
        break;

      case ",":
        if (!insideQuotes) {
          append();
        }
        break;

      case "\0":
        append();
        return result;
    }
  }
}

export type Rating = {
  ID: string;
  YourRating: number;
  DateRated: string;
  Title: string;
  URL: string;
  TitleType:
    | "movie"
    | "musicVideo"
    | "tvEpisode"
    | "tvMiniSeries"
    | "tvMovie"
    | "tvSeries"
    | "tvSpecial";
  IMDbRating: number;
  Year: number;
  Generes: string[];
  NumVotes: number;
  ReleaseDate: string;
  Directors: string[];
};

const targetYear = process.env.YEAR
  ? parseInt(process.env.YEAR)
  : 2022;

export function parseRatings(source: string) {
  const [rawHeader, ...lines] = source.split("\n");
  const header = parseRatingsLine(rawHeader).map((header) =>
    header == "Const" ?
      "ID" :
    header == "Runtime (mins)" ?
      "Runtime" :
      header.replace(" ", "")
  );

  return lines
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => zipToRating(header, parseRatingsLine(line)))
    .filter(rating => rating.TitleType != 'tvEpisode')
    .filter(rating => rating.Year == targetYear);
}