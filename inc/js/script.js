// load query string parameters
const params = new URLSearchParams(window.location.search);

// look for dicos and add it to main number form
function addDicosToForm(form, dicos) {
  if (!isDefaultJson) {
    dicos.forEach((dico) => {
      let input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', 'dicos[]');
      input.setAttribute('value', dico);
      form.appendChild(input);
    });
  }
}
let isDefaultJson = true;
let jsons = params.getAll('dicos[]');
params.delete('dicos[]');
if (jsons.length === 0) {
  jsons = ['person.json', 'action.json', 'object.json', 'location.json'];
} else {
  isDefaultJson = false;
  addDicosToForm(document.querySelector('form'), jsons);
  document.querySelector('form').addEventListener('submit', (evt) => {
    let form = evt.target;
    let formData = new FormData(form);
    let url = new URLSearchParams(formData);
    let link = document.createElement('a');
    link.setAttribute('href', decodeURI('?'+url));
    let text = document.createTextNode('lien');
    link.appendChild(text);
    form.appendChild(link);
    evt.preventDefault();
  });
}

// set default number in form
let defaultNumber = '';
if (params.has('number')) {
  defaultNumber = params.get('number');
  params.delete('number');
}

// load KrISS paol
let dicos = {};
let promises = [];
let paol;
function loadJson(file) {
  let key = (file.split('.')[0]).split('_')[0];
  dicos[key] = {};
  return fetch('inc/json/'+file)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.text();
    })
    .then((response) => {
      dicos[key] = JSON.parse(response);
    });
}
jsons.forEach((json) => promises.push(loadJson(json)));
Promise.all(promises).then(() => {
  paol = new PAOL(dicos);
  paol.submitFormProposition = (evt) => {
    let form = evt.target;
    addDicosToForm(form, jsons);
  };

  document.getElementById('input').addEventListener('input', (evt) => {
    let form = document.querySelector('form');
    let formData = new FormData(form);
    let url = new URLSearchParams(formData);
    let link = form.querySelector('a');
    link.setAttribute('href', decodeURI('?'+url));

    var solutions = document.getElementById('solutions');
    solutions.innerHTML = "";
    [props, output] = paol.proposition(document.getElementById('input').value);
    paol.generateFormProposition(props, output, solutions);
  });
  if (defaultNumber.length > 0) {
    document.getElementById('input').value = defaultNumber;
    document.getElementById('input').dispatchEvent(new Event('input'));
  }
  if (params.size > 0) {
    results = [];
    let final = ''; 
    params.forEach((value, key) => {
      if (dicos[key]) {
        let result = paol.searchStringDico(value, dicos[key]);
        result = result?result:'?';
        results.push([key, value, result]);
        final += result;
      }
    });
    results.forEach((elt) => {
      document.getElementById('solutions').innerHTML += '<li>'+elt.join(' : ')+'</li>';
    });
    if (final.indexOf('?') === -1) {
      document.getElementById('solutions').innerHTML += '<li>Le nombre correspondant est: <strong>'+final+'</strong></li>';
    } else {
      document.getElementById('solutions').innerHTML += '<li>unknown</li>';
    }
  }
});
