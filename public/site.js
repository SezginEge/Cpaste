const uri = "/new";

function create() {
    var method = "POST";
    var data = {
        text: document.getElementById("data").value
    };

    var request = new XMLHttpRequest();

    request.onload = function () {
        var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        var data = JSON.parse(request.responseText); // Returned data, e.g., an HTML document.

        if (status == 200) {
            window.location.href = "/" + data.id;
        }
    }

    request.open(method, uri);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.send(JSON.stringify(data));
}

function copy() {
    var copyTextarea = document.getElementById('data');
    copyTextarea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
}