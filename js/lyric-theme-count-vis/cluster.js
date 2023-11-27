/* * * * * * * * * * * * * *
*         Cluster          *
* * * * * * * * * * * * * */

class ClusterVis {
    constructor(parentElement, themeCountData) {
        this.parentElement = parentElement;
        this.themeCountData = themeCountData;

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

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'theme-cluster-title')
            .append('text')
            .text('Whats on your mind, Taylor?')
            .attr('transform', `translate(${vis.width / 2}, ${vis.margin.top * 3})`)
            .attr('text-anchor', 'middle');

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Scale function for node radii
        let radiusExtent = d3.extent(vis.themeCountData, function(d) {
            return d.item_count;
        });

        let radiusScale = d3.scaleLinear()
            .domain(radiusExtent)
            .range([10,100]);

        // Create a force simulation
        const simulation = d3.forceSimulation(vis.themeCountData)
            .force("center", d3.forceCenter(vis.width / 2, vis.height / 2)) // Center the simulation
            .force("x", d3.forceX().strength(0.1).x(vis.width / 4)) // Adjust strength and position as needed
            .force("y", d3.forceY().strength(0.1).y(vis.height / 2)) // Adjust strength and position as needed
            .force("collide", d3.forceCollide().radius(d => radiusScale(d.item_count) + 5).strength(0.2)); // Adjust radius and strength as needed

        // Generate a random color from the color palette
        function getRandomColor() {
            const colors = ["#5DA271", "#88D9E6", "#41337A", "#775B59", "#9D1111", "#050947", "#59656F", "#FFA5B0", "#191919", "#FFE381"];
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
        }

        // Create a tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .attr("background-color", "FFF")
            .style("opacity", 0);

        // Draw nodes
        const nodes = vis.svg.selectAll(".node")
            .data(vis.themeCountData)
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => radiusScale(d.item_count))
            .attr("fill", d => getRandomColor())
            .on("mouseover", function (event, d) {
                // Show tooltip on hover
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                // Update tooltip content and style
                tooltip.html(`<strong>${d.theme}</strong><br>${d.description}<br>${d.item_count} mentions`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("background-color", "white")
                    .style("padding", "8px")
                    .style("border", "1px solid #ccc");
            })
            .on("mouseout", function (d) {
                // Hide tooltip on mouseout
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });;

        // Set up the simulation tick
        simulation.on("tick", () => {
            nodes.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }
}