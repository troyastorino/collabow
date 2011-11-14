var mouseDown = false;

function sendData() {
  $.post("/ink/store-data", {data: $('#my-ink').ink("serialize")},
        function(data) {
          console.log(data);
          drawData();
          mouseDown = false
        });
}

function drawData() {
  if (!mouseDown) {
    $.get("ink/data", function(data) {
      $("#my-ink").ink("deserialize",data, true);
    });
  }
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
    onStrokeAdded: sendData,
    onStrokesErased: sendData
  });

  //set interval for redrawing 
  setInterval(drawData, 50);

  //bind clearing of the screen to click event
  $("#clear").click(function() {
    $("#my-ink").ink("clear", true);
    sendData();
  });

  $("#my-ink canvas").mousedown(function() {
    mouseDown = true
  });
});
