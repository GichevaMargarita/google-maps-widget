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
    addDrawInstruments(map);
    addClearElement();

    const controlDiv = document.createElement('div');
    controlDiv.className += 'remove-btn';
    addClearElement(controlDiv);
    const centerControl = new CenterControl(controlDiv, map);

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
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

function addDrawInstruments(map) {
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
            style: google.maps.ZoomControlStyle.SMALL,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        polygons.push(polygon);
        console.log(polygon.getPath().getArray().map(item => ({
            lat: item.lat(),
            lng: item.lng(),
        })));
    });
}

function addClearElement(controlsDiv) {
    const clearElement = document.createElement('div');
    clearElement.getAttribute('id','clearElement');

}

function CenterControl(controlDiv) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('span');
    controlText.className += 'lnr lnr-trash';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        polygons.forEach(item => {
            item.setMap(null);
        });
        polygons = [];
    });

}



//})();