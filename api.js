const hard_truth = 'The future is ours to decide!';

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

function changeTruthWindow(children, tw) {
    if(children % 2 == 0)
        tw.style.width = '50%';
    else
        tw.style.width = '100%';
}

function makeCloseButton() {
    var close_button = document.createElement('button');
    var span = document.createElement('span');
    close_button.className = 'truth';
    close_button.setAttribute('aria-label', 'Close');
    close_button.style.height = '20px';
    span.setAttribute('aria-hidden', true);
    span.innerHTML = '&times;';
    close_button.appendChild(span);
    return close_button;
}

function newTruth(queried) {
    var truth = '';

    // If querying, start 10 second timer
    if(queried)
    {
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

        // Only make the window within original function call
        if(queried)
            makeNewWindow(truth);

    }).fail(function(){
        // If the request fails, recurse until a valid truth is found
        // or 10 seconds are up.
        truth = newTruth(false);
    });

    return truth;
}

function makeNewWindow(message) {
        // Create a new container that contains the truth message
        // then add onto HTML page
        var parent = document.getElementById('truth_wall');
        var newWindow = document.createElement('div');
        var truth_window = document.getElementById('truth_window');
        
        // Place text within a new container
        // then append to new window
        var newText = document.createElement('div');
        var close_button = makeCloseButton();
        newWindow.appendChild(close_button);
        close_button.onclick = function() {
            this.parentNode.remove();
            changeTruthWindow(parent.childElementCount-1, truth_window);
        }
        newText.innerHTML = message;
        newWindow.appendChild(newText);
        newWindow.style.width = parent.offsetWidth * 0.5 + 'px';
        newWindow.style.height = '200px';
        newWindow.style.backgroundColor = randomColor();

        // For an even number of bricks, align to the right
        if(parent.childElementCount % 2 == 0)
            newWindow.style.float = 'left';
        // For an odd number, align to the left
        else
            newWindow.style.float = 'right';

        truth_window.remove();
        parent.appendChild(newWindow);
        parent.appendChild(truth_window);
        changeTruthWindow(parent.childElementCount-1, truth_window);
}