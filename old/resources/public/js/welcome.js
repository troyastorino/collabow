$(document).ready(function () {
  $("#nameyourspace").submit(function(e) {
    e.preventDefault();
    window.location.href = "canvas/"+$("#spaceid").val().toString();
  });
});
