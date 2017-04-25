$(function()
{

    $("#editableColor").click(function() {
        // If there is no color input on the page, create and add one
        //add a new input
        if ($('#newcolor').length == 0) {
            addInput($(this));
        }
    });

    // Add listener for escape key. Remove input and reset instructions
    $('body').keyup(function (event) {
        //27 ascii for escape button
        if (event.which == 27)
        {
            removeInput();
        }
    });
});

// Add an input text field, after the color span.
// Add instructions, and event handler for Enter key.
//ajax handles all request in callbacks
function addInput(element) {
    var input = '<input id="newcolor" placeholder="New color"/>';
    element.append(input);
    $('#instructions').text('Press Enter to save, Esc to quit');

    $('#newcolor').keypress(function (event)
    {   // 13 ascii for enter
        if (event.which == 13)
        {
            var color = $(this).val();
            var name = $('#name').text();
            var data = { "color": color, "name": name };

            $.ajax({method:"PUT",
                data:data,
                url:'/updateColor'}) //tell server which URL to goto
                .done(function(result){
                    $('#editableColor').text(result.color);
                    removeInput();
                })
                .fail(function(err){
                    console.log(err);
                    removeInput();
                })
        }
    });
}

function removeInput(){
    $('#instructions').text(' (click color to edit)');
    $('#newcolor').remove();
}
