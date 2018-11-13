$(document).ready(function() {
    var selectedCard = null;

    function clickCard() {
        selectedCard = $(this);

        $("#createBtn").hide();
        $("#saveBtn").show();
        $("#deleteBtn").show();

        const cardTitle = $(this).find(".card-title").html();
        const cardText = $(this).find(".card-text").html();
    
        $("#titleInput").val(cardTitle);
        $("#textInput").val(cardText);
    };

    function appendNewCard() {
        $.get('noteInvisible.html', function(data){
            $('.cardRow').append(data); // Append invisible card
            //$(data).addClass("d-none");
            $(data).on('click', clickCard);
        });
    }

    $.get("notes/", function(notes) {
        $.get('noteVisible.html', function(data){
            var card = $(data);
            
            $.each(notes, function(i, note) {
                card.on('click', clickCard);
                card.find(".card-title").html(note.title);
                card.find(".card-text").html(note.body);
                card.attr("id", note._id);
                $('.cardRow').append(card);
                card = card.clone();
            });
            appendNewCard();
        });
    });

    $("#newNoteBtn").on("click", function() {
        $("#createBtn").show();
        $("#saveBtn").hide();
        $("#deleteBtn").hide();

        $("#titleInput").val("");
        $("#textInput").val("");
    });

    $("#createBtn").on("click", function(event) {
        const noteTitle = $("#titleInput").val();
        const noteBody = $("#textInput").val();

        $.post("notes/", {title: noteTitle, body: noteBody}, function(data) {
            console.log(data);
            const createdCard = $(".card.d-none");
            createdCard.find(".card-title").html(data.title); // Select invisible card
            createdCard.find(".card-text").html(data.body);
            createdCard.attr("id", data._id);
            createdCard.removeClass("d-none"); // Make new card visible
        
            appendNewCard();
        });
    });

    $("#saveBtn").on("click", function() {
        if (selectedCard != null) {
            const id = selectedCard.attr("id");
            const modalTitle = $("#titleInput").val();
            const modalBody = $("#textInput").val();

            $.ajax({
                url: "notes/" + id,
                type: 'PUT',
                data: {title: modalTitle, body: modalBody},
                success: function(data) {
                    console.log(data);
                    selectedCard.find(".card-title").html(data.title);
                    selectedCard.find(".card-text").html(data.body);
                }
             });
        }
    });

    $("#deleteBtn").on("click", function() {
        if (selectedCard != null) {
            const id = selectedCard.attr("id");
            $.ajax({
                url: "notes/" + id,
                type: 'DELETE',
                success: function(data) {
                    console.log(data);
                    selectedCard.remove();
                }
            });
        }
    });
    // $(".btn-save").on("click", function() {
    //     const noteTitle = $("input").val();
    //     const noteBody = $("textarea").val();
    //     $.post("notes/", {title: noteTitle, body: noteBody}, function(data) {
    //         console.log(data);
    //     });
    // });
});