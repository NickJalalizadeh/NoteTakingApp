$(document).ready(function() {
    $("#createBtn").on("click", function(event) {
        const noteTitle = $("#titleInput").val();
        const noteText = $("#textInput").val();
        
        $(".d-none .card-title").html(noteTitle); // Select invisible card
        $(".d-none .card-text").html(noteText);
        $(".d-none").removeClass("d-none"); // Make new card visible

        $.get('noteTemplate.html', function(data){
            $('.row').append(data);
        });
    });

    $(".btn-save").on("click", function() {
        const noteTitle = $("input").val();
        const noteBody = $("textarea").val();
        $.post("notes/", {title: noteTitle, body: noteBody}, function(data) {
            console.log(data);
        });
    });
});