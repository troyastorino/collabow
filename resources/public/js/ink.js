// If the user is drawing a stroke, stops reloads of canvas
var stopReloads = false;
var strokes = [];
var url = getURL();
var refresh = true;
var touchDevice = false;

if ($.browser.mobile || navigator.userAgent.match(/iPad/i) != null) {
  touchDevice = true;
}

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
  currentStrokes = strokesArray();
  addedStroke = (strokes != null) ?
    diff(strokes, currentStrokes) : currentStrokes[0];
  strokes = currentStrokes;
  sendStroke(addedStroke, true);
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

function setSketchMode () {
  $("#my-ink").ink("option", "mode", "write");
  $("#draw").addClass("hidden");
  $("#draw-selected").removeClass("hidden");
  $("#erase").removeClass("hidden");
  $("#erase-selected").addClass("hidden");
}

function setEraseMode() {
  $("#my-ink").ink("option", "mode", "erase");
  $("#draw").removeClass("hidden");
  $("#draw-selected").addClass("hidden");
  $("#erase").addClass("hidden");
  $("#erase-selected").removeClass("hidden");
}

function clickClearAll() {
  $("#my-ink").ink("clear", true);
  clearStrokes();
  $("#clear").removeClass("hidden");
  $("#clear-selected").addClass("hidden");
}

function setRefresh(millis) {
  if (refresh != null) {
    window.clearInterval(refresh);
  }
  refresh = window.setInterval(function() {
    if(!stopReloads) {
      reloadCanvas();
    }
  }, millis);
}

function initialize(millis) {
  resizeInkDiv();

  //create the ink widget
  $("#my-ink").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: addLastStroke,
    onStrokesErased: removeErasedStroke
  });
  
  //bind window resize to canvas resize
  $(window).resize(function() {
    resizeInkDiv();
    $("#my-ink").ink("resize", true);
  });

  setRefresh(millis);
}

if (!touchDevice) {
  $(document).ready(function() {
    initialize(100);
    
    //bind handlers to tool buttons
    $("#clear").click(clickClearAll);
    $("#erase").click(setEraseMode);
    $("#draw").click(setSketchMode);

    //stop reloading while drawing
    $("#my-ink canvas").mousedown(function() {
      stopReloads = true;
    });
  });
} else {
  $(document).bind("mobileinit", function() {
    $.extend($.mobile, {
      loadingMessage: false
    });
  });
  
  $.getScript("http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js");
  
  $("[data-role=page]").live("pageinit", function(event) {
    initialize(1000);
    
    //bind handlers to tool buttons
    $("#clear").tap(clickClearAll);
    $("#erase").tap(setEraseMode);
    $("#draw").tap(setSketchMode);

    //stop reloading while drawing
    $("#my-ink canvas").bind("vmousedown", function() {
      stopReloads = true
    });

    //set refresh rate on page refocus
    window.onload(function() {
      setRefresh(1000);
    });
  });
}
