/* * * * * * * * * * * * * *
*         GlobeVis         *
* * * * * * * * * * * * * */

class GlobeVis {
    constructor(parentElement, tourData, geoData, tourInfo) {
        this.parentElement = parentElement;
        this.tourData = tourData;
        this.geoData = geoData;
        this.tourInfo = tourInfo;

        this.initVis()
    }

    updateTourInfo(selectedTour) {
        let vis = this;

        // Update the dropdown and colors to match selected tour
        vis.tourFilter.value = (() => {
            switch (selectedTour.Title) {
                case 'The Red Tour':
                    vis.colorScale = d3.scaleOrdinal()
                        .domain(["0", "1", "<50", "50+"])
                        .range(["#ede6e6", "#c96d6d", "#cb3d3d", "#cc2a2a"]);
                    vis.oceanColor = "#8bc4c3";
                    return 'Red';
                case 'Speak Now World Tour':
                    vis.colorScale = d3.scaleOrdinal()
                        .domain(["0", "1", "<50", "50+"])
                        .range(["#e9e6ed", "#b1aad2", "#9289cc", "#856fd2"]);
                    vis.oceanColor = "#8bc4c3";
                    return 'Speak Now';
                case 'The 1989 World Tour':
                    vis.colorScale = d3.scaleOrdinal()
                        .domain(["0", "1", "<50", "50+"])
                        .range(["#e6edec", "#bbdae3", "#a0d8e1", "#88D9E6"]);
                    vis.oceanColor = "#727272";
                    return '1989';
                case 'Fearless Tour':
                    vis.colorScale = d3.scaleOrdinal()
                        .domain(["0", "1", "<50", "50+"])
                        .range(["#edece6", "#e7dec6", "#e5ce96", "#ecd27d"]);
                    vis.oceanColor = "#8bc4c3";
                    return 'Fearless';
                case 'Reputation Stadium Tour':
                    vis.colorScale = d3.scaleOrdinal()
                        .domain(["0", "1", "<50", "50+"])
                        .range(["#ffffff", "#b7b7b7", "#7a7a7a", "#313131"]);
                    vis.oceanColor = "#8bc4c3";
                    return 'Reputation';
                default:
                    return 'all';
            }
        })();

        vis.svg.select(".graticule")
            .attr('fill', vis.oceanColor);

        // Trigger the change event on the dropdown to update the visualization
        const changeEvent = new Event("change");
        vis.tourFilter.dispatchEvent(changeEvent);

        // Update the text to show information about selected tour
        let tourCountryInfoDiv = document.getElementById("tour-country-info");
        tourCountryInfoDiv.innerHTML =
            `<div>
            <h3><b>${selectedTour.Title}</b></h3>
            <p><b>Dates:</b> ${selectedTour.Dates}</p>
            <p><b>Shows:</b> ${selectedTour.Shows}</p>
            <p><b>Attendance:</b> ${selectedTour.Attendance}</p>
            <p><b>Revenue:</b> ${selectedTour.Revenue}</p>
        </div>`;
    }

    updateColorsOnly(selectedTourName) {
        let vis = this;

        // Update the dropdown and colors to match selected tour
        if (selectedTourName === 'Red') {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#ede6e6", "#c96d6d", "#cb3d3d", "#cc2a2a"]);
            vis.oceanColor = "#8bc4c3";
        } else if (selectedTourName === 'Speak Now') {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#e9e6ed", "#b1aad2", "#9289cc", "#856fd2"]);
            vis.oceanColor = "#8bc4c3";
        } else if (selectedTourName === '1989') {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#e6edec", "#bbdae3", "#a0d8e1", "#88D9E6"]);
            vis.oceanColor = "#727272";
        } else if (selectedTourName === 'Fearless') {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#edece6", "#e7dec6", "#e5ce96", "#ecd27d"]);
            vis.oceanColor = "#8bc4c3";
        } else if (selectedTourName === 'Reputation') {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#ffffff", "#b7b7b7", "#7a7a7a", "#313131"]);
            vis.oceanColor = "#8bc4c3";
        } else {
            vis.colorScale = d3.scaleOrdinal()
                .domain(["0", "1", "<50", "50+"])
                .range(["#edece6", "#d5d4b7", "#abba97", "#54604b"]);
            vis.oceanColor = "#8bc4c3";
        }

        vis.svg.select(".graticule")
            .attr('fill', vis.oceanColor);

        let tourCountryInfoDiv = document.getElementById("tour-country-info");
        tourCountryInfoDiv.innerHTML = `<div></div>`;
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // color scale definition
        vis.colorScale = d3.scaleOrdinal()
            .domain(["0", "1", "<50", "50+"])
            .range(["#edece6", "#d5d4b7", "#abba97", "#54604b"]);

        vis.oceanColor = "#8bc4c3";

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // projection
        vis.projection = d3.geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(230)
            .rotate([98, -39, 0]);

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', vis.oceanColor)
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)


        // add tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")


        // globe scrolling
        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )

        // Filter by tour dropdown
        vis.tourFilter = document.getElementById("tour-filter");
        vis.tourFilter.addEventListener("change", function () {
            vis.updateColorsOnly(vis.tourFilter.value);
            vis.wrangleData();
        });

        // Legend
        vis.legendData = [
            { label: 'Fearless', color: '#ecd27d', id: 'tour-fearless' },
            { label: 'Speak Now', color: '#856fd2', id: 'tour-speak-now' },
            { label: 'Red', color: '#cc2a2a', id: 'tour-red' },
            { label: '1989', color: '#88D9E6', id: 'tour-1989' },
            { label: 'Reputation', color: 'white', id: 'tour-reputation' },
        ];

        vis.legend = d3.select("#tour-legend")
            .append("svg")
            .attr("width", 500)
            .attr("height", 50);

        vis.legend.selectAll("rect")
            .data(vis.legendData)
            .enter().append("rect")
            .attr("x", (d, i) => i * 100)
            .attr("y", 10)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", d => d.color)
            .attr("id", d => d.id);

        vis.legend.selectAll("text")
            .data(vis.legendData)
            .enter().append("text")
            .attr("x", (d, i) => i * 100 + 25)
            .attr("y", 25)
            .text(d => d.label)
            .attr("fill", "white")
            .style("font-size", "12px");

        // Event listeners for albums
        document.getElementById("tour-fearless").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "Fearless Tour");
            vis.updateTourInfo(selectedTour);
        });
        document.getElementById("tour-speak-now").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "Speak Now World Tour");
            vis.updateTourInfo(selectedTour);
        });
        document.getElementById("tour-red").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "The Red Tour");
            vis.updateTourInfo(selectedTour);
        });
        document.getElementById("tour-1989").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "The 1989 World Tour");
            vis.updateTourInfo(selectedTour);
        });
        document.getElementById("tour-reputation").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "Reputation Stadium Tour");
            vis.updateTourInfo(selectedTour);
        });

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // data structure with information for each country
        vis.countryInfo = {};

        // Extract the country names from the GeoJSON data
        vis.geoData.objects.countries.geometries.forEach(d => {
            const originalName = d.properties.name;
            // Rename to match the tourData
            if (originalName === "United States of America") {
                d.properties.name = "United States";
            } else if (["England", "Scotland", "Wales", "Northern Ireland"].includes(originalName)) {
                d.properties.name = "United Kingdom";
            }

            vis.countryInfo[d.properties.name] = {
                name: originalName,
                numShows: 0, // Initialize the count
                totalShows: 0,
                tours: []
            };
        });

        // Calculate the total stats (doesn't change based on filtering)
        vis.totalShowsAllCountries = 0;
        vis.tourData.forEach(d => {
            const countryName = d.Country;
            if (["England", "Scotland", "Wales", "Northern Ireland"].includes(countryName)) {
                vis.countryInfo["United Kingdom"].totalShows++;
                if (!vis.countryInfo["United Kingdom"].tours.includes(d.Tour)) {
                    vis.countryInfo["United Kingdom"].tours.push(d.Tour);
                }
                vis.totalShowsAllCountries++;
            }
            if (vis.countryInfo[countryName]) {
                vis.countryInfo[countryName].totalShows++;
                if (!vis.countryInfo[countryName].tours.includes(d.Tour)) {
                    vis.countryInfo[countryName].tours.push(d.Tour);
                }
                vis.totalShowsAllCountries++;
            }
        });

        // Filter the displayData based on the selection box
        vis.displayData = vis.tourData;
        let selectedTourName = vis.tourFilter.value;
        if (selectedTourName !== 'all') {
            vis.displayData = vis.displayData.filter(d => d.Tour === selectedTourName);
        }

        // Count the number of shows for each country (changes based on filtering)
        vis.displayData.forEach(d => {
            const countryName = d.Country;
            if (["England", "Scotland", "Wales", "Northern Ireland"].includes(countryName)) {
                vis.countryInfo["United Kingdom"].numShows++;
            }
            if (vis.countryInfo[countryName]) {
                vis.countryInfo[countryName].numShows++;
            }
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.countries.style("fill", d => {
            const countryName = d.properties.name;
            const numShows = vis.countryInfo[countryName]?.numShows || 0;
            if (numShows === 0) {
                return vis.colorScale("0");
            } else if (numShows === 1) {
                return vis.colorScale("1")
            } else if (numShows < 50) {
                return vis.colorScale("<50");
            } else {
                return vis.colorScale("50+");
            }
        });

        vis.countries.on("mouseover", function (event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'black')

            const countryName = d.properties.name;
            const numShows = vis.countryInfo[countryName] ? vis.countryInfo[countryName].numShows : 0;
            vis.tooltip
                .style("opacity", 0.9)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                    <strong>${countryName}</strong>
                    <br>
                    <strong> Number of Shows:</strong> ${numShows}`);
        }).on('mouseout', function(event, d){
            d3.select(this)
                .attr('stroke-width', '0px')

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        });

        vis.countries.on("click", function (event, d) {
            const countryName = d.properties.name;
            const numShows = vis.countryInfo[countryName] ? vis.countryInfo[countryName].numShows : 0;
            const totalShows = vis.countryInfo[countryName] ? vis.countryInfo[countryName].totalShows : 0;
            const percentShows = ((totalShows / vis.totalShowsAllCountries) * 100).toFixed(2);
            const tours = vis.countryInfo[countryName] ? vis.countryInfo[countryName].tours : 0;

            let tourCountryInfoDiv = document.getElementById("tour-country-info");
            tourCountryInfoDiv.innerHTML =
                `<div>
            <h3><b>${countryName}</b></h3>
            <p><b>Shows:</b> ${numShows}</p>
            <p><b>Total Shows:</b> ${totalShows}</p>
            <p><b>Associated tours:</b> 
                ${Array.isArray(tours) ?
                    (tours.length > 0 ?
                        `<ul>${tours.map(t => `<li>${t}</li>`).join('')}</ul>` :
                        'No tours available') :
                    `<p>${tours}</p>`}
            </p>
            <br>
            </div>`;

            if (percentShows === "0.00") {
                tourCountryInfoDiv.append(`Taylor Swift hasn't toured in ${countryName}... yet!`);
            } else {
                if (countryName === "United States") {
                    tourCountryInfoDiv.append(`Out of all tours prior to the Eras Tour, ${percentShows}% of Taylor Swift's 
                    shows have been performed in the ${countryName}. Since that's such a high percentage, let's take a 
                    closer look at where within the US Taylor has been!`);
                } else {
                    tourCountryInfoDiv.append(`Out of all tours prior to the Eras Tour, ${percentShows}% of Taylor Swift's shows have been performed in ${countryName}.`);
                }
            }

        });

    }
}