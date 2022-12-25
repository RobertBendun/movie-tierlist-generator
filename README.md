# Tier list generator from IMDb ratings data

Automatically generates tier list given IMDb ratings for given year.

## Requirements

Typescript installed via node, curl, wget

## Usage

1. Create `.env` file in project directory with `OMDB_KEY=<your omdb key>` ([omdb](https://www.omdbapi.com/))
2. Copy IMDb ratings CSV file to project directory.
3. Run `YEAR=2022 ./build.sh`. Swap 2022 for your favourite year
4. Copy index.html and posters directory to your server location and enjoy OR launch index.html in browser.

