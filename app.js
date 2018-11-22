$(document).ready(function() {
    var selectedCard = null;

    function clickCard() {
        selectedCard = $(this).parent();
        console.log(selectedCard);
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

    function prependNew(card) {
        $('.cardRow').prepend(card);
    }

    for (let i = 1; i <= 8; i++) {
        let button = $("#color0").clone();
        button.attr("id", "color" + i);
        $("#colorGroup").append(button);
    }

    // Load all notes
    $.get("notes/", function(notes) {
        var card = $(".d-none").clone();
        card.removeClass("d-none");

        $.each(notes, function(i, note) {
            card.find(".card-body").on('click', clickCard);
            card.find(".card-title").html(note.title);
            card.find(".card-text").html(note.body);
            card.find(".card-body").css("background-color", note.color);
            card.find(".card").attr("id", note._id);
            $('.cardRow').prepend(card);
            card = card.clone();
        });
    });

    // Click new note
    $("#newNoteBtn").on("click", function() {
        const colorBtns = $("#colorGroup .btn");
        const initialBtn = colorBtns.first();
        const initialColor = initialBtn.css("background-color");
        
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
            const newCard = $(".d-none").clone();
            newCard.find(".card-body").on('click', clickCard);
            newCard.find(".card-title").html(data.title); // Select invisible card
            newCard.find(".card-text").html(data.body);
            newCard.find(".card-body").css("background-color", data.color);
            newCard.find(".card").attr("id", data._id);
            newCard.removeClass("d-none"); // Make new card visible
        
            prependNew(newCard);
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
                    selectedCard.parent().remove();
                }
            });
        }
    });
    
    // Click color button
    $("input[type=radio][name=colors]").change(function() {
        var selectedColor = $(this).parent().css('border-color');
        
        if ($(this).parent().attr("id") == "color0") {
            selectedColor = "#FFF";
        }
        console.log(selectedColor);
        $('.modal-header, .modal-body').css('background-color', selectedColor);
    });
});