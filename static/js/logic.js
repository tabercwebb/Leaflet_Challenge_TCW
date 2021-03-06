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
    center: [39.82, -98.57],
    zoom: 3,
    layers: [satelliteMap, tectonicPlates, earthquakes]
});

// Create a Layer Control & Pass in the BaseMaps & OverlayMaps & Add Layer Control to Map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Grab Earthquake Data with D3
d3.json(earthquakeURL, function(earthquakeData) {

    // Function to Set Size of Marker Based on Magnitude
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4
    }

    // Function to Set Color of Marker Based on Magnitude
    function chooseColor(magnitude) {

        switch (true) {
        case magnitude > 5:
            return "#FF0000";
        case magnitude > 4:
            return "#FF4500";
        case magnitude > 3:
            return "#FFA500";
        case magnitude > 2:
            return "#FFD700";
        case magnitude > 1:
            return "#FFFF00";
        default:
            return "#ADFF2F";
        }
    }

    // Function to Set Style of Marker
    function styleInfo (feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Create a GeoJSON Layer
    L.geoJSON(earthquakeData, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleInfo,

        // Binding a Pop-Up to Each Layer
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + "</h4>" + 
            "<hr><p>Date & Time: " + new Date(feature.properties.time) + "</p>" + 
            "<p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(earthquakes);

    // Grab Tectonic Plate Data with D3
    d3.json(tectonicPlatesURL, function(tectonicPlateData) {

        // Create a GeoJSON Layer
        L.geoJSON(tectonicPlateData, {

            color: "#3333ff",
            weight: 2
        }).addTo(tectonicPlates);

        // Add Tectonic Plate Layer to Map
        tectonicPlates.addTo(myMap);
    });

    // Add Earthquakes Layer to Map
    earthquakes.addTo(myMap);
    
    // Set Up Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var magnitudeRanges = [0, 1, 2, 3, 4, 5];
        var labels = [];

        div.innerHTML += "<h2>Magnitude</h2>";

        // Loop Through Magnitude Intervals & Generate a Label with a Colored Square for Each Interval
        for (var i = 0; i < magnitudeRanges.length; i++) {

            div.innerHTML +=
                '<i style="background:' + chooseColor(magnitudeRanges[i] + 1) + '"></i> ' +
                magnitudeRanges[i] + (magnitudeRanges[i + 1] ? '&ndash;' + magnitudeRanges[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add Legend to Map
    legend.addTo(myMap);
});