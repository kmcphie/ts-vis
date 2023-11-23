/* * * * * * * * * * * * * *
*          NYMap           *
* * * * * * * * * * * * * */

class NYMap {
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
        L.tileLayer("http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png", {
            minZoom: 10, maxZoom: 13
        }).addTo(vis.map);



        // GeoJSON layer

        // let promises = [
        //     d3.json("data/MBTA-Lines.json")
        // ];
        //
        // Promise.all(promises)
        //     .then(function (data) {
        //         console.log(data);
        //         data.forEach(geoJSONData => {
        //             // Create a GeoJSON layer and add it to the map
        //             L.geoJSON(geoJSONData, {
        //                 style: function (feature) {
        //                     // Access properties of each line and style accordingly
        //                     return {
        //                         color: (function () {
        //                             switch (feature.properties.LINE) {
        //                                 case 'RED':
        //                                     return 'red';
        //                                 case 'GREEN':
        //                                     return 'green';
        //                                 case 'ORANGE':
        //                                     return 'orange';
        //                                 case 'BLUE':
        //                                     return 'blue';
        //                                 case 'SILVER':
        //                                     return 'gray';
        //                                 default:
        //                                     return 'black';
        //                             }
        //                         })(),
        //                         weight: 15,
        //                         opacity: 0.6
        //                     };
        //                 }
        //             }).addTo(vis.map);
        //         });
        //     })
        //     .catch(function (err) {
        //         console.log(err);
        //     });


        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //
    }
}