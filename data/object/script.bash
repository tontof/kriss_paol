# download french nouns
wget https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/noun.csv
# remove plural
cat noun.csv | grep -v "'plural'" | cut -d "," -f 1 | grep -v [0-9.] > object.txt
# compute phonetic from wiktionary phonetic:word
python ../utils/phonetic.py ../phonetic/wiktionary_phonetic.txt --phonetic object.txt > object_phonetic.txt 
# compute code in json
python ../utils/format.py --phonetic object_phonetic.txt --order ../order/opensubtitles_fr_order.txt --filter object_filter.txt  --output json > object.json
