var canvasWidth = 490;
var canvasHeight = 220;

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

$(document).ready(function() {
  $('div#canvasDiv').append($('<canvas id="canvas"></canvas>').width(canvasWidth).height(canvasHeight));
  var canvas = $('#canvas');
  if (typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vlmCanvasManager.initElement(canvas);
  }
  var context = canvas[0].getContext("2d");

  function redraw() {
    canvas.width = canvas.width; // Clears the canvas
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
    
    for(var i=0; i < clickX.length; i++)
    {		
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();
    }
  }

  $('canvas').mousedown(function(e) {
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  $('canvas').mousemove(function(e) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  $('canvas').mouseup(function(e) {
    paint = false;
  })

  $('canvas').mouseleave(function(e){
    paint = false;
  });
});
