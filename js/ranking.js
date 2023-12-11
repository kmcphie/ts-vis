document.addEventListener("DOMContentLoaded", function() {

    const triggerElement = document.getElementById("chart-trigger");



    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // If the trigger element is in the viewport, initialize and draw the chart
                initializeChart();
                // Disconnect the observer since we only need it once
                observer.disconnect();
            }
        });
    });

    // Start observing the trigger element
    observer.observe(triggerElement);

    function initializeChart() {

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


        if (navigator.userAgent.search("MSIE") >= 0) {
            d3.selectAll(".transline").style("stroke-dasharray", "0px").style("stroke-dashoffset", "0px");
        } //IE can't animate stroke - needs this disabled.


        // var ww = d3.select(".wrapper").node().offsetWidth;
        var margin = { top: 50, right: 20, bottom: 50, left: 150 },
            width = 1250 - margin.right - margin.left,
            height = 600 - margin.top - margin.bottom;


        var x = d3.scaleLinear()
            .range([width, 0]);

        var y = d3.scaleLinear()
            .domain([100, 1])  // Adjust this based on your data
            .range([0, height]);


        var color = d3.scaleOrdinal(d3.schemeCategory10);


        var xAxis = d3.axisBottom(x)
            .ticks(6)
            .tickSize(10)  // Increase the inner tick size
            .tickSizeOuter(0)  // Hide the outer ticks
            .tickFormat(d3.format("d"));



        var yAxis = d3.axisLeft(y);

        var line = d3.line()
            .curve(d3.curveCardinal)
            .x(function(d) { return x(+d.year); })
            .y(function(d) { return y(+d.ranking); });

        var svg = d3.select("#at-large").append("svg")
            .attr("id", "travel-chart")
            .attr("width", width + margin.left + margin.right + 200)  // Increase the width by 200 (adjust as needed)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var artists;

        var data = [
            {
                "year": 2017,
                "Morgan-Wallen": 100,
                "SZA": 53,
                "Taylor-Swift": 16,
                "Drake": 5,
                "Luke-Combs": 48,
                "Miley-Cyrus": 86,
                "Zach-Bryan": 100,
                "Savage": 30,
                "Weeknd": 8,
                "Bailey-Zimmerman": 100,
                "Olivia-Rodrigo": 100,
                "Travis-Scott": 32,
                "Ice-Spice": 100,
                "Lil-Uzi-Vert": 6,
                "Chris-Brown": 50,
                "Post-Malone": 14,
                "Nicki-Minaj": 57,
                "Jelly-Roll": 100
            },
            {
                "year": 2018,
                "Morgan-Wallen": 100,
                "SZA": 46,
                "Taylor-Swift": 20,
                "Drake": 1,
                "Luke-Combs": 48,
                "Miley-Cyrus": 100,
                "Zach-Bryan": 100,
                "Savage": 27,
                "Weeknd": 33,
                "Bailey-Zimmerman": 100,
                "Olivia-Rodrigo": 100,
                "Travis-Scott": 13,
                "Ice-Spice": 100,
                "Lil-Uzi-Vert": 71,
                "Chris-Brown": 81,
                "Post-Malone": 2,
                "Nicki-Minaj": 21,
                "Jelly-Roll": 100
            },
            {
                "year": 2019,
                "Morgan-Wallen": 51,
                "SZA": 36,
                "Taylor-Swift": 13,
                "Drake": 11,
                "Luke-Combs": 18,
                "Miley-Cyrus": 60,
                "Zach-Bryan": 44,
                "Savage": 38,
                "Weeknd": 1,
                "Bailey-Zimmerman": 53,
                "Olivia-Rodrigo": 65,
                "Travis-Scott": 7,
                "Ice-Spice": 80,
                "Lil-Uzi-Vert": 97,
                "Chris-Brown": 29,
                "Post-Malone": 1,
                "Nicki-Minaj": 100,
                "Jelly-Roll": 41
            },
            {
                "year": 2020,
                "Morgan-Wallen": 18,
                "SZA": 5,
                "Taylor-Swift": 22,
                "Drake": 8,
                "Luke-Combs": 23,
                "Miley-Cyrus": 61,
                "Zach-Bryan": 43,
                "Savage": 74,
                "Weeknd": 1,
                "Bailey-Zimmerman": 26,
                "Olivia-Rodrigo": 38,
                "Travis-Scott": 13,
                "Ice-Spice": 77,
                "Lil-Uzi-Vert": 16,
                "Chris-Brown": 27,
                "Post-Malone": 14,
                "Nicki-Minaj": 83,
                "Jelly-Roll": 48
            },
            {
                "year": 2021,
                "Morgan-Wallen": 10,
                "SZA": 26,
                "Taylor-Swift": 25,
                "Drake": 2,
                "Luke-Combs": 11,
                "Miley-Cyrus": 6,
                "Zach-Bryan": 42,
                "Savage": 8,
                "Weeknd": 3,
                "Bailey-Zimmerman": 11,
                "Olivia-Rodrigo": 1,
                "Travis-Scott": 33,
                "Ice-Spice": 14,
                "Lil-Uzi-Vert": 16,
                "Chris-Brown": 49,
                "Post-Malone": 18,
                "Nicki-Minaj": 40,
                "Jelly-Roll": 91
            },
            {
                "year": 2022,
                "Morgan-Wallen": 5,
                "SZA": 31,
                "Taylor-Swift": 6,
                "Drake": 8,
                "Luke-Combs": 23,
                "Miley-Cyrus": 61,
                "Zach-Bryan": 42,
                "Savage": 73,
                "Weeknd": 14,
                "Bailey-Zimmerman": 11,
                "Olivia-Rodrigo": 38,
                "Travis-Scott": 13,
                "Ice-Spice": 15,
                "Lil-Uzi-Vert": 16,
                "Chris-Brown": 17,
                "Post-Malone": 20,
                "Nicki-Minaj": 40,
                "Jelly-Roll": 91
            },
            {
                "year": 2023,
                "Morgan-Wallen": 1,
                "SZA": 2,
                "Taylor-Swift": 3,
                "Drake": 4,
                "Luke-Combs": 5,
                "Miley-Cyrus": 6,
                "Zach-Bryan": 7,
                "Savage": 8,
                "Weeknd": 10,
                "Bailey-Zimmerman": 11,
                "Olivia-Rodrigo": 12,
                "Travis-Scott": 13,
                "Ice-Spice": 14,
                "Metro-Boomin": 15,
                "Lil-Uzi-Vert": 16,
                "Chris-Brown": 17,
                "Post-Malone": 18,
                "Nicki-Minaj": 19,
                "Jelly-Roll": 20

            }
        ];

        color.domain(Object.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = +d.year;
        });

        artists = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {year: d.year, ranking: +d[name]};
                })
            };
        });


        console.log(artists)
        //
        var MorganWallen = artists[0];
        var SZA = artists[1];
        var TaylorSwift = artists[2];
        var Drake = artists[3];
        var LukeCombs = artists[4];
        var MileyCyrus = artists[5];
        var ZachBryan = artists[6];
        var Savage = artists[7];
        var Weeknd = artists[8];
        var Bailey = artists[9];
        var Olivia = artists[10];
        var Travis = artists[11];
        var Ice = artists[12];
        var LilUzi = artists[13];
        var ChrisBrown = artists[14];
        var PostMalone = artists[15];
        var NickiMinaj = artists[16];
        var JellyRoll = artists[17];


        x.domain(d3.extent(data, function(d) { return d.year; }))
            .range([0, width]);

        y.domain([
            d3.min(artists, function(c) { return d3.min(c.values, function(v) { return v.ranking; }); }),
            d3.max(artists, function(c) { return d3.max(c.values, function(v) { return v.ranking; }); })
        ]);


        svg.append("g")
            .attr("class", "x axis-1")
            .attr("transform", "translate(0," + 1.05 * height + ")")
            .call(xAxis)
            .append("text") // X-axis label
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 70) // Adjust the position as needed
            .style("text-anchor", "middle")
            // .style("font-size", "24px")
            .text("Years")
            .attr("fill", "#a651a6");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text") // Y-axis label
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 80) // Adjust the position as needed
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            // .style("font-size", "24px")
            .text("Billboard Rankings")
            .attr("fill", "#a651a6");

        // Modify the font family of X-axis tick labels
        // Modify the font size of X-axis tick labels
        svg.selectAll(".x.axis-1 text")
            .style("font-family", "'Century Gothic', sans-serif")
            .style("font-size", "20px");  // Adjust the font size as needed

// Modify the font size of Y-axis tick labels
        svg.selectAll(".y.axis text")
            .style("font-family", "'Century Gothic', sans-serif")
            .style("font-size", "24px");  // Adjust the font size as needed

// Modify the font size of Billboard rankings and years
        svg.selectAll(".axis-label")
            .style("font-family", "'Century Gothic', sans-serif")
            .style("font-size", "40px")  // Adjust the font size as needed
            .attr("fill", "#a651a6");  // Assuming you want the same fill color

        var person = svg.selectAll(".person")
            .data(artists)
            .enter().append("g")
            .attr("class", "city");

        person.append("path")
            .attr("class", "transline")
            .attr('fill', 'none')
            .attr("id", function(d) { return d.name; }) // ID of transport type
            .attr("d", function(d) {
                console.log(d)
                return line(d.values);
            }) //data of all Y values
            .attr("id", function (d) { return d.name; })
            .attr("d", function (d) { return line(d.values); });

        // Modify the font size of X-axis tick labels
        svg.selectAll(".x.axis-1 text")
            .style("font-size", "24px");  // Adjust the font size as needed

// Modify the font size of Y-axis tick labels
        svg.selectAll(".y.axis text")
            .style("font-size", "24px");  // Adjust the font size as needed




        var handleLine = svg.append("rect")
            .attr("class", "line")
            .attr("height", (height + 20))
            .attr("transform", "translate(0,-5)")
            .attr("width", 2)
            .attr("fill", "#FFF");

        var handleText = svg.append("text")
            .style("fill", "#FFF")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .attr("transform", "translate(1," + (height + 40) + ")");

        var graph = svg.select("g.graph");

        var lines = graph.select('g.line-container')
            .selectAll('path.line').data(data);

        lines.enter()
            .append('path')
            .attr('class', function(d, i) {
                return 'line' + d.key;
            })
            .attr('fill', 'none')
            .attr('stroke', function(d, i) {
                return color(i);
            })
            .attr('d', function(d) {
                return line(d.values);
            });

        // ** Create a invisible rect for mouse tracking
        var hoverRect = svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', "none")
            .style('pointer-events', 'all');


        var tooltip = d3.select("#at-large #travel-chart").append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);

        // Append overlay rectangle for mouse tracking
        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', function() {
                tooltip.transition().duration(200).style('opacity', 1);
            })
            .on('mouseout', function() {
                tooltip.transition().duration(200).style('opacity', 0);
                d3.selectAll(".transline").classed("selected-line", false);
            })
            .on('mousemove', mouseMove);

        // Assuming 'artists' is an array containing artist names
        var artistSelect = d3.select("#artist-select");

        artistSelect
            .selectAll("option")
            .data(artists)
            .enter()
            .append("option")
            .text(function (d) {
                // Check if the name contains a dash
                if (d.name.includes("-")) {
                    // If it contains a dash, return the name without the dash
                    return d.name.replace("-", " ");
                } else {
                    // If it doesn't contain a dash, return the original name
                    return d.name;
                }
            })
            .attr("value", function (d) {
                return d.name;
            });



        artistSelect.on("change", function () {
            var selectedArtist = this.value;

            // Hide all lines
            d3.selectAll(".transline").style("display", "none");

            // Show the selected artist and Taylor Swift lines
            d3.select("#" + selectedArtist).style("display", "block");
            d3.select("#Taylor-Swift").style("display", "block");
        });


        // Add a button for resetting to show all lines
        d3.select("#reset-btn")
            .on("click", function () {
                // Show all lines
                d3.selectAll(".transline")
                    .style("display", "block");
            });

        svg.append("svg:image")
            .attr("xlink:href", "https://i.imgur.com/HvwKdCU.png") // Replace with the direct link to the image file
            .attr("width", 80)
            .attr("height", 80)
            .attr("class", "taylor-swift-image")
            .attr("x", 0)
            .attr("y", -20);


        // Add a transition for the image to move along the path
        svg.selectAll(".taylor-swift-image")
            .transition()
            .duration(6000) // Adjust the duration of the animation
            .attrTween("transform", translateAlong(svg.select("#Taylor-Swift.transline").node()))
            .on("end", function () {
                // Animation complete, you can add additional logic here if needed
            });


// Function to create the animation along the path
        function translateAlong(path) {
            var l = path.getTotalLength();
            return function (i) {
                return function (t) {
                    var p = path.getPointAtLength(t * l);
                    return "translate(" + p.x + "," + p.y +  ")";
                };
            };
        }



        function mouseMove(event) {
            var mouseX = d3.pointer(event)[0];

            // Check if mouse is over any path
            var hoveredPath = getHoveredPath(mouseX);

            if (hoveredPath) {
                var artistName = hoveredPath.id;

                // Display tooltip with artist name
                tooltip.html(artistName)
                    .style('left', (mouseX + 'px'))
                    .style('top', (y(hoveredPath.values[0].ranking) + 'px'));

                // Highlight the hovered line
                d3.selectAll(".transline").classed("selected-line", false);
                d3.select("#" + artistName).classed("selected-line", true);
            } else {
                // If not over any path, hide the tooltip and remove highlighting
                tooltip.style('visibility', 'hidden');
                d3.selectAll(".transline").classed("selected-line", false);
            }
        }

        function getHoveredPath(mouseX) {
            // Iterate through paths and check if mouse is over any path
            for (var i = 0; i < artists.length; i++) {
                var path = d3.select("#" + artists[i].name).node();
                if (isMouseOverPath(path, mouseX)) {
                    console.log(artists[i])
                    return artists[i];
                }
            }

            return null;
        }

        function isMouseOverPath(path, mouseX) {
            var pathLength = path.getTotalLength();
            var tolerance = 5; // Adjust the tolerance as needed

            for (var i = 0; i < pathLength; i += 1) {
                var point = path.getPointAtLength(i);
                if (Math.abs(point.x - mouseX) < tolerance) {
                    return true;
                }
            }

            return false;
        }

    }



});

