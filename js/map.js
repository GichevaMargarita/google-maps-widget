//(function() {
const key = 'AIzaSyDbBy_hv2LohX6fsE5L-SBFNJEyKvFoxH8';
let polygons = [];

(function () {
    const script_tag = document.createElement('script');
    script_tag.setAttribute('src',`https://maps.googleapis.com/maps/api/js?key=${key}&signed_in=true&libraries=drawing&callback=initMap`);
    (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
})();

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 53.902, lng: 27.562},
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true
    });
    getCurrentLocation(map);

     const controlDiv = document.createElement('div');
     controlDiv.className += 'controlDiv';
     const drawingManager = drawControl(controlDiv, map);
     dragControl(controlDiv, drawingManager);
    removeControl(controlDiv);
    exportControl(controlDiv);
    importControl(controlDiv, map);

     map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
}

function found(op){
    console.log(op.latitude);
}

function getCurrentLocation(map) {
    const infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('My location ' + pos.lat.toFixed(2) + ' ' + pos.lng.toFixed(2));
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    function drawControl(controlDiv, map) {

    const controlUI = document.createElement('div');
    controlUI.setAttribute('class','controlUI');
    controlUI.setAttribute('id', 'draw');
    controlUI.setAttribute('title', 'Draw Polygon');
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('span');
    controlText.className += 'lnr lnr-pencil';
    controlUI.appendChild(controlText);

    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
    });

    controlUI.addEventListener('click', function() {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);       
    });


    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        polygons.push(polygon);
        console.log(polygon.getPath().getArray().map(item => ({
            lat: item.lat(),
            lng: item.lng(),
        })));
    });
    return drawingManager;
}


function dragControl(controlDiv, drawingManager) {
    const controlUI = document.createElement('div');
    controlUI.setAttribute('class','controlUI');
    controlUI.setAttribute('id', 'drag');
    controlUI.setAttribute('title', 'Drag Map');
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('span');
    controlText.className += 'lnr lnr-hand';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        drawingManager.setDrawingMode(null);       
    });
}


function removeControl(controlDiv) {

    const controlUI = document.createElement('div');
    controlUI.setAttribute('class','controlUI');
    controlUI.setAttribute('id', 'remove');
    controlUI.setAttribute('title', 'Clear All Polygons from Map');
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('span');
    controlText.className += 'lnr lnr-trash';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        polygons.forEach(item => {
            item.setMap(null);
        });
        polygons = [];
    });
}
function exportControl(controlDiv) {

    const controlUI = document.createElement('div');
    controlUI.setAttribute('class','controlUI');
    controlUI.setAttribute('id', 'export');
    controlUI.setAttribute('title', 'Export coordinates to HTML');
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('span');
    controlText.className += 'lnr lnr-exit-up';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        let arr = polygons.map(polygon => polygon.getPath().getArray().map(item => ({
            lat: item.lat(),
            lng: item.lng(),
        })));
        window.opener.document.getElementById('polygons').innerHTML = JSON.stringify(arr);
        console.log(arr);
    });
}
function importControl(controlDiv, map) {

    const controlUI = document.createElement('div');
    controlUI.setAttribute('class','controlUI');
    controlUI.setAttribute('id', 'import');
    controlUI.setAttribute('title', 'Import coordinates from HTML');
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('span');
    controlText.className += 'lnr lnr-enter-down';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        const data = JSON.parse(window.opener.document.getElementById('polygons').innerHTML);
        if (data) {
            data.forEach(polygon => {
                const pol = new google.maps.Polygon({
                    paths: polygon
                });
                pol.setMap(map)
                polygons.push(pol);
            });
        }        
    });
}




//})();