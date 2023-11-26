/* * * * * * * * * * * * * *
*          NYMap           *
* * * * * * * * * * * * * */

class NYMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, displayData, mapCenter) {
        this.parentElement = parentElement;
        this.displayData = displayData;
        this.mapCenter = mapCenter;

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        // Specify the path to the Leaflet images
        L.Icon.Default.imagePath = 'img/';

        // Define the map and set its center and zoom level
        vis.map = L.map(vis.parentElement).setView(vis.mapCenter, 13);

        // Load and display a tile layer on the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap'
        }).addTo(vis.map);

        // Create a LayerGroup to hold the station markers
        vis.stationLayer = L.layerGroup().addTo(vis.map);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // No data wrangling/filtering needed

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Clear the existing markers from the LayerGroup
        vis.stationLayer.clearLayers();

        // Create an array of locations referenced
        // note: coordinates from latlong.net
        let locations = [];
        locations.push(L.marker([40.747991, -74.004765])
            .bindPopup("The Highline (Cardigan)"));
        locations.push(L.marker([40.5755, -73.9700])
            .bindPopup("Coney Island (Evermore)"));
        locations.push(L.marker([40.7328, -74.0020])
            .bindPopup("Cornelia Street (Cornelia Street)"));
        locations.push(L.circle([40.7265, -73.9840], 500, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5
            })
            .bindPopup("Dive bar on the east side (Delicate)"));
        locations.push(L.marker([40.7486, -73.9857])
            .bindPopup("Madison Square (The Lucky One)"));
        locations.push(L.circle([40.7505, -73.9934], 500, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5
            })
            .bindPopup("Garden (Cruel Summer)"));
        locations.push(L.circle([40.7128, -74.0060], 500, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5
            })
            .bindPopup("Office downtown (You Are In Love)"));
        locations.push(L.polygon([
                [42.837020, -75.397810],
                [42.881160, -73.731130],
                [44.986840, -73.448110],
                [45.0180, -74.7286]],
            {
                color: "blue",
                fillOpacity: 0.5,
                weight: 3
                })
            .bindPopup("Upstate (All Too Well)"));

        // Add each location referenced to map
        locations.forEach(object => {
            object.addTo(vis.map);
        })
    }
}