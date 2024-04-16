function PAOL(dicos) {
  this.dicos = dicos;

  // search number value for string in dico
  this.searchStringDico = (str, dico, current = '', found = false) => {
    if (Array.isArray(dico['']) && dico[''].indexOf(str) !== -1) {
      found = current;
    }

    Object.keys(dico).forEach((num) => {
      if (num !== '' && !found) {
        found = this.searchStringDico(str, dico[num], current+num, found);
      }
    });

    return found;
  }

  // find proposition from string using dico
  function searchNumberDico(str, dico, current="", output={}) {
    if (dico[''] && dico[''].length > 0) {
      output[current] = dico['']
    }
    while(str.length != 0 && dico[str[0]]) {
      return searchNumberDico(str.slice(1), dico[str[0]], current+str[0], output)
    }
    return output
  }

  // find all propositions in dico for string beginning
  function searchMaxStringDico(str, dico) {
    var output = {};
    str = str.map(elt => elt.split('.').slice(-1)[0])
    str = str.filter((val, ind, arr) => arr.indexOf(val) === ind);
    for (var i = 0; i < str.length; i++) {
      output[str[i]] = searchNumberDico(str[i], dico);
    }
    return output
  }

  // merge search
  function mergeSearch(obj) {
    var output = {}
    Object.keys(obj).forEach(function(ob) {
      Object.keys(obj[ob]).forEach(function(o) {
        output[o] = obj[ob][o]
      })
    })
    return output
  };

  // event called on selection
  this.submitFormProposition = (evt) => {};

  // form generation with select for all results
  this.generateFormProposition = (newsearch, output, solutions) => {
    var solution = document.createElement('li');
    solutions.appendChild(solution);
    var sol = document.createElement('ul');
    solution.appendChild(sol);
    var submit = this.submitFormProposition;
    if (newsearch.length !== 0) {
      newsearch.forEach(function(res) {
        var li = document.createElement('li');
        sol.appendChild(li);
        var text = document.createTextNode(res + ' ');
        li.appendChild(text);
        var form = document.createElement('form');
        form.method = 'GET';
        form.onsubmit = submit;
        li.appendChild(form);
        res.split('.').forEach(function(o, i) {
          var select = document.createElement('select');
          form.appendChild(select);
          select.name = Object.keys(dicos)[i];
          if (o != "") {
            output[i][o].forEach(function(op) {
              var opt = new Option(op,op);
              select.appendChild(opt);
            })
          }
        });
        var btn = document.createElement('button');
        var btntext = document.createTextNode('select');
        btn.appendChild(btntext);
        btn.type = "submit";
        form.appendChild(btn);
      });
    } else {
      var li = document.createElement('li');
      li.appendChild(document.createTextNode('error'));
      sol.appendChild(li);
    }
  }

  // search all poal for a number string
  this.proposition = (str) => {
    var current = {},
      output = [],
      search = [str],
      newsearch = []
    Object.keys(dicos).forEach((key, i) => {
      current = searchMaxStringDico(search, dicos[key]); //, output[i]);
      newsearch = []
      search.forEach(function(s) {
        var sol = s.split('.').slice(-1)[0]
        if (sol != '') {
          Object.keys(current[sol]).forEach(function(c) {
            newsearch.push((s.split('.').slice(0,-1).concat(c).join('.'))+'.'+(s.split('.').slice(-1)[0].slice(c.length)))
          })
        } else {
          newsearch.push(s+'.')
        }
      })
      search = newsearch;
      output[i] = mergeSearch(current)
    })
    newsearch = search.filter((val) => val.slice(-1) === '.').map(elt => elt.slice(0,-1))
    return [newsearch, output];
  }
}

