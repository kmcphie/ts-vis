/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */
let NYMap, LondonMap;

fetch('https://gbfs.bluebikes.com/gbfs/en/station_information.json', function (d) {
    console.log(d)
})
    .then(response => response.json())
    .then(stationData => {
        fetch('data/place_lyrics.json')
            .then(response => response.json())
            .then(lyricsData => {
                initVis(stationData, lyricsData);
            })
            .catch(error => console.error('Error fetching lyrics data:', error));
    });

function initVis(stationData, lyricsData) {
    NYMap = new LyricMap("ny-vis", lyricsData, [40.72633045286682, -73.99738792202116], "NY");
    LondonMap = new LyricMap( "london-vis", lyricsData, [51.5072, 0.1276], "London");
}