# get csv from https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/
# format location
cut -d ";" -f 2 019HexaSmal.csv | awk '{ print tolower($0) }' | sort -u > location.txt
# get csv from https://www.insee.fr/fr/statistiques/6683035?sommaire=6683037
# extract useful file
unzip -j ensemble.zip donnees_communes.csv -d .
# compute order
cut -d ";" -f7,10 donnees_communes.csv |tr ";" ":" | awk '{ print tolower($0) }' | sed -e "s/ [0-9]*er\? arrondissement//g" | tail -n +2 > location_order.txt
# compute phonetic from wiktionary phonetic:word
python ../utils/phonetic.py ../phonetic/wiktionary_phonetic.txt --phonetic location.txt > location_phonetic.txt
# compute code in json
python ../utils/format.py --phonetic location_phonetic.txt --order location_order.txt --output json > location.json
