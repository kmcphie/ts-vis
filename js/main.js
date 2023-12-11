/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables
let myGlobeVis,
    myMapVis,
    myThemeClusterVis,
    treeVis,
    winBar
;

// load data using promises
let promises = [
    d3.csv("data/Taylor_Swift_Tour_Data.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"), // WORLD
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // USA
    d3.csv("data/uscities.csv"),

    // LYRIC VIS
    d3.csv("data/themeCount.csv", d => {
        d.item_count = +d.item_count;
        return d;
    }),

    d3.csv("data/lyricThemes.csv"),

    d3.json("data/wins.json"),
    d3.csv("data/grammyAwards.csv"),
    d3.csv("data/Tour_Info.csv"),

    d3.csv("data/albumThemeCount.csv", d => {
        d.count = +d.count;
        return d;
    })
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

        // Rename tours in the data array
        data[0].forEach(d => {
            switch (d.Tour) {
                case 'The_Red_Tour':
                    d.Tour = "Red";
                    break;
                case 'Speak_Now_World_Tour':
                    d.Tour = "Speak Now";
                    break;
                case 'The_1989_World_Tour':
                    d.Tour = "1989";
                    break;
                case 'Fearless_Tour':
                    d.Tour = 'Fearless';
                    break;
                case 'Reputation_Stadium_Tour':
                    d.Tour = "Reputation";
                    break;
                default:
                    d.Tour = "Tour";
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

        // console.log("TOUR DATA:");
        // console.log(data[0]);
        // console.log("GEO DATA WORLD:");
        // console.log(data[1]);
        // console.log("GEO DATA USA:");
        // console.log(data[2]);
        // console.log("CITY DATA:");
        // console.log(data[3]);
        // console.log("TOUR INFO:");
        // console.log(data[8]);

        myGlobeVis = new GlobeVis("globe-vis", data[0], data[1], data[8]);
        myMapVis = new MapVis("map-vis", data[0], data[2], data[3]);

        // LYRIC VISUALIZATION
        // console.log("LYRIC THEME COUNT DATA: ")
        // console.log(data[4])
        console.log('LYRIC THEMES DATA: ')
        console.log(data[5]);

        myThemeClusterVis = new ClusterVis("theme-count-vis", data[4], data[5], data[9]);

        treeVis = new TreeVis('tree-vis', data[6])
        // console.log(data[7])
        winBar = new WinBar('grammy-vis', data[7])
        // console.log("grammy data:", data[7])

        console.log("INDIVIDUAL ALBUM THEME COUNT: ")
        console.log(data[9]);

    })
    .catch( function (err){console.log(err)} );

function moveToAlbumClusters() {
    // console.log("album clusters!")
    myThemeClusterVis.initAlbumClusters()
}