function sendData() {
  $("input#data").val($("#my-ink").ink('serialize'));
  //    $("#data-form input[type='submit']").click();
}

$(document).ready(function() {
  $("#my-ink").ink({
    mode: "write",
    rightMode: "erase",
    onStrokeAdded: sendData
  });
})
