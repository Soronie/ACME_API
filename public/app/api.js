function changeTruthWindow(children, tw) {
    if(children % 2 == 0)
        tw.style.width = '50%';
    else
        tw.style.width = '100%';
}

function makeCloseButton() {
    var close_button = document.createElement('button');
    var span = document.createElement('span');
    //close_button.type = 'button';
    close_button.className = 'truth';
    close_button.setAttribute('aria-label', 'Close');
    close_button.style.height = '20px';
    span.setAttribute('aria-hidden', true);
    span.innerHTML = '&times;';
    close_button.appendChild(span);
    return close_button;
}

function newTruth() {
    $.getJSON('http://api.acme.international/fortune', function(data) {
        // Form message obtained from GET request
        var message = ''
        for (var i = 0; i < data.fortune.length; i++)
            message += data.fortune[i] + '\n';

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
        newWindow.style.backgroundColor = 'maroon';

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
    }).fail(function(){
            // If the request fails, re-attempt
            newTruth();
    });
}