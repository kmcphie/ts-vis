/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables
let myGlobeVis,
    myMapVis,
    myThemeClusterVis,
    treeVis,
    winBar,
    allSongData
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
    }),

    d3.csv("data/allSongData.csv", d => {
        d.Energy = +d.Energy;
        d.Acousticness = +d.Acousticness;
        d.Valence = +d.Valence;
        d.Danceability = +d.Danceability;
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

        allSongData = data[10];

    })
    .catch( function (err){console.log(err)} );

function moveToAlbumClusters() {
    // console.log("album clusters!")
    myThemeClusterVis.initAlbumClusters()
}

function moveToTotalClusters() {
    myThemeClusterVis.initVis();
}

function recommendSong() {
    console.log("process song rec");

    d3.select(".song-rec").remove();

    // Get values from input fields
    const valence = parseFloat(document.getElementById('valence').value);
    const danceability = parseFloat(document.getElementById('danceability').value);
    const acousticness = parseFloat(document.getElementById('acousticness').value);
    const energy = parseFloat(document.getElementById('energy').value);

    // Validation: Check if values are within the range [0, 1]
    if (isNaN(valence) || valence < 0 || valence > 1 ||
        isNaN(danceability) || danceability < 0 || danceability > 1 ||
        isNaN(acousticness) || acousticness < 0 || acousticness > 1 ||
        isNaN(energy) || energy < 0 || energy > 1) {
        alert('Please enter valid values between 0 and 1 for production features.');
    }

    //console.log(allSongData);

    const filteredSongs = filterSongs(valence, danceability, acousticness, energy);
    const recommendation = recommendFromFilteredSongs(filteredSongs);

    console.log(recommendation);

    d3.select("#song-rec").append("text")
        .attr("class", "song-rec")
        .text(recommendation);
}

// Filter the dataset by user input
function filterSongs(valence, danceability, acousticness, energy) {
    return allSongData.filter(song => {
        // Assuming your dataset has columns named 'Valence', 'Danceability', 'Acousticness', 'Energy'
        const songValence = song.Valence;
        const songDanceability = song.Danceability;
        const songAcousticness = song.Acousticness;
        const songEnergy = song.Energy;

        // Check if each production feature is within ±0.2 of the user input
        return (
            Math.abs(songValence - valence) <= 0.3 &&
            Math.abs(songDanceability - danceability) <= 0.3 &&
            Math.abs(songAcousticness - acousticness) <= 0.3 &&
            Math.abs(songEnergy - energy) <= 0.3
        );
    });
}

// Function to recommend a song from the filtered list
function recommendFromFilteredSongs(filteredSongs) {
    if (filteredSongs.length > 0) {
        // Generate a random index within the length of the filteredSongs array
        const randomIndex = Math.floor(Math.random() * filteredSongs.length);

        // Get the random song from the array
        const randomSong = filteredSongs[randomIndex];

        return `Based on your choices, we think you would enjoy the song "${randomSong.song}". Give it a listen and let us know what you think!`;
    } else {
        return "Sorry, no matching songs found.";
    }
}