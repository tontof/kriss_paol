# https://fr.wikipedia.org/wiki/Code_chiffres-sons
def numberize(text):
    letter = text[0]
    if letter in 'zs':
        return '0'
    elif letter in 'dtθð':
        return '1'
    elif letter in 'nŋɲ':
        return '2'
    elif letter in 'm':
        return '3'
    elif letter in 'rɹʁ':
        return '4'
    elif letter in 'l':
        return '5'
    elif letter in 'ʃʒ':
        return '6'
    elif letter in 'kɡ':  # beware ɡ letter is not common g
        return '7'
    elif letter in 'fv':
        return '8'
    elif letter in 'pb':
        return '9'
    else:
        return ''

def convert_text(text):
    return ''.join([numberize(w) for w in list(text)])

