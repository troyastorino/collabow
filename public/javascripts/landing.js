$(function() {
  $("#email_input").submit(function() {
    $.post("/email", {email: $("#textbox").val()}, function(data) {
      if (data === "saved") {
        $("#prompt").html("<h3>Thanks for your interest! We'll keep you updated on our progress.</h3>");
      } else {
        $("#prompt").html("<h3>We're sorry, but there was some error saving your email to our database.  Please try again at some later time.</h3>");
      }  
    });
    return false;
  });
});
