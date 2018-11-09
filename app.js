$(document).ready(function() {
    $("button").on("click", function(event) {
        $.get("notes/5be389d642ba5b0720419c17", function(data, status) {
            $("h2").html(data.title);
            $("p").html(data.text);
        });
    });
});