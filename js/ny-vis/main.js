// Variable for the visualization instance
let myNYMap;


// Hubway JSON feed
let url = 'https://gbfs.bluebikes.com/gbfs/en/station_information.json';

d3.json(url).then(jsonData =>{
    // console.log(jsonData);
});

fetch(url, function (d) {
    console.log(d)
})
    .then(response => response.json())
    .then(data => {
        gettingStarted(data)
    });


// function that gets called once data has been fetched.
// We're handing over the fetched data to this function.
// From the data, we're creating the final data structure we need and create a new instance of the NYMap
function gettingStarted(data) {

    // log data
    // console.log(data)

    // Extract data from JSON response

    // create empty data structure
    let displayData = [];

    // Populate empty data structure


    // Instantiate visualization object
    myNYMap = new NYMap("ny-vis", displayData, [42.360082, -71.058880]); // [40.72332345541449, -73.99]
}
