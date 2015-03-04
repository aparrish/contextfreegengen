var $genButton = $('<button onclick="generate()">Generate Another!</button>');

function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( window.location.href ); 
  if( results == null ) {
    return "";  
  }
  else {
return results[1];
  }
}

function doIt(key) {
  ds = new Miso.Dataset({
    key : key,
    worksheet : '1',
    importer: Miso.Dataset.Importers.GoogleSpreadsheet,
    parser : Miso.Dataset.Parsers.GoogleSpreadsheet
  });

  ds.fetch({
    success : function() {
      // your success callback here!
      generate();
      $('#generated').after($genButton);
    },
    error : function() {
      // your error callback here!
    }
  });
}

doIt(gup('key'));
