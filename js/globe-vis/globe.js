/* * * * * * * * * * * * * *
*         GlobeVis         *
* * * * * * * * * * * * * */

class GlobeVis {
    constructor(parentElement, tourData, geoData) {
        this.parentElement = parentElement;
        this.tourData = tourData;
        this.geoData = geoData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Where has Taylor Swift Toured?')
            .attr('transform', `translate(${vis.width / 2}, ${vis.margin.top * 3})`)
            .attr('text-anchor', 'middle');

        // projection
        vis.projection = d3.geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(120)

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#8fa8e5')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)


        // tooltip
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

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // data structure with information for each country
        vis.countryInfo = {};

        // Extract the country names from the GeoJSON data
        vis.geoData.objects.countries.geometries.forEach(d => {
            const originalName = d.properties.name;
            // Need to rename US to match the tourData
            if (originalName === "United States of America") {
                d.properties.name = "United States";
            }

            vis.countryInfo[d.properties.name] = {
                name: originalName,
                numTours: 0 // Initialize the count
            };
        });

        // Count the number of tours for each country
        vis.tourData.forEach(d => {
            const countryName = d.Country;
            if (vis.countryInfo[countryName]) {
                vis.countryInfo[countryName].numTours++;
            }
        });

        // Color scale definition
        vis.colorScale = d3.scaleQuantize()
            .domain([0, 314])
            .range(["#CBD5C0", "#9CAF88", "#707e62", "#606e56"]);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // vis.countries = vis.svg.selectAll(".country")
        //     .style("fill", "#749b6f");

        vis.countries.style("fill", d => {
            const countryName = d.properties.name;
            const numTours = vis.countryInfo[countryName] ? vis.countryInfo[countryName].numTours : 0;
            return vis.colorScale(numTours);
        });

        vis.countries.on("mouseover", function (event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'black')

            const countryName = d.properties.name;
            if (d.properties.name === "United States of America") {
                d.properties.name = "United States";
            }
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