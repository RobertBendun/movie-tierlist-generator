#!/usr/bin/env bash

. .env

Base_Url="http://www.omdbapi.com/?apikey=$OMDB_KEY&i="

mkdir -p posters
cd posters
for id in $(cat ../ids); do
	if [ -f "$id.jpg" ]; then
		echo "Skipping ${id}"
	else
		echo "Fetching ${id}"
		url="$(curl -s "${Base_Url}${id}" | gron |  awk -F'"' '/\.Poster/ { print $2 }')"
		wget "$url" --quiet -O "$id.jpg"
	fi
done
