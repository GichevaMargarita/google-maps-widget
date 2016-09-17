
document.getElementById('map-link').onclick = (e) => {
    e.preventDefault();
    const map = window.open('http://localhost:63342/', '', 'height=300, width=700, top=300, left=300, scrollbars=1');
    map.document.write('<title>Add polygons on Google Map Widget</title>');
    map.document.write('<link rel="stylesheet" type="text/css" href="css/style.css">');
    map.document.write('<div id="map"></div>');
    map.document.write('<script src ="js/map.js"></script>');
    map.document.write('<link rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css">');
};