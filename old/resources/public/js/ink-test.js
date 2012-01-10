// If the user is drawing a stroke, stops reloads of canvas
var stopReloads = false;
var strokes;

//uses regex to match inidividual strokes in the string of
//serialized strokes and returns it as an array of strings
//representing the strokes
function strokesArray() {
  pattern = /\([^\(\)]+\)/g;
  return $("#my-ink").ink("serialize").match(pattern);
}

//sends the stroke to the server.  added is a boolean: true for a new
//stroke, false for a erased stroke
function sendStroke(stroke, added) {
  $.ajax({
    type: "POST",
    url: added ? "/ink/add-stroke" : "/ink/remove-stroke",
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
  removedStroke = diff(currentStrokes, strokes);
  strokes = currentStrokes;
  sendStroke(removedStroke, false);
}

function sendStrokes() {
  strokes = $("#my-ink").ink("serialize");
  $.ajax({
    type: "POST",
    url: "/ink/store-data",
    async: false,
    data: {data: strokes},
    success: function(data) {
      stopReloads = false;
    }
  });
}

function draw() {
  $("#my-ink").ink("deserialize", strokes, true);
}

function clearStrokes() {
  $.ajax({
    type: "POST",
    url: "/ink/strokes/clear",
    async: false,
    success: function(data) {
      strokes = "";
      draw();
    }
  });
}

function reloadCanvas() {
  $.ajax({
    type: "GET",
    url: "ink/strokes",
    async: false,
    success: function(data) {
      strokes = data;
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

$(document).ready(function() {
  resizeInkDiv();

  //create the ink widget
  $("#my-ink").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: addLastStroke,
    onStrokesErased: removeErasedStroke
  });

  //set interval for canvas refresh
  setInterval(function() {
    if(!stopReloads) {
      reloadCanvas();
    }
  }, 10);

  //bind handlers to tool buttons
  $("#clear").click(function() {
    $("#my-ink").ink("clear", true);
    sendStrokes();
  });

  $("#pencil").click(function() {
    $("#my-ink").ink("option", "mode", "write");
  });

  $("#eraser").click(function() {
    $("#my-ink").ink("option", "mode", "erase");
  });

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
