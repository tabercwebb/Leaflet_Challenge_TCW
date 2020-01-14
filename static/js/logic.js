// Define GeoJSON URLs
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create the Tile Layers That Will Be the Base Layers of the Map
var satelliteMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var grayscaleMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Create Two Layer Groups, Earthquakes & Tectonic Plates
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Create BaseMaps Object to Hold Base (Tile) Layers
var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
};

// Create OverlayMaps Object to Hold Overlay (LayerGroup) Layers
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": tectonicPlates
};

// Create Map & Pass in SatelliteMap & Earthquakes Layer as Default Layers
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satelliteMap, earthquakes]
});

// Create a Layer Control & Pass in the BaseMaps & OverlayMaps & Add Layer Control to Map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);