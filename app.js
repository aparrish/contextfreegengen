var ds,
    generated = false;

function parseUrl(url) {
  if (url.match(/\/d\/(.*)\//)) {
    return url.match(/\/d\/(.*)\//)[1];
  }
  if (url.match(/key=(.*)#/)) {
    return url.match(/key=(.*)#/)[1];
  }
  else return null;
}

var pick = function(array) {
  array = _.reject(array, function(el) {
    return el === null;
  });
  return array[Math.floor(Math.random()*array.length)];
};

function doIt(key) {
  url = $('#url').val();
  var key = parseUrl(url);
  var $genButton = $('<div id="generator"><button onclick="generate()">Generate</button><h2 id="title">...</h2><h3 id="author"></h3><div id="generated">...</div><p><a href="gen.html?key=' + key + '">Share this link with your friends!</a></div>');

  ds = new Miso.Dataset({
    key : key,
    worksheet : '1',
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser : Miso.Dataset.Parsers.GoogleSpreadsheet
  });

  ds.fetch({
    success : function() {
      if (generated) {
        $('#generator').remove();
      }
      $('#result').text('Success! Now you can generate stuff:');
      $('#result').after($genButton);
      generated = true;
      generate();
    },
    error : function() {
      $('#result').text('Um, something went wrong...');
    }
  });
}

function genString(grammar, axiom) {
  var s = "";
  if (grammar.hasOwnProperty(axiom)) {
    var expansion = pick(grammar[axiom]);
    var tokens = expansion.split(/\b/);
    _.each(tokens, function(token) {
      s += genString(grammar, token);
    });
  }
  else {
    s += axiom;
  }
  return s;
}

function generate() {
  var result = '';
  var title = 'My Generator';
  var author = 'Someone';
  var axiom = 'S';
  var grammar = {}
  ds.each(function(row) {
    console.log(row);
    if (row['Rule'] == 'GenTitle') {
      title = row['Expansion'];
    }
    else if (row['Rule'] == 'GenAuthor') {
      author = row['Expansion'];
    }
    else if (row['Rule'] == 'GenAxiom') {
      axiom = row['Expansion'];
    }
    else {
      if (!grammar.hasOwnProperty(row['Rule'])) {
        grammar[row['Rule']] = [];
      }
      grammar[row['Rule']].push(row['Expansion']);
    }
  });
  var result = genString(grammar, axiom);
  $('#title').text(title);
  $('#author').text('by ' + author);
  $('#generated').text(result);
}

function showHelp() {
  $('#help').fadeToggle();
}
