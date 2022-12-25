#!/usr/bin/env bash

set -e -o pipefail

if [ -z "$YEAR" ]; then
	export YEAR="$(date +%Y)"
else
	export YEAR="$YEAR"
fi

. .env

Base_Url="http://www.omdbapi.com/?apikey=$OMDB_KEY&i="

mkdir -p posters
cd posters
for id in $(cd ..; npx ts-node ids.ts); do
	if [ -f "$id.jpg" ]; then
		echo "Skipping ${id}"
	else
		echo "Fetching ${id}"
		url="$(curl -s "${Base_Url}${id}" | gron |  awk -F'"' '/\.Poster/ { print $2 }')"
		wget "$url" --quiet -O "$id.jpg"
	fi
done
cd ..


cat header.html <(npx ts-node groups.ts) footer.html > index.html
sed -i "s/__YEAR__/$YEAR/" index.html
