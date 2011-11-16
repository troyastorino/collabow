// If the user in drawing a stroke, stops reloads of canvas
var stopReloads = false;

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

function draw(strokes) {
  $("#my-ink").ink("deserialize", strokes, true);}

function reloadCanvas() {
  $.ajax({
    type: "GET",
    url: "ink/data",
    async: false,
    success: function(data) {
      draw(data);
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
    onStrokeAdded: sendStrokes,
    onStrokesErased: sendStrokes
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
