# https://www.insee.fr/fr/statistiques/2540004
# compute priorty word:nb
cut -d ";" -f 2,4 nat2021.csv | tr ";" " " | sort -k1,1 | awk 'BEGIN{var=""; count=0} {if (var!=$1 && var!="" && var !~ "^preusuel$" && var !~ "^_PRENOMS_RARES$") { printf "%s:%d\n",tolower(var),count; var=$1; count=$2} else { var=$1; count+=$2; }} END{printf "%s:%d\n",tolower(var),count}' > person_order.txt
# compute word only
cut -d":" -f1 person_order.txt > person.txt
# compute phonetic from wiktionary phonetic:word
python ../utils/phonetic.py ../phonetic/wiktionary_phonetic.txt --phonetic person.txt > person_phonetic.txt
# compute code in json
python ../utils/format.py --phonetic person_phonetic.txt --order person_order.txt --output json > person.json
