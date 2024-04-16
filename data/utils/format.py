import argparse
import json
import sys
from numberize import numberize, convert_text

parser = argparse.ArgumentParser()
parser.add_argument("--phonetic", help="phonetic filename")
parser.add_argument("--code", help="code filename")
parser.add_argument("--filter", help="filter filename")
parser.add_argument("--order", help="order filename")
parser.add_argument("--max", help="max output per code")
parser.add_argument("--output", help="output format: txt, json")
args = parser.parse_args()
val = []

def addTreeCode(code, liste, output):
    if len(code) == 0:
        output[''] = liste
    else:
        c = code.pop(0)
        try:
            output[c] = addTreeCode(code, liste, output[c])
        except:
            output[c] = {}
            output[c] = addTreeCode(code, liste, output[c])
    return output

def outputTree(codes):
    output = {}
    for code in codes:
        if len(code) > 0:
            output = addTreeCode([_ for _ in code], codes[code], output)
    return output

def outputTxt(codes):
    from functools import cmp_to_key
    output = ""
    def compare(item1, item2):
        if (len(item1) == len(item2)):
            return int(item1) - int(item2)
        return len(item1) - len(item2)

    for code in sorted(codes, key=cmp_to_key(compare)):
        if len(code) > 0:
            output = output + ("".join([(code+":"+_+"\n") for _ in codes[code]]))
    
    return output

def filterCode(codes,i):
    from functools import cmp_to_key
    with open(i, 'r') as myfile:
        data=myfile.read()
    filters = data.split("\n")
    for code in codes:
        codes[code] = [_ for _ in codes[code] if _ not in filters]
    
    return codes

def maxCode(codes,max):
    for code in codes:
        codes[code] = codes[code][:max]
    
    return codes

def orderCode(codes,i):
    from functools import cmp_to_key
    with open(i, 'r') as myfile:
        data=myfile.read()
    lines = data.split("\n")
    orders = {}
    for line in lines:
        line = line.split(":")
        if len(line) == 2:
            orders[line[0]] = int(line[1])

    def compare(item1, item2):
        try:
            val1 = orders[item1.lower()]
        except:
            val1 = 0
        try:
            val2 = orders[item2.lower()]
        except:
            val2 = 0
        if val1 != 0 or val2 != 0:
            return val2 - val1
        return int(item2 < item1)*2-1
    
    for code in codes:
        codes[code] = sorted(codes[code], key=cmp_to_key(compare))

    return codes

def inputPhonetic(codes, i):
    with open(i, 'r') as myfile:
        data=myfile.read()
    
    lines = data.split("\n")
    for line in lines:
        line = line.split(":")
        if len(line) == 2 and line[1] not in val:
            code = convert_text(line[0])
            val.append(line[1])
            try:
                codes[code].append(line[1])
            except:
                codes[code] = [line[1]]
    
    return codes

def inputCodes(codes, i):
    with open(i, 'r') as myfile:
        data=myfile.read()
    
    lines = data.split("\n")
    for line in lines:
        line = line.split(":")
        if len(line) == 2 and len(line[0])>0 and line[1] not in val:
            try:
                codes[line[0]].append(line[1])
            except:
                codes[line[0]] = [line[1]]
    
    return codes

codes={}
if (args.phonetic):
    codes = inputPhonetic(codes, args.phonetic)
if (args.code):
    codes = inputCodes(codes, args.code)
if (args.filter):
    codes = filterCode(codes, args.filter)
if (args.order):
    codes = orderCode(codes, args.order)
if (args.max):
    codes = maxCode(codes, int(args.max))
if (args.output):
    if args.output == "txt":
        print(outputTxt(codes))
    elif args.output == "json":
        print(json.dumps(outputTree(codes), ensure_ascii=False))

