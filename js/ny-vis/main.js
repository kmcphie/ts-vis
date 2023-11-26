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
    .then(data => {
        initVis(data)
    });

function initVis(data) {
    myNYMap = new NYMap("ny-vis", data, [40.758896, -73.985130]);
}