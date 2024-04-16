import argparse
import json
import sys
from numberize import convert_text

parser = argparse.ArgumentParser()
parser.add_argument("ref", help="phonetic filename ref")
parser.add_argument("--phonetic", help="phonetic to extract")
parser.add_argument("--filter", help="filter filename")
args = parser.parse_args()

# phonetic:word
def loadRef(ref):
    phonetic = {}
    with open(ref, 'r') as myfile:
        data = myfile.read()
    lines = data.split("\n")
    for line in lines:
        line = line.split(":")
        if len(line) == 2:
            try:
                phonetic[line[1]].append(line[0])
            except:
                phonetic[line[1]] = [line[0]]
    return phonetic

ref = loadRef(args.ref)

if args.phonetic:
    with open(args.phonetic, 'r') as myfile:
        data = myfile.read()
    lines = data.split("\n")
    for line in lines:
        if line in ref and len(list(set([convert_text(_) for _ in ref[line]]))) == 1:
            print(ref[line][0]+":"+line)

if args.filter:
    with open(args.filter, 'r') as myfile:
        data = myfile.read()
    lines = data.split("\n")
    for line in lines:
        line = line.split(":")
        if len(line) == 2:
            if line[1] not in ref or len(list(set([convert_text(_) for _ in ref[line[1]]]))) == 1:
                print(line[0]+":"+line[1])
