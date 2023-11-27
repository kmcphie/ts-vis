/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// General New York references:
// - mean
// - come back
// - holy ground
// - welcome to New York
// - false God
// - daylight
// - hoax

let myNYMap;

fetch('https://gbfs.bluebikes.com/gbfs/en/station_information.json', function (d) {
    console.log(d)
})
    .then(response => response.json())
    .then(stationData => {
        fetch('data/ny_lyrics.json')
            .then(response => response.json())
            .then(lyricsData => {
                initVis(stationData, lyricsData);
            })
            .catch(error => console.error('Error fetching lyrics data:', error));
    });

function initVis(stationData, lyricsData) {
    myNYMap = new NYMap("ny-vis", lyricsData, [40.758896, -73.985130]);
}