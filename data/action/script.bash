# get french verbs
wget https://github.com/Drulac/Verbes-Francais-Conjugues/raw/master/verbes_lowercase.json
# extract present and future tenses
python action.py > action.txt
# compute phonetic from wiktionary
python ../utils/phonetic.py ../phonetic/wiktionary_phonetic.txt --phonetic action.txt > action_phonetic.txt
# compute code in json
python ../utils/format.py --phonetic action_phonetic.txt --order ../order/opensubtitles_fr_order.txt --output json > action.json
