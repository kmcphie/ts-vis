/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables
let myGlobeVis;

// load data using promises
let promises = [
    d3.csv("data/Taylor_Swift_Tour_Data.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
];

Promise.all(promises)
    .then( function(data){

        // Rename columns
        const columnMapping = {
            'City': 'City',
            'Country': 'Country',
            'Venue': 'Venue',
            'Opening act(s)': 'Opening_act',
            'Attendance (tickets sold / available)': 'Tickets_sold_and_available',
            'Revenue': 'Revenue',
            'Tour': 'Tour'
        };

        data.forEach(function(d) {
            for (const oldCol in columnMapping) {
                const newCol = columnMapping[oldCol];
                d[newCol] = d[oldCol];
                delete d[oldCol];
            }
        });

        // Finding Number Of Events By Country For Each Tour
        const uniqueTours = [...new Set(data.map(d => d.Tour))];

        // Iterate through unique tours
        uniqueTours.forEach(function(tour, idx) {
            // Filter data for the current tour
            const tourData = data.filter(d => d.Tour === tour);

            // Calculate value counts of countries
            const countryCounts = d3.rollup(tourData, v => v.length, d => d.Country);
        });

        createGlobeVis(data[0], data[1]);
    })
    .catch( function (err){console.log(err)} );

function createGlobeVis(tourData, geoData) {
    console.log("TOUR DATA:");
    console.log(tourData);
    console.log("GEO DATA:");
    console.log(geoData);
    myGlobeVis = new GlobeVis("globe-vis", tourData, geoData);
}
