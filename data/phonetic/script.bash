# download french articles from wiktionary
wget https://dumps.wikimedia.org/frwiktionary/latest/frwiktionary-latest-pages-articles.xml.bz2
# bunzip and keep only usefull information
bzcat frwiktionary-latest-pages-articles.xml.bz2 | grep -e "^=== \|^'''" > frwiktionary-latest-pages-articles.txt
# extract phonetics
cat frwiktionary-latest-pages-articles.txt | perl extract_phonetic.pl | sort -u > wiktionary_phonetic.txt
# remove useless files
rm frwiktionary-latest-pages-articles.*
