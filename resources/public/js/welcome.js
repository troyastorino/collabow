$(document).ready(function () {
  $("#start").submit(function(e) {
    e.preventDefault();
    window.location.href = "canvas/"+$("#space-id").val().toString();
  });
});
