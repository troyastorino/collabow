// variables that determine size of canvas, depend on device
var x;
var y;

function sendData() {
  $("input#data").val($("#my-ink").ink('serialize'));
  //    $("#data-form input[type='submit']").click();
}

/*
function draw() {
  var ctx = (a canvas context);
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  */

$(document).ready(function() {
  
  //gets values from window size
  x = $(window).width()-40
  y = $(window).height()-140

  
  //grab div element and create canvas with variables
  $("#my-ink").height(y+"px");
  $("#my-ink").width(x+"px");
  
  $("#my-ink").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: sendData
    });

  $("button").click(function() {
      $("#my-ink").ink("clear", true)
   })
   
})


/*my notes...

onStrokeAdded, serialize only the newest stroke.
onStrokeErased, take away the erased stroke
onErasingEnded- may not need

*/

/* sample jquery code

// html tag
	<div id="myInk"></div>
	
	// create new ink
	$("#myInk").ink({
		mode: "write",
		rightMode: "erase",
		onStrokeAdded: function () { alert("Stroke added!"); }
	});
	
	// get or set some option
	var strokeColor = $("#myInk").ink("option", "strokeColor");
	$("#myInk").ink("option", "backgroundColor", "#abc");
	
	// bind a handler
	$("#myInk").bind("onStrokesErased", function () { alert("Strokes erased!") });
	
	// call a method
	var strokes = $("#myInk").ink("strokes");
	$("#myInk").ink("clear", true);
	
	*/
	
