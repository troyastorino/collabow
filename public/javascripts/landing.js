var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

$(function() {
  $("#email_input").submit(function() {
    var email = $("#textbox").val();
    if (validateEmail(email)) {
      $.post("/email", {email: $("#textbox").val()}, function(data) {
        if (data === "saved") {
          $("#prompt").html("<h3>Thanks for your interest! We'll keep you updated on our progress.</h3>");
        } else {
          $("#prompt").html("<h3>We're sorry, but there was some error saving your email to our database.  Please try again at some later time.</h3>");
        }  
      });  
    } else {
      $("#textbox").addClass("error");
      $("#textinput").append("<p class='error-msg'>Sorry, that's an invalid email. Try again.</p>");
    }
    return false;
  });
  $("#email_input").keypress(function() {
    $(".error-msg").remove();
    $("#textbox").removeClass("error");
  });
});
