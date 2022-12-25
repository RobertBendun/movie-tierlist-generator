#!/usr/bin/env bash

set -xe -o pipefail

if [ -z "$YEAR" ]; then
	export YEAR="$(date +%Y)"
else
	export YEAR="$YEAR"
fi

npx ts-node ids.ts > ids

./request.sh

cat header.html <(npx ts-node groups.ts) footer.html > index.html
sed -i "s/__YEAR__/$YEAR/" index.html
