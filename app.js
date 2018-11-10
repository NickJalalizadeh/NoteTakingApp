$(document).ready(function() {
    var selectedCard = null;

    clickCard = function() {
        console.log("selected a card");
        selectedCard = this;
        const cardTitle = $(this).find(".card-title").html();
        const cardText = $(this).find(".card-text").html();
    
        $("#titleInput").val(cardTitle);
        $("#textInput").val(cardText);
    };

    $(".card.d-none").on('click', clickCard);

    $("#modalBtn").on("click", function() {
        $("#titleInput").val("");
        $("#textInput").val("");
    });

    $("#createBtn").on("click", function(event) {
        const noteTitle = $("#titleInput").val();
        const noteText = $("#textInput").val();
        
        $(".card.d-none .card-title").html(noteTitle); // Select invisible card
        $(".card.d-none .card-text").html(noteText);
        $(".card.d-none").removeClass("d-none"); // Make new card visible

        $.get('noteTemplate.html', function(data){
            $('.row').append(data); // Append invisible card
            $(".card.d-none").on('click', clickCard);
        });
    });

    $("#saveBtn").on("click", function() {
        if (selectedCard != null) {
            const modalTitle = $("#titleInput").val();
            const modalText = $("#textInput").val();

            $(selectedCard).find(".card-title").html(modalTitle);
            $(selectedCard).find(".card-text").html(modalText);
        }
    });

    $("#deleteBtn").on("click", function() {
        console.log(selectedCard);
        //console.log($(selectedCard).find(".card-title").html());
        $(selectedCard).parent().remove();
    });
    // $(".btn-save").on("click", function() {
    //     const noteTitle = $("input").val();
    //     const noteBody = $("textarea").val();
    //     $.post("notes/", {title: noteTitle, body: noteBody}, function(data) {
    //         console.log(data);
    //     });
    // });
});