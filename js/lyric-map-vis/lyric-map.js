/* * * * * * * * * * * * * *
*         LyricMap         *
* * * * * * * * * * * * * */

/*
*  Helper function for custom Leaflet icons
*/
function createDivIconWithBorder(iconUrl) {
    return L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-with-border"><img src="' + iconUrl + '" width="32" height="32"></div>',
        iconSize: [38, 38],
        iconAnchor: [22, 22],
        popupAnchor: [-3, -25]
    });
}

// Create custom Leaflet marker icons for each album
const folkloreIcon = createDivIconWithBorder('img/marker-folklore.jpeg');
const evermoreIcon = createDivIconWithBorder('img/marker-evermore.jpg');
const loverIcon = createDivIconWithBorder('img/marker-lover.jpeg');
const reputationIcon = createDivIconWithBorder('img/marker-reputation.jpeg');
const redIcon = createDivIconWithBorder('img/marker-red.webp');
const icon1989 = createDivIconWithBorder('img/marker-1989.webp');

class LyricMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, lyricsData, mapCenter, mapName) {
        this.parentElement = parentElement;
        this.lyricsData = lyricsData;
        this.mapCenter = mapCenter;
        this.mapName = mapName;

        this.initVis();
    }

    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        // Specify the path to the Leaflet images
        L.Icon.Default.imagePath = 'img/';

        // Create custom icons
        // vis.folkloreIcon = L.icon({
        //     iconUrl: 'img/marker-folklore.jpeg',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });
        // vis.evermoreIcon = L.icon({
        //     iconUrl: 'img/marker-evermore.jpg',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });
        // vis.loverIcon = L.icon({
        //     iconUrl: 'img/marker-lover.jpeg',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });
        // vis.reputationIcon = L.icon({
        //     iconUrl: 'img/marker-reputation.jpeg',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });
        // vis.redIcon = L.icon({
        //     iconUrl: 'img/marker-red.webp',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });
        // vis.icon1989 = L.icon({
        //     iconUrl: 'img/marker-1989.webp',
        //     iconSize:     [38, 38],
        //     iconAnchor:   [22, 22],
        //     popupAnchor:  [-3, -25]
        // });

        // Create an array of locations referenced
        // note: coordinates from latlong.net
        vis.NYlocations = [];
        vis.NYlocations.push({ name: "The High Line", latlng: [40.747991, -74.004765], index: 0, icon: folkloreIcon });
        vis.NYlocations.push({ name: "Coney Island", latlng: [40.5755, -73.9700], index: 1, icon: evermoreIcon });
        vis.NYlocations.push({ name: "Cornelia Street", latlng: [40.7328, -74.0020], index: 2, icon: loverIcon });
        vis.NYlocations.push({ name: "Dive bar on the East Side", latlng: [40.7265, -73.9840], index: 3, icon: reputationIcon });
        vis.NYlocations.push({ name: "Madison Square", latlng: [40.7486, -73.9857], index: 4, icon: redIcon });
        vis.NYlocations.push({ name: "Garden", latlng: [40.7505, -73.9934], index: 5, icon: loverIcon });
        vis.NYlocations.push({ name: "Office downtown", latlng: [40.7128, -74.0060], index: 6, icon: icon1989 });
        vis.NYlocations.push({ name: "Upstate", latlng: [42.881160, -73.731130], index: 7, icon: redIcon });
        vis.NYlocations.push({ name: "Brooklyn", latlng: [40.692532, -73.990997], index: 21, icon: redIcon });
        vis.NYlocations.push({ name: "West Village", latlng: [40.734090, -74.008490], index: 24, icon: loverIcon });

        vis.londonLocations = [];
        vis.londonLocations.push({ name: "Camden Market", latlng: [51.5390, 0.1426], index: 34, icon: loverIcon });
        vis.londonLocations.push({ name: "Highgate", latlng: [51.5717, 0.1501], index: 35, icon: loverIcon });
        vis.londonLocations.push({ name: "West End", latlng: [51.5118, 0.1271], index: 36, icon: loverIcon });
        vis.londonLocations.push({ name: "Brixton", latlng: [51.4613, 0.1156], index: 37, icon: loverIcon });
        vis.londonLocations.push({ name: "Shoreditch", latlng: [51.5229, 0.0777], index: 38, icon: loverIcon });
        vis.londonLocations.push({ name: "Hackney", latlng: [51.5436, 0.0554], index: 39, icon: loverIcon });
        vis.londonLocations.push({ name: "Bond Street", latlng: [51.514299, -0.149002], index: 40, icon: loverIcon });

        console.log("NY LOCATION DATA:");
        console.log(vis.NYlocations);

        console.log("LONDON LOCATION DATA:");
        console.log(vis.londonLocations);

        console.log("LYRICS DATA:");
        console.log(vis.lyricsData);

        // Define the map and set its center and zoom level
        if (vis.mapName === "NY") {
            vis.zoomLevel = 13;
        } else if (vis.mapName === "London") {
            vis.zoomLevel = 11;
        }
        vis.map = L.map(vis.parentElement).setView(vis.mapCenter, vis.zoomLevel);

        // Load and display a tile layer on the map
        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //     attribution: 'OpenStreetMap'
        // }).addTo(vis.map);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(vis.map);

        // Create a LayerGroup to hold the markers
        vis.stationLayer = L.layerGroup().addTo(vis.map);

        vis.wrangleData();

        // Create a space for the images to go
        vis.imgWidth = 500;
        vis.imgHeight = 225;
        if (vis.mapName === "NY") {
            d3.select("#ny-place-img").append("svg").attr("width",vis.imgWidth).attr("height",vis.imgHeight).attr("id","ny-place");
        } else if (vis.mapName === "London") {
            d3.select("#london-place-img").append("svg").attr("width",vis.imgWidth).attr("height",vis.imgHeight).attr("id","london-place");
        }
    }

    /*
     * Update lyrics based on selected location
     */
    updateLyrics(clickedLocation, city) {
        let vis = this;

        // Find the location name based on the clicked location
        let locationName;
        if (city === "NY") {
            locationName = vis.findLocationName(clickedLocation, "NY");
        } else if (city === "London") {
            locationName = vis.findLocationName(clickedLocation, "London");
        } else {
            console.log("Error: invalid city.")
        }

        // Find the lyrics data for the clicked location name
        const selectedLyric = vis.lyricsData.find(entry => entry.location === locationName);

        // Update the content of lyrics div
        const NYLyricsDiv = document.getElementById('ny-lyrics');
        if (selectedLyric && vis.mapName === "NY") {
            NYLyricsDiv.innerHTML = `<p>Song: ${selectedLyric.song}</p>
                                     <p>Lyric: ${selectedLyric.lyric}</p>`;
            let place_img_path = "img/place-" + (selectedLyric.index).toString() + ".jpeg";
            d3.selectAll(".place-1").remove();
            d3.select("#ny-place").append("image")
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', vis.imgWidth)
                .attr('height', vis.imgHeight)
                .attr('class', 'place-1')
                .attr("xlink:href", place_img_path);
        } else {
            NYLyricsDiv.innerHTML = '<p>No lyrics available for this location.</p>';
        }
        const londonLyricsDiv = document.getElementById('london-lyrics');
        if (selectedLyric && vis.mapName === "London") {
            londonLyricsDiv.innerHTML = `<p>Song: ${selectedLyric.song}</p>
                                         <p>Lyric: ${selectedLyric.lyric}</p>`;
            let place_img_path = "img/place-" + (selectedLyric.index).toString() + ".jpeg";
            d3.selectAll(".place-1").remove();
            d3.select("#london-place").append("image")
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', vis.imgWidth)
                .attr('height', vis.imgHeight)
                .attr('class', 'place-1')
                .attr("xlink:href", place_img_path);
        } else {
            londonLyricsDiv.innerHTML = '<p>No lyrics available for this location.</p>';
        }
    }

    /*
     * Find location name based on clicked location (helper function)
     */
    findLocationName(clickedLocation, city) {
        let vis = this;

        console.log(clickedLocation);

        let closestLocation;

        // Loop through locations and find the closest based on distance
        if (city === "NY") {
            closestLocation = vis.NYlocations.reduce((closest, current) => {
                const closestDistance = clickedLocation.distanceTo(closest.latlng);
                const currentDistance = clickedLocation.distanceTo(current.latlng);
                return currentDistance < closestDistance ? current : closest;
            }, vis.NYlocations[0]); // Assume the first entry as the initial closest
        } else if (city === "London") {
            closestLocation = vis.londonLocations.reduce((closest, current) => {
                const closestDistance = clickedLocation.distanceTo(closest.latlng);
                const currentDistance = clickedLocation.distanceTo(current.latlng);
                return currentDistance < closestDistance ? current : closest;
            }, vis.londonLocations[0]);
        } else {
            console.log("Error: invalid city.")
        }

        return closestLocation.name;
    }

    /*
     * Event handler for location click
     */
    locationClickHandler(location, city) {
        let vis = this;

        // Find the clicked location
        let clickedLocation;
        if (vis.mapName === "NY") {
            clickedLocation = vis.NYlocations.find(entry => entry.name === location);
        } else if (vis.mapName === "London") {
            clickedLocation = vis.londonLocations.find(entry => entry.name === location);
        }

        // Update lyrics based on the selected location
        if (city === "NY") {
            vis.updateLyrics(clickedLocation ? L.latLng(clickedLocation.latlng) : null, "NY");
        } else if (city === "London") {
            vis.updateLyrics(clickedLocation ? L.latLng(clickedLocation.latlng) : null, "London");
        } else {
            console.log("Error: invalid city.")
        }
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

    // updateVis() {
    //     let vis = this;
    //
    //     // Clear the existing markers from the LayerGroup
    //     vis.stationLayer.clearLayers();
    //
    //     // Add each location referenced to map
    //     vis.NYlocations.forEach(object => {
    //         const marker = L.marker(object.latlng, {icon: object.icon}).bindPopup(object.name);
    //         marker.addTo(vis.map);
    //         marker.on('click', function (event) {
    //             vis.locationClickHandler(object.name, "NY");
    //         });
    //     });
    //     vis.londonLocations.forEach(object => {
    //         const marker = L.marker(object.latlng, {icon: object.icon}).bindPopup(object.name);
    //         marker.addTo(vis.map);
    //         marker.on('click', function (event) {
    //             vis.locationClickHandler(object.name, "London");
    //         });
    //     });
    //
    //     // Set up event listener for map clicks
    //     vis.map.on('click', function (event) {
    //         // Check if the click is not on a marker
    //         if (!event.layer) {
    //             const clickedLocation = event.latlng;
    //             if (this.mapName === "NY") {
    //                 vis.locationClickHandler(clickedLocation, "NY");
    //             } else if (this.mapName === "London") {
    //                 vis.locationClickHandler(clickedLocation, "London");
    //             }
    //         }
    //     });
    // }

    updateVis() {
        let vis = this;

        // Clear the existing markers from the LayerGroup
        vis.stationLayer.clearLayers();

        // Add each location referenced to map
        vis.NYlocations.forEach(object => {
            const marker = L.marker(object.latlng, { icon: object.icon }).bindPopup(object.name);
            marker.addTo(vis.map);
            marker.on('click', function (event) {
                vis.locationClickHandler(object.name, "NY");
            });
        });
        vis.londonLocations.forEach(object => {
            const marker = L.marker(object.latlng, { icon: object.icon }).bindPopup(object.name);
            marker.addTo(vis.map);
            marker.on('click', function (event) {
                vis.locationClickHandler(object.name, "London");
            });
        });

        // Set up event listener for map clicks
        vis.map.on('click', function (event) {
            // Check if the click is not on a marker
            if (!event.layer) {
                const clickedLocation = event.latlng;
                if (this.mapName === "NY") {
                    vis.locationClickHandler(clickedLocation, "NY");
                } else if (this.mapName === "London") {
                    vis.locationClickHandler(clickedLocation, "London");
                }
            }
        });
    }
}