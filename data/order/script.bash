# get data from opensubtitles
wget https://github.com/hermitdave/FrequencyWords/raw/master/content/2018/fr/fr_full.txt
# format data
cat fr_full.txt | tr " " ":" > opensubtitles_fr_order.txt
# remove useless file
rm fr_full.txt
