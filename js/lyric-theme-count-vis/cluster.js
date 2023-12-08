/* * * * * * * * * * * * * *
*         Cluster          *
* * * * * * * * * * * * * */

class ClusterVis {
    constructor(parentElement, themeCountData, lyricThemeData) {
        this.parentElement = parentElement;
        this.themeCountData = themeCountData;
        this.lyricThemeData = lyricThemeData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 20, right: 0, bottom: 20, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

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
            .force("collide", d3.forceCollide().radius(d => radiusScale(d.item_count) + 8).strength(0.2)); // Adjust radius and strength as needed

        // Generate a random color from the color palette
        // function getRandomColor() {
        //     const colors = ["#5DA271", "#88D9E6", "#41337A", "#775B59", "#9D1111", "#050947", "#59656F", "#FFA5B0", "#191919", "#FFE381"];
        //     const randomIndex = Math.floor(Math.random() * colors.length);
        //     return colors[randomIndex];
        // }

        const taylorColors = [
            "#FF8C94", "#FFE5E2", "#D4A5A5", "#FFD3B5", "#FFB6C1", "#FFDAB9", "#DAA520",
            "#F0E68C", "#FFE4E1", "#F08080", "#FF6347", "#CD5C5C", "#FF69B4", "#9370DB",
            "#DDA0DD", "#FFB6C1", "#FFA07A", "#FFD700", "#FAEBD7", "#F5F5DC", "#FFE4B5",
            "#FFF8DC", "#8B4513", "#D2B48C", "#C71585", "#A52A2A", "#CD853F", "#D2691E",
            "#F5DEB3", "#FFA07A", "#8A2BE2", "#FF4500", "#FF6347", "#FF1493", "#FFD700",
            "#FF8C00", "#8B008B", "#800080", "#4B0082", "#8B0000", "#B22222", "#DC143C",
            "#DB7093", "#800000", "#A52A2A"
        ];

        // Define a color scale using D3
        // const colorScale = d3.scaleOrdinal()
        //     .domain(vis.themeCountData.map(d => d.index))


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
            .attr("fill", d => taylorColors[d.index])
            .on("mouseover", function (event, d) {
                // Show tooltip on hover
                tooltip
                    .style("opacity", 0.9);

                // Update tooltip content and style
                tooltip.html(`<strong>${d.theme}</strong><br>${d.description}<br>${d.item_count} mentions`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .style("color", "#1e1d1d")
                    .style("padding", "10px")
                    .style("border", "1px solid #ccc");

                // increase radius
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", d => radiusScale(d.item_count) * 1.1)
            })
            .on("mouseout", function (d) {
                // reduce radius back down to size
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", d => radiusScale(d.item_count))
                    .style("stroke-width", 0)

                // Hide tooltip on mouseout
                tooltip
                    .style("opacity", 0)

            })
            .on("click", function (event, d) {
                d3.select(".lyric-text").remove();

                // console.log("cluster click!")
                // console.log(d);

                showThemeLyrics(event, d);
            });

        // Function to show example lyrics in a side box
        function showThemeLyrics(event, d) {
            // Select or create a side box element
            const lyricBox = d3.select("#theme-details-box")
                .append("div")
                .attr("class", "lyric-text")
                .style("background", "#FFA07AFF")



            let lyricData = vis.lyricThemeData
            // console.log(lyricData);

            let filteredLyrics = lyricData.filter(entry => { return entry.Theme === d.theme })
            // console.log(filteredLyrics);

            let len = filteredLyrics.length;

            let lyrics = [
                filteredLyrics[getRandomIndex(0, len)]
            ]

            lyricBox.selectAll(".lyric-text")
                .data(lyrics)
                .enter()
                .append("text")
                .text(d => `${d.Song}: "${d.Lyric}"`)
                .attr("x", 20)
                .attr("y", (d, i) => 20 * (i + 1))
        }

        function getRandomIndex(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        // Set up the simulation tick
        simulation.on("tick", () => {
            nodes.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }
}