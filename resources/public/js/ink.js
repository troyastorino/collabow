$(document).ready(function() {
  $("#myInk").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: function () { alert("Stroke added!"); }
  });
})
