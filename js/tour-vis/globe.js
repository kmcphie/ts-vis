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

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // projection
        vis.projection = d3.geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(200)
            .rotate([98, -39, 0]);

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#8bc4c3')
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
            vis.updateTourCountryInfo(selectedTour);
        });
        document.getElementById("tour-speak-now").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "Speak Now World Tour");
            vis.updateTourCountryInfo(selectedTour);
        });
        document.getElementById("tour-red").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "The Red Tour");
            vis.updateTourCountryInfo(selectedTour);
        });
        document.getElementById("tour-1989").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "The 1989 World Tour");
            vis.updateTourCountryInfo(selectedTour);
        });
        document.getElementById("tour-reputation").addEventListener("click", function () {
            let selectedTour = vis.tourInfo.find(entry => entry.Title === "Reputation Stadium Tour");
            vis.updateTourCountryInfo(selectedTour);
        });

        vis.wrangleData();
    }

    updateTourCountryInfo(selectedTour) {
        const tourCountryInfoDiv = document.getElementById("tour-country-info");
        tourCountryInfoDiv.innerHTML =
            `<div>
                    <p><b>${selectedTour.Title}</b></p>
                    <p><b>Dates:</b> ${selectedTour.Dates}</p>
                    <p><b>Shows:</b> ${selectedTour.Shows}</p>
                    <p><b>Attendance:</b> ${selectedTour.Attendance}</p>
                    <p><b>Revenue:</b> ${selectedTour.Revenue}</p>
                </div>`;
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
                numTours: 0 // Initialize the count
            };
        });

        // Filter the displayData based on the selection box
        vis.displayData = vis.tourData;
        let selectedTour = vis.tourFilter.value;
        if (selectedTour !== 'all') {
            vis.displayData = vis.displayData.filter(d => d.Tour === selectedTour);
        }

        console.log("Filtered data:");
        console.log(vis.displayData);

        // Count the number of tours for each country
        vis.displayData.forEach(d => {
            const countryName = d.Country;
            if (["England", "Scotland", "Wales", "Northern Ireland"].includes(countryName)) {
                vis.countryInfo["United Kingdom"].numTours++;
            }
            if (vis.countryInfo[countryName]) {
                vis.countryInfo[countryName].numTours++;
            }
        });

        // Color scale definition
        vis.colorScale = d3.scaleOrdinal()
            .domain(["0", "1", "<50", "50+"])
            .range(["#edece6", "#d5d4b7", "#abba97", "#54604b"]);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.countries.style("fill", d => {
            const countryName = d.properties.name;
            const numTours = vis.countryInfo[countryName]?.numTours || 0;
            if (numTours === 0) {
                return vis.colorScale("0");
            } else if (numTours === 1) {
                return vis.colorScale("1")
            } else if (numTours < 50) {
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
            const numTours = vis.countryInfo[countryName] ? vis.countryInfo[countryName].numTours : 0;
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                    <h3>${countryName}<h3>
                    <h4> Number of Tours: ${numTours}</h4>  
                </div>`);
        })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

    }
}