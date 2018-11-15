$(document).ready(function() {
    var selectedCard = null;

    function clickCard() {
        selectedCard = $(this);
        const cardTitle = selectedCard.find(".card-title").html();
        const cardText = selectedCard.find(".card-text").html();
        const cardColor = selectedCard.find(".card-body").css("background-color");

        $("#createBtn").hide();
        $("#saveBtn").show();
        $("#deleteBtn").show();
    
        $("#titleInput").val(cardTitle);
        $("#textInput").val(cardText);
        $('.modal-header, .modal-body').css('background-color', cardColor);
        $("#colorGroup .btn").each(function() {
            if ($(this).css("border-color") == cardColor) {
                $(this).addClass("active");
            }
            else {
                $(this).removeClass("active");
            }
        });
    };

    function appendNewCard() {
        $.get('noteInvisible.html', function(data){
            $('.cardRow').append(data); // Append invisible card
            $('.card.d-none').on('click', clickCard);
        });
    }

    // Load all notes
    $.get("notes/", function(notes) {
        $.get('noteVisible.html', function(data){
            var card = $(data);
            
            $.each(notes, function(i, note) {
                card.on('click', clickCard);
                card.find(".card-title").html(note.title);
                card.find(".card-text").html(note.body);
                card.find(".card-body").css("background-color", note.color);
                card.attr("id", note._id);
                $('.cardRow').append(card);
                card = card.clone();
            });
        });
        appendNewCard();
    });

    // Click new note
    $("#newNoteBtn").on("click", function() {
        const colorBtns = $("#colorGroup .btn");
        const initialBtn = colorBtns.first();
        const initialColor = initialBtn.css("border-color");
        
        $("#createBtn").show();
        $("#saveBtn").hide();
        $("#deleteBtn").hide();

        $("#titleInput").val("");
        $("#textInput").val("");
        
        colorBtns.removeClass("active");
        initialBtn.addClass("active");
        $('.modal-header, .modal-body').css('background-color', initialColor);
    });

    // Click create
    $("#createBtn").on("click", function() {
        const modalTitle = $("#titleInput").val();
        const modalBody = $("#textInput").val();
        const modalColor = $(".modal-body").css("background-color");

        $.post("notes/", {title: modalTitle, body: modalBody, color: modalColor}, function(data) {
            console.log(data);
            const createdCard = $(".card.d-none");
            createdCard.find(".card-title").html(data.title); // Select invisible card
            createdCard.find(".card-text").html(data.body);
            createdCard.find(".card-body").css("background-color", data.color);
            createdCard.attr("id", data._id);
            createdCard.removeClass("d-none"); // Make new card visible
        
            appendNewCard();
        });
    });

    // Click save
    $("#saveBtn").on("click", function() {
        if (selectedCard != null) {
            const id = selectedCard.attr("id");
            const modalTitle = $("#titleInput").val();
            const modalBody = $("#textInput").val();
            const modalColor = $(".modal-body").css("background-color");

            $.ajax({
                url: "notes/" + id,
                type: 'PUT',
                data: {title: modalTitle, body: modalBody, color: modalColor},
                success: function(data) {
                    console.log(data);
                    selectedCard.find(".card-title").html(data.title);
                    selectedCard.find(".card-text").html(data.body);
                    selectedCard.find(".card-body").css("background-color", data.color);
                }
             });
        }
    });

    // Click delete
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
    
    $("input[type=radio][name=colors]").change(function() {
        const selectedColor = $(this).parent().css('border-color');
        $('.modal-header, .modal-body').css('background-color', selectedColor);
    });
});