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
    zoom: 2,
    layers: [satelliteMap, earthquakes, tectonicPlates]
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
        return magnitude * 3
    }

    // Function to Set Color of Marker Based on Magnitude
    function chooseColor(magnitude) {

        switch (true) {
        case magnitude > 5:
            return "#FF0000";
        case magnitude > 4:
            return "#FF6347";
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

    // Add Earthquakes Layer to Map
    earthquakes.addTo(myMap);

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

    // // Set Up Legend
    // var legend = L.control({ position: "bottomright" });

    // legend.onAdd = function () {
    //     var div = L.DomUtil.create("div", "info legend");
    //     var limits = geojson.options.limits;
    //     var colors = geojson.options.colors;
    //     var labels = [];

    //     // Add min & max
    //     var legendInfo = "<h1>Median Income</h1>" +
    //         "<div class=\"labels\">" +
    //         "<div class=\"min\">" + limits[0] + "</div>" +
    //         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //         "</div>";

    //     div.innerHTML = legendInfo;

    //     limits.forEach(function (limit, index) {
    //         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //     });

    //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //     return div;
    // };

    // // Adding legend to the map
    // legend.addTo(myMap);
});