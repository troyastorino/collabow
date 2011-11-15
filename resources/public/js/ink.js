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
      draw(data);
      stopReloads = false;
      console.log("sent data");
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
      console.log("canvas reload");
    }
  });
}

$(document).ready(function() {
  //gets values from window size
  x = $(window).width()-40
  y = $(window).height()-180

  //grab div element and create canvas with variables
  $("#my-ink").height(y+"px");
  $("#my-ink").width(x+"px");

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
  }, 50);

  //bind clearing of the screen to click event
  $("#clear").click(function() {
    $("#my-ink").ink("clear", true);
    sendStrokes();
  });

  $("#my-ink canvas").mousedown(function() {
    stopReloads = true
  });
});
