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
        this.albumThemeCount = albumThemeCount

        this.initVis()
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    initVis() {
        let vis = this;

        // // Add an id attribute to the parent element
        // d3.select("#" + vis.parentElement)
        //     .attr("id", "cluster-vis-container");
        //
        // // Use Intersection Observer to trigger the action when the element is in the viewport
        // const clusterVisContainer = document.getElementById("cluster-vis-container");
        //
        // const observer = new IntersectionObserver((entries, observer) => {
        //     entries.forEach(entry => {
        //         if (entry.isIntersecting) {
        //             // The cluster graph is in the viewport, trigger your action
        //             vis.wrangleData();
        //             observer.unobserve(entry.target);
        //         }
        //     });
        // }, { threshold: 0.5 }); // Adjust the threshold as needed
        //
        // observer.observe(clusterVisContainer);

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

                vis.showThemeLyrics(event, d, false);
            });

        // Set up the simulation tick
        simulation.on("tick", () => {
            nodes.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }

    initAlbumClusters() {
        let vis = this;

        console.log(vis.albumThemeCount);

        // clear out the nodes & the svg space
        vis.svg.selectAll(".node").remove();
        d3.select(".lyric-text").remove();
        d3.select("#" + vis.parentElement + " svg").remove();
        d3.select(".theme-button").remove();

        console.log("cleared!")

        // margin conventions
        vis.margins = {
            'top': 100,
            'bottom': 25,
            'left': 20,
            'right': 10
        };

        // vis.width = $("#taylor-swift").width() + 30 - vis.margins.left - vis.margins.right;
        vis.height = 400 - vis.margins.top;

        // Create a tooltip
        vis.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .attr("background-color", "FFF")
            .style("opacity", 0);

        vis.albums = ["Taylor Swift", "Fearless", "Speak Now", "Red", "1989", "reputation", "Lover", "folklore", "evermore", "Midnights"]


        vis.albums.forEach((d,i) => {
            let albumId = d.replace(/\s+/g, '-').toLowerCase();
            if (albumId === '1989') {
                albumId = 'I989';
            }

            vis.width = $("#" + albumId).width() + 30 - vis.margins.left - vis.margins.right;

            // initialize svg
            vis.svg = d3.select("#" + albumId).append("svg")
                .attr("width", vis.width)
                .attr("height", vis.height)
                .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

            vis.displayData = vis.albumThemeCount.filter(d => d.album === vis.albums[i])

            // Scale function for node radii
            let radiusExtent = d3.extent(vis.displayData, function (d) {
                return d.count;
            });

            let radiusScale = d3.scaleLinear()
                .domain(radiusExtent)
                .range([5, 30]);

            // Append album title text
            vis.svg.append("text")
                .attr("class", "album-title")
                .attr("x", vis.width / 2)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .text(vis.albums[i]);

            // Create a force simulation
            const simulation = d3.forceSimulation(vis.displayData)
                .force("center", d3.forceCenter(vis.width / 2, vis.height / 2)) // Center the simulation
                .force("x", d3.forceX().strength(0.1).x(vis.width)) // Adjust strength and position as needed
                .force("y", d3.forceY().strength(0.1).y(vis.height)) // Adjust strength and position as needed
                .force("collide", d3.forceCollide().radius(d => radiusScale(d.count) + 2).strength(0.2)); // Adjust radius and strength as needed

            // Draw nodes
            const nodes = vis.svg.selectAll(".node")
                .data(vis.displayData)
                .enter().append("circle")
                .attr("class", "node")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => radiusScale(d.count))
                .attr("fill", d => taylorColors[d.index])
                .on("mouseover", function (event, d) {
                    // Show tooltip on hover
                    vis.tooltip
                        .style("opacity", 0.9);

                    // Update tooltip content and style
                    vis.tooltip.html(`<strong>${d.theme}</strong><br>${d.count} mentions`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY + 10) + "px")

                    // increase radius
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", d => radiusScale(d.count) * 1.1)
                })
                .on("mouseout", function (d) {
                    // reduce radius back down to size
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", d => radiusScale(d.count))
                        .style("stroke-width", 0)

                    // Hide tooltip on mouseout
                    vis.tooltip
                        .style("opacity", 0)
                        .html(``)

                })
                .on("click", function (event, d) {
                    d3.select(".lyric-text").remove();
                    // console.log("cluster click!")
                    // console.log(d);

                    vis.showThemeLyrics(event, d, true);
                });

            // Set up the simulation tick
            simulation.on("tick", () => {
                nodes.attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });

        })
    }

    // Function to show example lyrics in a side box
    showThemeLyrics(event, d, bool) {
        let vis = this;

        // Select or create a side box element
        const lyricBox = d3.select("#theme-details-box")
            .append("div")
            .attr("class", "lyric-text")
            .style("background", "#FFA07AFF")


        let lyricData = vis.lyricThemeData
        //console.log(lyricData);

        // filter data either just by theme or also by theme and album
        let filteredLyrics = lyricData.filter(entry => {
            if (bool) {
                return entry.Theme === d.theme & entry.Album === d.album
            } else {
                return entry.Theme === d.theme
            }
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
}

function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}