// If the user is drawing a stroke, stops reloads of canvas
var stopReloads = false;
var strokes = [];
var url;

function splitStrokes(serializedStrokes) {
  pattern = /\([^\(\)]+\)/g;
  return String(serializedStrokes).match(pattern);
}

//uses regex to match inidividual strokes in the string of
//serialized strokes and returns it as an array of strings
//representing the strokes
function strokesArray() {
  return splitStrokes($("#my-ink").ink("serialize"));
}

//sends the stroke to the server.  added is a boolean: true for a new
//stroke, false for a erased stroke
function sendStroke(stroke, added) {
  ext = added ? "add-stroke" : "remove-stroke";
  $.ajax({
    type: "POST",
    url: insertPath(url, ext),
    async: false,
    data: {data: stroke},
    success: function(data) {
      stopReloads = false;
    }
  });
}

function addLastStroke() {
  strokes = strokesArray();
  lastStroke = strokes[strokes.length-1];
  sendStroke(lastStroke, true);
}

//assumes arrays are identical, except the smaller array is missing
//one element.  returns the missing element
function diff(smallerArray, largerArray) {
  for (i=0; i < largerArray.length; i++) {
    if (smallerArray[i] != largerArray[i]) {
      return largerArray[i];
    }
  }
}

function removeErasedStroke() {
  currentStrokes = strokesArray();
  removedStroke = (currentStrokes != null) ?
    diff(currentStrokes, strokes) : strokes[0];
  strokes = currentStrokes;
  sendStroke(removedStroke, false);
}

function draw() {
  serializedStrokes = (strokes.length != 0) ?
    strokes.reduce(function(x,y) {return x + y;}) : "";
  $("#my-ink").ink("deserialize", serializedStrokes, true);
}

function clearStrokes() {
  $.ajax({
    type: "POST",
    url: insertPath(url, "clear-strokes"),
    async: false,
    data: {},
    success: function(data) {
      strokes = [];
      draw();
    }
  });
}

function reloadCanvas() {
  $.ajax({
    type: "GET",
    url: insertPath(url, "strokes"),
    async: false,
    dataType: "json",
    success: function(data) {
      strokes = eval(data);
      draw();
    }
  });
}

function resizeInkDiv() {
  //gets values from window size
  x = $(window).width()-40
  y = $(window).height()-140

  //grab div element and create canvas with variables
  $("#my-ink").height(y+"px");
  $("#my-ink").width(x+"px");
}

function setSketchMode() {
  $("#my-ink").ink("option", "mode", "write");
  $("#pencil").replaceWith("<img id='pencil-selected' class='button' src='/img/pencilSELECT.png' alt='Currently in sketch mode' />");
  $("#eraser-selected").replaceWith("<img id='eraser' class='button' src='/img/eraser.png' alt='Erase' />");
  $("#eraser").click(setEraseMode);
}

function setEraseMode() {
  $("#my-ink").ink("option", "mode", "erase");
  $("#pencil-selected").replaceWith("<img id='pencil' class='button' src='/img/pencil.png' alt='Sketch' />");
  $("#eraser").replaceWith("<img id='eraser-selected'class='button' src='/img/eraserSELECT.png' alt='Currently in erasing mode' />");
  $("#pencil").click(setSketchMode);
}

$(document).ready(function() {
  url = getURL();

  resizeInkDiv();

  //create the ink widget
  $("#my-ink").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: addLastStroke,
    onStrokesErased: removeErasedStroke
  });

  //set interval for canvas refresh
  var refreshInterval = setInterval(function() {
    if(!stopReloads) {
      reloadCanvas();
    }
  }, 10);

  //bind handlers to tool buttons
  $("#clear").click(function() {
    $("#my-ink").ink("clear", true);
    clearStrokes();
  });

  $("#eraser").click(setEraseMode);

  //bind window resize to canvas resize
  $(window).resize(function() {
    resizeInkDiv();
    $("#my-ink").ink("resize", true);
  })

  //stop reloading while drawing
  $("#my-ink canvas").mousedown(function() {
    stopReloads = true
  });
});
