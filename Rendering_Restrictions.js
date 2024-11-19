const api_key = "YOUR_API_KEY";

var coordinate = L.latLng(49.012, 8.4044); 
var map = L.map('map', {
  fullscreenControl: true
}).setView(coordinate, 17);

var vectorStyleUrl = "https://vectormaps-resources.myptv.com/styles/latest/standard.json";

//Lazy load the plugin to support right-to-left languages such as Arabic and Hebrew.
maplibregl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true 
);

var vectorLayer = L.maplibreGL({
  attribution: '&copy; ' + new Date().getFullYear() + ' PTV Logistics, HERE',
  interactive:false,
  maxZoom: 18,
  style: vectorStyleUrl,
  transformRequest: (url) => {
    let transformedUrl = url;
    let mapsPathIndex = url.indexOf('/maps/');

    if (mapsPathIndex > 0) {
      transformedUrl = 'https://api.myptv.com/' + url.substring(mapsPathIndex) + '?apiKey=' + api_key;
      return {
        url: `${transformedUrl}`
      };
    } 
    return null;
  }
}).addTo(map);

map.createPane('clickableTiles');
map.getPane('clickableTiles').style.zIndex = 500;
var rasterTileUrl = "https://api.myptv.com/rastermaps/v1/data-tiles/{z}/{x}/{y}";
var restrictionsLayer = L.tileLayer.ptvDeveloper(
    rasterTileUrl + '?layers={layers}&apiKey=' + api_key, {
    layers: 'restrictions',
    maxZoom: 18,
    opacity: 0.5,
    pane: 'clickableTiles'
  }).addTo(map);

var layers = {
    "Vector Base Map":  vectorLayer,
    "Restrictions": restrictionsLayer,
  
};
L.control.layers({}, layers, {
    position: 'bottomleft',
    autoZIndex: false
}).addTo(map);