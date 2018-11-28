$(document).ready(function() {
    $(controller).ready(function() {

        initialize();

        // Click add note
        $("#newNoteBtn").on("click", clickAddNote);
    
        // Click create
        $("#createBtn").on("click", createNote);
    
        // Click save
        $("#saveBtn").on("click", saveNote);
    
        // Click delete
        $("#deleteBtn").on("click", deleteNote);
        
        // Click a color
        $("input[type=radio][name=colors]").change(colorChange);

   });
});