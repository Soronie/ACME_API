// Hard-coded truth value displayed after 10 seconds
const hard_truth = 'The future is ours to decide!';

// Save data before refreshing
window.onbeforeunload = function() {
    localStorage.setItem('wall', document.body.innerHTML);
}

// Either begin a fresh round of the app
// or access a previous one
window.onload = function() {
    var wall = localStorage.getItem('wall');
    if (wall != null)
        document.body.innerHTML = wall;
}

// On close, remove the selected window
// and adjust the truth window size
$(document).on('click', '.truth', function () {
    this.parentNode.remove();
    changeTruthWindow(document.getElementById('truth_wall').childElementCount-1,
        document.getElementById('truth_window'));
});

// Generate a random color for a new window
function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

// Change truth window container size depending on
// the number of bricks in the current row
function changeTruthWindow(children, tw) {
    var percentage = 100*(4-(children % 4))/4;
    if(percentage == 0)
        percentage = 100;
    tw.style.width = percentage + '%';
    console.log(children);
}

// Create close button (Bootstrap)
function makeCloseButton() {
    var close_button = document.createElement('button');
    var span = document.createElement('span');
    close_button.className = 'truth';
    close_button.setAttribute('aria-label', 'Close');
    close_button.style.float = 'right';
    close_button.style.height = '30px';
    span.setAttribute('aria-hidden', true);
    span.innerHTML = '&times;';
    close_button.appendChild(span);
    return close_button;
}

// Truth button was pressed: Initiate GET request and timer
function newTruth(queried) {
    var truth = '';

    // If querying, start 10 second timer
    if(queried)
    {
        // Make a hard-coded truth if the timer is up
        setTimeout(function() {
            if(!truth)
                makeNewWindow(hard_truth);
        }, 10000);
    }

    // GET request. If data is obtained, form the message
    $.getJSON('http://api.acme.international/fortune', function(data) {
        // Form message obtained from GET request
        for (var i = 0; i < data.fortune.length; i++)
            truth += data.fortune[i] + '\n';

        // Only make the new window from the original function call
        if(queried)
            makeNewWindow(truth);

    }).fail(function(){
        // If the request fails, recurse until a valid truth is found
        // or 10 seconds are up.
        truth = newTruth(false);
    });

    return truth;
}

// Produce the truth window. Contains message and close button
function makeNewWindow(message) {
        // Create a new container that contains the truth message
        // then add onto HTML page
        var parent = document.getElementById('truth_wall');
        var newWindow = document.createElement('div');
        var truth_window = document.getElementById('truth_window');
        
        // Place text within a new container
        // Create the close button
        var newText = document.createElement('div');
        var close_button = makeCloseButton();

        // Set a default text size and center the contained message
        newText.style.fontSize = '20px';
        newText.style.margin = 'auto';
        newText.style.marginLeft = '25px';
        newText.innerHTML = message;

        // Create the truth window
        newWindow.style.display = 'inline-flex';
        newWindow.style.verticalAlign = 'top';
        newWindow.style.width = parent.offsetWidth/4 + 'px';
        newWindow.style.height = '200px';
        newWindow.style.backgroundColor = randomColor();
        newWindow.appendChild(newText);
        newWindow.appendChild(close_button);

        // Append the new brick to the truth wall
        truth_window.remove();
        parent.appendChild(newWindow);
        parent.appendChild(truth_window);
        changeTruthWindow(parent.childElementCount-1, truth_window);

        // If the text overflows the truth window, adjust the size
        while(newText.offsetHeight > newWindow.offsetHeight)
            newText.style.fontSize = 'smaller';
}