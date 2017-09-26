const hard_truth = 'The future is ours to decide!';

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

function changeTruthWindow(children, tw) {
    var percentage = 100*(4-(children % 4))/4;
    if(percentage == 0)
        percentage = 100;
    tw.style.width = percentage + '%';
}

function makeCloseButton() {
    var close_button = document.createElement('button');
    var span = document.createElement('span');
    close_button.className = 'close';
    close_button.setAttribute('aria-label', 'Close');
    close_button.style.float = 'right';
    close_button.style.height = '30px';
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
        var newText = document.createElement('span');
        var close_button = makeCloseButton();
        newWindow.style.display = 'inline-flex';
        newWindow.style.verticalAlign = 'top';
        newWindow.style.width = parent.offsetWidth/4 + 'px';
        newWindow.style.height = '200px';
        newWindow.style.backgroundColor = randomColor();
        newText.innerHTML = message;
        newText.style.fontSize = '20px';
        newText.style.margin = 'auto';
        newText.style.marginLeft = '25px';
        newWindow.appendChild(newText);
        newWindow.appendChild(close_button);
        close_button.onclick = function() {
            this.parentNode.remove();
            changeTruthWindow(parent.childElementCount-2, truth_window);
        }

        truth_window.remove();
        parent.appendChild(newWindow);
        parent.appendChild(truth_window);
        changeTruthWindow(parent.childElementCount-2, truth_window);

        while(newText.offsetHeight > newWindow.offsetHeight)
            newText.style.fontSize = 'smaller';
}