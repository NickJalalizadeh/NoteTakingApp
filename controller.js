
var selectedCard = null;

exports.newNote = function() {
    $("#createBtn").show();
    $("#saveBtn").hide();
    $("#deleteBtn").hide();

    $("#titleInput").val("");
    $("#textInput").val("");
}

function clickCard() {
    console.log("selected a card");
    selectedCard = this;

    $("#createBtn").hide();
    $("#saveBtn").show();
    $("#deleteBtn").show();

    const cardTitle = $(this).find(".card-title").html();
    const cardText = $(this).find(".card-text").html();

    $("#titleInput").val(cardTitle);
    $("#textInput").val(cardText);
};

exports.appendNewCard = function() {
    $.get('noteTemplate.html', function(data){
        $('.cardRow').append(data); // Append invisible card
        $(".card.d-none").on('click', clickCard);
    });
}

exports.create = function() {
    const noteTitle = $("#titleInput").val();
    const noteText = $("#textInput").val();
    
    $(".card.d-none .card-title").html(noteTitle); // Select invisible card
    $(".card.d-none .card-text").html(noteText);
    $(".card.d-none").removeClass("d-none"); // Make new card visible

    appendNewCard();
}

exports.save = function() {
    if (selectedCard != null) {
        const modalTitle = $("#titleInput").val();
        const modalText = $("#textInput").val();

        $(selectedCard).find(".card-title").html(modalTitle);
        $(selectedCard).find(".card-text").html(modalText);
    }
}

exports.delete = function() {
    console.log(selectedCard);
    //console.log($(selectedCard).find(".card-title").html());
    $(selectedCard).parent().remove();
}