/* * * * * * * * * * * * * *
*         MapVis           *
* * * * * * * * * * * * * */

class MapVis {
    constructor(parentElement, tourData, geoData, cityData) {
        this.parentElement = parentElement;
        this.tourData = tourData;
        this.geoData = geoData;
        this.cityData = cityData;

        this.wrangleData();
        this.initVis();
        this.updateVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // adjust map position
        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // add tooltip
        vis.tooltip = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // projection
        vis.projection = d3.geoMercator()
            .translate([vis.width * 2.1, vis.height])
            .scale(340);

        // Create a color scale
        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#136D70"]);

        vis.map = vis.svg.append("g")
            .attr("class", "states")
            .attr("transform", `scale(${vis.zoom} ${vis.zoom})`);

        vis.path = d3.geoPath();

        vis.states = vis.map.selectAll(".state")
            .data(topojson.feature(vis.geoData, vis.geoData.objects.states).features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .attr("stroke", "black")
            .attr("fill", "transparent")
            .attr("stroke-width", 1)

        // vis.path = d3.geoPath()
        //     .projection(vis.projection);
        //
        // vis.world = topojson.feature(vis.worldGeoData, vis.worldGeoData.objects.countries).features;
        //
        // vis.svg.append("path")
        //     .datum({ type: "Sphere" })
        //     .attr("class", "graticule")
        //     .attr('fill', '#8fa8e5')
        //     .attr("stroke", "rgba(129,129,129,0.35)")
        //     .attr("d", vis.path);

        vis.cities = vis.svg.selectAll(".city")
            .data(vis.tourData)
            .enter().append("circle")
            .attr('class', 'city')
            .attr("cx", d => {
                const cityData = vis.cityData.find(c => c.city === d.City);
                let x = 0;
                if (cityData) {
                    let coordinates = [vis.cityInfo[cityData.city].longitude, vis.cityInfo[cityData.city].latitude];
                    let [x, y] = vis.projection(coordinates);
                    return x;
                    // if (x !== 0) {
                        // return (x + 100) * (vis.width / 59) + vis.width/2.3;
                    // }
                } else {
                    return -5;
                }
            })
            .attr("cy", d => {
                const cityData = vis.cityData.find(c => c.city === d.City);
                let y = 0;
                if (cityData) {
                    let coordinates = [vis.cityInfo[cityData.city].longitude, vis.cityInfo[cityData.city].latitude];
                    let [x, y] = vis.projection(coordinates);
                    return y;
                    // if (y !== 0) {
                        // return (100 - y) * (vis.height / 40) - vis.height/0.8;
                    // }
                } else {
                    return -5;
                }
            })
            .attr("r", 5)
            .style("fill", "#c91441");
    }

    wrangleData() {
        let vis = this;

        // data structure with information for each city
        vis.cityInfo = {};

        vis.displayData = vis.tourData.filter()

        // Count the number of tours for each U.S. city
        vis.displayData.forEach(d => {
            const cityName = d.City;
            const cityData = vis.cityData.find(c => c.city === cityName);
            if (cityData) {
                if (vis.cityInfo[cityName]) {
                    vis.cityInfo[cityName].numTours++;
                } else {
                    vis.cityInfo[cityName] = {
                        name: cityName,
                        numTours: 1, // Initialize the count
                        latitude: parseFloat(cityData.lat),
                        longitude: parseFloat(cityData.lng)
                    };
                }
            }
        });

        console.log(vis.cityInfo);
    }

    updateVis() {
        let vis = this;

        vis.cities.style("fill", '#6488e3');

        vis.cities.on("mouseover", function (event, d) {
            d3.select(this)
                .attr('r', 8)
                .style('fill', '#c91441');

            const cityName = d.City;
            const numTours = vis.cityInfo[cityName] ? vis.cityInfo[cityName].numTours : 0;
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                    <h3>${cityName}<h3>
                    <h4> Number of Tours: ${numTours}</h4>  
                </div>`);
        })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('r', 5)
                    .style('fill', '#6488e3');

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }
}



/*
    wrangleData() {
        let vis = this

        // init empty array
        let filteredData = [];

        // iterate over all rows the csv
        vis.tourData.forEach(d => {
            if (d.Country === "United States") {
                filteredData.push(d);
            }
        });


        // prepare data by grouping all rows by state
        let toursByState = Array.from(d3.group(filteredData, d => d.state), ([key, value]) => ({key, value}))

        // have a look
        // console.log(covidDataByState)

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        // merge
        covidDataByState.forEach(state => {

            // get full state name
            let stateName = nameConverter.getFullName(state.key)

            // init counters
            let newCasesSum = 0;
            let newDeathsSum = 0;
            let population = 0;

            // look up population for the state in the census data set
            vis.usaData.forEach(row => {
                if (row.state === stateName) {
                    population += +row["2020"].replaceAll(',', '');
                }
            })

            // calculate new cases by summing up all the entries for each state
            state.value.forEach(entry => {
                newCasesSum += +entry['new_case'];
                newDeathsSum += +entry['new_death'];
            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: stateName,
                    population: population,
                    absCases: newCasesSum,
                    absDeaths: newDeathsSum,
                    relCases: (newCasesSum / population * 100),
                    relDeaths: (newDeathsSum / population * 100)
                }
            )
        })

        vis.updateVis();

    }


    updateVis() {
        let vis = this;

        vis.colorScale.domain([0, d3.max(vis.stateInfo, d => d[selectedCategory])]);

        vis.states
            .attr("fill", (d) => {
                // console.log(d);
                let stateName = d.properties.name;
                let color = "";
                vis.stateInfo.forEach (state => {
                    if (state.state === stateName) {
                        color = vis.colorScale(state[selectedCategory]);
                    }
                })
                return color;
            });

        // Tooltip mouseover
        vis.states.on('mouseover', function (event, d) {
            d3.select(this)
                .attr('stroke-width', '3px');
            vis.tooltip.transition()
                .duration(200)
                .style("opacity", 1);

            let stateInfo = vis.stateInfo.find(state => state.state === d.properties.name);

            let tooltipContent = `
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                    <h3>${d.properties.name}</h3>
                    <h4>Population: ${stateInfo.population}</h4>
                    <h4>Absolute Cases: ${stateInfo.absCases}</h4>
                    <h4>Absolute Deaths: ${stateInfo.absDeaths}</h4>
                    <h4>Relative Cases: ${stateInfo.relCases.toFixed(2)}%</h4>
                    <h4>Relative Deaths: ${stateInfo.relDeaths.toFixed(2)}%</h4>
                </div>`;

            vis.tooltip.html(tooltipContent)
                .style("left", (event.pageX - 100) + "px")
                .style("top", (event.pageY - 50) + "px");
        }).on('mouseout', function (event, d) {
            d3.select(this)
                .attr('stroke-width', '1px');
            vis.tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    }

}
*/
