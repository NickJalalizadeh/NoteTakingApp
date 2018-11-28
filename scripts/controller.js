function controller() {

    var selectedCard = null;
        
    initialize = function() {
        // append 7 color buttons to the modal
        for (let i = 1; i <= 7; i++) {
            let button = $("#color0").clone();
            button.attr("id", "color" + i);
            $("#colorGroup").append(button);
        }

        // Load all notes
        $.get("notes/", loadNotes);
    };

    loadNotes = function(notes) {
        var card = $(".d-none").clone();
        card.removeClass("d-none");

        $.each(notes, function(i, note) {
            // Set values of each card loaded from db
            card.find(".card-body").on('click', clickCard);
            card.find(".card-title").html(note.title);
            card.find(".card-text").html(note.body);
            card.find(".card-body").css("background-color", note.color);
            card.find(".card").attr("id", note._id);
            $('.cardRow').prepend(card);
            card = card.clone();
        });
    };

    clickAddNote = function() {
        const colorBtns = $("#colorGroup .btn");
        const initialBtn = colorBtns.first();
        const initialColor = $('.modal-footer').css("background-color");

        // Show only the create button in the modal
        $("#createBtn").show();
        $("#saveBtn").hide();
        $("#deleteBtn").hide();

        // Clear any text in the modal
        $("#titleInput").val("");
        $("#textInput").val("");
        
        // Clear the modal color
        colorBtns.removeClass("active");
        initialBtn.addClass("active");
        $('.modal-header, .modal-body').css('background-color', initialColor);
    };

    createNote = function() {
        const modalTitle = $("#titleInput").val();
        const modalBody = $("#textInput").val();
        const modalColor = $(".modal-body").css("background-color");

        // Make ajax post request
        $.post("notes/", {title: modalTitle, body: modalBody, color: modalColor}, function(data) {
            // Clone existiting invisible card and modify its values
            const newCard = $(".d-none").clone();
            newCard.find(".card-body").on('click', clickCard);
            newCard.find(".card-title").html(data.title);
            newCard.find(".card-text").html(data.body);
            newCard.find(".card-body").css("background-color", data.color);
            newCard.find(".card").attr("id", data._id);

            // Make cloned card visible and prepend it
            newCard.removeClass("d-none");
            $('.cardRow').prepend(newCard);
        });
    };
    
    clickCard = function() {
        // Select the .card object
        selectedCard = $(this).parent();
        const cardTitle = selectedCard.find(".card-title").html();
        const cardText = selectedCard.find(".card-text").html();
        const cardColor = selectedCard.find(".card-body").css("background-color");

        // Show only the save and delete buttons
        $("#createBtn").hide();
        $("#saveBtn").show();
        $("#deleteBtn").show();

        // Set modal text to card text
        $("#titleInput").val(cardTitle);
        $("#textInput").val(cardText);

        // Set modal color to card color, and activate the corresponding button
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

    saveNote = function() {
        if (selectedCard != null) {
            const id = selectedCard.attr("id"); 
            const modalTitle = $("#titleInput").val();
            const modalBody = $("#textInput").val();
            const modalColor = $(".modal-body").css("background-color");

            // Make ajax put request
            $.ajax({
                url: "notes/" + id,
                type: 'PUT',
                data: {title: modalTitle, body: modalBody, color: modalColor},
                success: function(data) {
                    // Modify selected card data
                    selectedCard.find(".card-title").html(data.title);
                    selectedCard.find(".card-text").html(data.body);
                    selectedCard.find(".card-body").css("background-color", data.color);
                }
            });
        }
    };

    deleteNote = function() {
        if (selectedCard != null) {
            const id = selectedCard.attr("id");

            // Make ajax delete request
            $.ajax({
                url: "notes/" + id,
                type: 'DELETE',
                success: function(data) {
                    // Remove card's containing column div
                    selectedCard.parent().remove();
                }
            });
        }
    };

    colorChange = function() {
        const label = $(this).parent();
        var selectedColor = label.css('border-color');
            
        if (label.attr("id") == "color0") {
            selectedColor = "#FFF";
        }
        // Change modal background color based on selected button
        $('.modal-header, .modal-body').css('background-color', selectedColor);
    };
}