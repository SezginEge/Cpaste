const uri = "/new";

function create() {
    var method = "POST";
    var data = {
        text: document.getElementById("data").value
    };

    var request = new XMLHttpRequest();

    request.onload = function () {
        var status = request.status; 
        var data = JSON.parse(request.responseText);

        if (status == 200) {
            window.location.href = "/" + data.id;
        }
    }

    request.open(method, uri);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader("UA-Platform",navigator.userAgent + ":" + navigator.platform);
    request.setRequestHeader("Type","Browser");

    request.send(JSON.stringify(data));
}

function initClipboard(){
    var clipboard = new Clipboard('#copy');

    clipboard.on('success', function(e) {
        var copyBtn = document.getElementById("copy");
        copyBtn.innerText = "Copied";    
        copyBtn.classList.remove("btn-default");
        copyBtn.classList.add("btn-success");
        setTimeout(function () {
            copyBtn.innerHTML = "Copy <i class='fa fa-clone'></i>"
            copyBtn.classList.remove("btn-success");
            copyBtn.classList.add("btn-default");
        }, 3000);
        e.clearSelection();
    });
}