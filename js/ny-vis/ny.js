/* * * * * * * * * * * * * *
*          NYMap           *
* * * * * * * * * * * * * */

class NYMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, lyricsData, mapCenter) {
        this.parentElement = parentElement;
        this.lyricsData = lyricsData;
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
     * Update lyrics based on selected location
     */
    updateLyrics(clickedLocation) {
        let vis = this;

        // Find the location name based on the clicked location
        const locationName = vis.findLocationName(clickedLocation);

        // Find the lyrics data for the clicked location name
        const selectedLyric = vis.lyricsData.find(entry => entry.location === locationName);

        // Update the content of ny-lyrics div
        const lyricsDiv = document.getElementById('ny-lyrics');
        if (selectedLyric) {
            lyricsDiv.innerHTML = `<h3>${selectedLyric.song}</h3><p>${selectedLyric.lyric}</p>`;
        } else {
            lyricsDiv.innerHTML = '<p>No lyrics available for this location.</p>';
        }
    }

    /*
     * Find location name based on clicked location (helper function)
     */
    findLocationName(clickedLocation) {
        let vis = this;

        // console.log(clickedLocation);

        // Loop through locations and find the closest based on distance
        const closestLocation = vis.locationData.reduce((closest, current) => {
            const closestDistance = clickedLocation.distanceTo(closest.latlng);
            const currentDistance = clickedLocation.distanceTo(current.latlng);
            return currentDistance < closestDistance ? current : closest;
        }, vis.locationData[0]); // Assume the first entry as the initial closest

        return closestLocation.name;
    }

    /*
     * Event handler for location click
     */
    locationClickHandler(location) {
        let vis = this;

        // Find the clicked location in the locationData
        const clickedLocation = vis.locationData.find(entry => entry.name === location);

        // Update lyrics based on the selected location
        vis.updateLyrics(clickedLocation ? L.latLng(clickedLocation.latlng) : null);
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

        // // Create an array of locations referenced
        // // note: coordinates from latlong.net
        let locations = [];
        // locations.push(L.marker([40.747991, -74.004765])
        //     .bindPopup("The High Line (Cardigan)"));
        // locations.push(L.marker([40.5755, -73.9700])
        //     .bindPopup("Coney Island (Coney Island)"));
        // locations.push(L.marker([40.7328, -74.0020])
        //     .bindPopup("Cornelia Street (Cornelia Street)"));
        locations.push(L.circle([40.7265, -73.9840], 500, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5
            })
            .bindPopup("Dive bar on the East Side (Delicate)"));
        // locations.push(L.marker([40.7486, -73.9857])
        //     .bindPopup("Madison Square (The Lucky One)"));
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

        vis.locationData = [];

        // Create an array of locations referenced
        // note: coordinates from latlong.net
        vis.locationData.push({ name: "The High Line", latlng: [40.747991, -74.004765] });
        vis.locationData.push({ name: "Coney Island", latlng: [40.5755, -73.9700] });
        vis.locationData.push({ name: "Cornelia Street", latlng: [40.7328, -74.0020]});
        vis.locationData.push({ name: "Dive bar on the East Side", latlng: [40.7265, -73.9840]});
        vis.locationData.push({ name: "Madison Square", latlng: [40.7486, -73.9857]});
        vis.locationData.push({ name: "Garden", latlng: [40.7505, -73.9934]});
        vis.locationData.push({ name: "Office downtown", latlng: [40.7128, -74.0060]});
        vis.locationData.push({ name: "Upstate", latlng: [42.881160, -73.731130]});

        // Add each location referenced to map
        vis.locationData.forEach(object => {
            const marker = L.marker(object.latlng).bindPopup(object.name);
            marker.addTo(vis.map);
            marker.on('click', function (event) {
                vis.locationClickHandler(object.name);
            });
        });

        // Set up event listener for map clicks
        vis.map.on('click', function (event) {
            // Check if the click is not on a marker or polygon
            if (!event.layer) {
                const clickedLocation = event.latlng;
                vis.locationClickHandler(clickedLocation);
            }
        });
    }
}