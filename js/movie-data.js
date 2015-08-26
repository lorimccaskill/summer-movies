// called in drawTable
function drawHeadings(tabletop, movieTable) {
  var columnRow = $('<tr></tr>');
  var movieColumns = tabletop.sheets('today').column_names;
  for (var i = 0; i < movieColumns.length; i++) {
    $('<th>' + movieColumns[i] + '</th>').appendTo(columnRow);
  }
  columnRow.appendTo(movieTable);
}

// called in drawTable
function drawRows(tabletop, movieTable) {
  var rowClass = tabletop[4].toLowerCase().replace(' ', '-');
	var movieRow = $('<tr class="' + rowClass + '"></tr>');

  // wrap each element in <td> element
  for (var i = 0; i < tabletop.length; i++) {
    if (i == 5){
      // creates "Details" link using 'Event URL' column data
      $('<td><a href="' + tabletop[i] + '" target="_blank">Details</a></td>').appendTo(movieRow);
    }
    else {
      var currentCell = $('<td>' + tabletop[i] + '</td>');
      currentCell.appendTo(movieRow);
    }
  }

  movieRow.appendTo(movieTable);
}

function drawTable(data, tabletop) {
  var movieTable = $('#summer-movies');

  drawHeadings(tabletop, movieTable);

  // take each row in spreadsheet and translate to HTML (drawRows function)
  var movies = tabletop.sheets('today').toArray();
  for (var i = 0; i < movies.length; i++) {
    var currentMovie = movies[i];
    drawRows(currentMovie, movieTable);
  }
}

// Google spreadsheet containing movie data
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1j4_0n3IEOENOx7eGuHz1UNgMQm2fjZNUanjo5OA7AOk/pubhtml';

// Initial function to gather movie data and transform into HTML table (callback: drawTable)
function init() {
  Tabletop.init( {
    key: public_spreadsheet_url,
    callback: drawTable,
    simpleSheet: true,
    parseNumbers: true } );
}

$(document).ready(init);