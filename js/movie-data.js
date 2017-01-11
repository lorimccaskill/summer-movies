// called in drawTable
function drawHeading(movieColumns, movieTable) {
  var columnRow = $('<tr></tr>');
  for (var i = 0; i < movieColumns.length; i++) {
    $('<th>' + movieColumns[i] + '</th>').appendTo(columnRow);
  }
  columnRow.appendTo(movieTable);
}

// called in drawTable
function drawRows(currentRow, movieTable) {
  var rowClass = currentRow[4].toLowerCase().replace(' ', '-');
	var movieRow = $('<tr class="' + rowClass + '"></tr>');

  // wrap each element in <td> element
  for (var i = 0; i < currentRow.length; i++) {
    if (i == 5){
      // creates "Details" link using 'Event URL' column data
      $('<td><a href="' + currentRow[i] + '" target="_blank">Details</a></td>').appendTo(movieRow);
    }
    else {
      var currentCell = $('<td>' + currentRow[i] + '</td>');
      currentCell.appendTo(movieRow);
    }
  }

  movieRow.appendTo(movieTable);
}

function drawTable(movieData, movieColumns) {
  var movieTable = $('#summer-movies');

  drawHeading(movieColumns, movieTable);

  // make each object in movieData an HTML table row (drawRows function)
  for (var i = 0; i < movieData.length; i++) {
    var currentMovie = movieData[i];
    drawRows(currentMovie, movieTable);
  }
}

function showRow(selectorName) {
  var chosenRow = document.getElementsByClassName(selectorName);
  for (var i = 0; i < chosenRow.length; i++) {
    chosenRow[i].classList.remove('hide-row');
    chosenRow[i].classList.add('show-row');
  }
}

function hideRow(selectorName) {
  var chosenRow = document.getElementsByClassName(selectorName);
  for (var i = 0; i < chosenRow.length; i++) {
    chosenRow[i].classList.remove('show-row');
    chosenRow[i].classList.add('hide-row');
  }
}

function toggleRows(filterElement, filterName) {
  // remove '-filter' to create selector name that corresponds to row classes used
  var selectorName = filterName.replace('-filter', '');
  if (filterElement.classList.contains('selected')) {
    showRow(selectorName);
  } else {
    hideRow(selectorName);
  }
}

function setupFilter(filterName) {
  // listen for a click on a filter
  var filterElement = document.getElementById(filterName);
  filterElement.onclick = function(event) {
    console.log(filterName + ' click!');
    // update filter class to match recent action
    filterElement.classList.toggle('selected'); // TO DO: test in IE; unlikely that toggle is supported
    toggleRows(filterElement, filterName);
  }
}

function drawFilters(movieData) {
  // create a list of locations found in spreadsheet
  var places = [ ];
  var filterSet = document.getElementById('filter-set');

  // loop through each movie listing to add filters for places
  for (var i = 0; i < movieData.length; i++) {
    var currentPlace = movieData[i][4];
    if (places.includes(currentPlace) != true) { // TO DO: test in IE; may need Array.prototype.includes polyfill
      // when a new borough is found add it to 'places' array
      places.push(currentPlace);
      // create a selectable filter for the borough
      var elementID = currentPlace.toLowerCase().replace(' ', '-') + '-filter';
      $('<li id="' + elementID + '" class="selected">' + currentPlace + '</li>').appendTo(filterSet);
      setupFilter(elementID);
    }
  }

  // WEEKNIGHT and WEEKEND filters
  setupFilter('weeknight-filter');
  setupFilter('weekend-filter');

  // show filter set now that all elements are present
  filterSet.classList.remove('hidden');
}

function drawHTML(data, tabletop) {
  // turn spreadsheet rows into objects
  var movieData = tabletop.sheets('today').toArray();
  var movieColumns = tabletop.sheets('today').column_names;

  drawTable(movieData, movieColumns);
  drawFilters(movieData);
}

// Google spreadsheet containing movie data
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1j4_0n3IEOENOx7eGuHz1UNgMQm2fjZNUanjo5OA7AOk/pubhtml';

// Initial function to gather movie data and transform into HTML (callback: drawHTML)
function init() {
  Tabletop.init( {
    key: public_spreadsheet_url,
    callback: drawHTML,
    simpleSheet: true,
    parseNumbers: true } );
}

$(document).ready(init);