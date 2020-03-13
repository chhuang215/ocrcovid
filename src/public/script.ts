
var socket = io.connect('http://localhost:3000');

function getUpdateTimeManually(){
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        document.getElementById('updateTime').innerText = 
            "Last updated: " + new Date(JSON.parse(xmlHttp.responseText)['time']).toLocaleTimeString('en-us');
        }
    }
    xmlHttp.open("GET", 'http://localhost:3000/getupdatetime', true); // true for asynchronous 
    xmlHttp.send();
}

function reload(){

    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById('loading').innerHTML="";
    document.getElementById('loading').setAttribute('class', '');
    
    // document.getElementById('ccase').innerHTML = data;
    
    document.getElementById('ccaseimg').setAttribute('src', 'ccase.png');
    document.getElementById('dcaseimg').setAttribute('src', 'dcase.png');
}

socket.on('updateDataClient', function (updateTime) {
    reload();
    document.getElementById('updateTime').innerText = 
        "Last updated: " + new Date(JSON.parse(updateTime)).toLocaleTimeString('en-us');
});


socket.on('counter', function (count) {
    if (count > 0){
        
        var countFormat = 
            Math.floor(count / 3600) + ":" + 
            ('0' +  Math.floor(count % 3600 / 60)).slice(-2)  + ":" + 
            ('0' + Math.floor(count % 3600 % 60)).slice(-2);

        document.getElementById('counter').innerText = countFormat;
    }
    else{
        document.getElementById('counter').innerHTML = '<div class="lds-dual-ring"></div>';
    }
});

document.addEventListener("DOMContentLoaded", function(){
    getUpdateTimeManually();
    reload();
});
