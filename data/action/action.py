import json

with open('verbes_lowercase.json', 'r') as myfile:
    data=myfile.read()

obj = json.loads(data)
for verb in obj:
    try:
        #print(verb['indicatif']['imparfait'][2])
        print(verb['indicatif']['présent'][2])
        print(verb['indicatif']['futur simple'][2])
        #print(verb['infinitif']['présent'][0])
    except:
        continue
