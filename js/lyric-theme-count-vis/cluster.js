/* * * * * * * * * * * * * *
*         Cluster          *
* * * * * * * * * * * * * */

const taylorColors = [
    "#FF8C94", "#FFE5E2", "#D4A5A5", "#FFD3B5", "#FFB6C1", "#FFDAB9", "#DAA520",
    "#F0E68C", "#FFE4E1", "#F08080", "#FF6347", "#CD5C5C", "#FF69B4", "#9370DB",
    "#DDA0DD", "#FFB6C1", "#FFA07A", "#FFD700", "#FAEBD7", "#F5F5DC", "#FFE4B5",
    "#FFF8DC", "#8B4513", "#D2B48C", "#C71585", "#A52A2A", "#CD853F", "#D2691E",
    "#F5DEB3", "#FFA07A", "#8A2BE2", "#FF4500", "#FF6347", "#FF1493", "#FFD700",
    "#FF8C00", "#8B008B", "#800080", "#4B0082", "#8B0000", "#B22222", "#DC143C",
    "#DB7093", "#800000", "#A52A2A", "#D3A1D9", "#FFD9EC", "#FFC0CB", "#FF7F9E", "#FF6B8B",
    "#FF5252", "#E43977", "#FFB7C5", "#FF769F", "#FF5A77",
    "#FF2B50", "#FA336C", "#FFABC9", "#E63980", "#FF668F",
    "#FF4E6E", "#FF0040", "#B3E0F2", "#9AD8EA", "#81D0E2", "#68C8DA", "#4FC0D2",
    "#36B8CA", "#1DADC2", "#0CA3BA", "#0092A7", "#007C8F",
    "#B7E1CD", "#A3D8C0", "#8FD0B3", "#7AC8A6", "#66C099",
    "#52B88C", "#3EA17E", "#2E8F6B", "#217B59", "#1A6747"
];

class ClusterVis {
    constructor(parentElement, themeCountData, lyricThemeData, albumThemeCount) {
        this.parentElement = parentElement;
        this.themeCountData = themeCountData;
        this.lyricThemeData = lyricThemeData;
        this.albumThemeCount = albumThemeCount;

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 20, right: 0, bottom: 20, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log(vis.width);

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
        let radiusExtent = d3.extent(vis.themeCountData, function (d) {
            return d.item_count;
        });

        let radiusScale = d3.scaleLinear()
            .domain(radiusExtent)
            .range([10, 100]);

        // Create a force simulation
        const simulation = d3.forceSimulation(vis.themeCountData)
            .force("center", d3.forceCenter(vis.width / 2, vis.height / 2)) // Center the simulation
            .force("x", d3.forceX().strength(0.1).x(vis.width / 4)) // Adjust strength and position as needed
            .force("y", d3.forceY().strength(0.1).y(vis.height / 2)) // Adjust strength and position as needed
            .force("collide", d3.forceCollide().radius(d => radiusScale(d.item_count) + 8).strength(0.2)); // Adjust radius and strength as needed

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
                    .html(``)

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

            let filteredLyrics = lyricData.filter(entry => {
                return entry.Theme === d.theme
            })
            // console.log(filteredLyrics);

            let len = filteredLyrics.length;

            let lyrics = [
                filteredLyrics[getRandomIndex(0, len)]
            ]

            lyricBox.selectAll(".lyric-text")
                .data(lyrics)
                .enter()
                .append("div") // Create a new div for each data point
                .attr("class", "lyric-text-child")
                .html(d => `<strong>${d.Song}</strong><br>${d.Lyric}`);
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

    initClusterAlbums() {
        let vis = this;

        // clear out the nodes & the svg space
        // IF TIME FIGURE OUT THE ANIMATION
        vis.svg.selectAll(".node").remove();
        d3.select(".lyric-text").remove();
        d3.select("#" + vis.parentElement + " svg").remove();

        // margin conventions
        vis.margin = {top: 30, right: 0, bottom: 20, left: 0};
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Define the number of rows and columns for the grid
        vis.numRows = 2;
        vis.numCols = 5;

        // Calculate the spacing between albums
        vis.spacingX = vis.width / (vis.numCols + 1);
        vis.spacingY = vis.height / (vis.numRows + 1);

        // define albums
        vis.albumPositions = [];
        vis.albumIds = [];
        vis.albumThemes = [];
        vis.albums = ["Taylor Swift", "Fearless", "Speak Now", "Red", "1989", "reputation", "Lover", "folklore", "evermore", "Midnights"]

        // init drawing area for each album
        vis.albums.forEach((d,i) => {
            var albumId = d.replace(/\s+/g, '-').toLowerCase();
            if (albumId === '1989') {
                albumId = 'I989';
            }
            vis.albumIds[i] = albumId;

            // Calculate the center for the current iteration
            const center = {
                x: (i % vis.numCols + 1) * vis.spacingX,
                y: Math.floor(i / vis.numCols) * vis.spacingY
            };

            //console.log(albumId);
            vis.albumPositions[i] = { x: center.x, y: center.y };

            // vis.albumSVG = d3.select("#" + vis.parentElement).append("svg")
            //     .attr("width", vis.spacingX)
            //     .attr("height", vis.spacingY)
            //     .attr("id", albumId)
            //     .attr('transform', `translate(${vis.albumPositions[i].x + vis.margin.left}, ${vis.albumPositions[i].y + vis.margin.top})`)
            //     .style("fill", "#FFF");

            d3.selectAll("#" + vis.albumIds[i]).append("svg")
                .attr("width", "100%")
                .attr("height", "30vh")
                .attr("class", "album-clusters mr-5 ml-5 mt-2 mb-2")
                .style("background", "white")

            vis.albumThemes[i] = vis.albumThemeCount.filter(d => d.album === vis.albums[i])
            console.log(vis.albumThemes[i]);
        })

        // cue album cluster graphs
        vis.clusterAlbums();
    }
    clusterAlbums() {
        let vis = this;
        console.log("yay! album clusters!")

        console.log(vis.albumThemes)
        console.log(vis.albumPositions)
        console.log(vis.albumIds)

        // Scale function for node radii
        let radiusExtent = d3.extent(vis.albumThemes, function (d) {
            return d.count;
        });

        let radiusScale = d3.scaleLinear()
            .domain(radiusExtent)
            .range([5, 30]);


        vis.albumThemes.forEach((d, i) => {
            // d is each individual albums themes & need to just create a cluster for each one
            console.log(d);

            const svg = d3.select("#" + vis.albumIds[i]).select("svg");

            // svg.selectAll(".node").data(d).enter().append("text").text("hello")

            // Create a force simulation
            const simulation = d3.forceSimulation(d)
                .force("center", d3.forceCenter(vis.spacingX / 2, vis.spacingY / 2)) // Center the simulation
                .force("charge", d3.forceManyBody().strength(-20)) // Adjust strength as needed
                .force("collide", d3.forceCollide().radius(d => radiusScale(d.count) + 5).strength(0.2)); // Adjust radius and strength as needed

            // Create nodes
            const nodes = d3.select("#" + vis.albumIds[i]).selectAll(".node")
                .data(d)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", d => radiusScale(d.count))
                .attr("fill", d => taylorColors[i]) // Replace with your color scale function
                // .call(d3.drag() // Enable dragging of nodes
                //     .on("start", dragstarted)
                //     .on("drag", dragged)
                //     .on("end", dragended));

            // Add labels to nodes
            // const labels = d3.select("#" + vis.albumIds[i]).selectAll(".label")
            //     .data(d)
            //     .enter().append("text")
            //     .attr("class", "label")
            //     .attr("dx", d => radiusScale(d.count) + 5)
            //     .attr("dy", d => -radiusScale(d.count) - 5)
            //     .text(d => d.theme);

            // ...

            // Define drag functions
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

        });

        }

    }