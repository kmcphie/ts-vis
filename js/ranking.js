document.addEventListener("DOMContentLoaded", function() {

    if (navigator.userAgent.search("MSIE") >= 0) {
        d3.selectAll(".transline").style("stroke-dasharray", "0px").style("stroke-dashoffset", "0px");
    } //IE can't animate stroke - needs this disabled.


    // var ww = d3.select(".wrapper").node().offsetWidth;
    // var ww = 1290;
    // var margin = { top: 20, right: 20, bottom: 50, left: 20 },
    //     width = ww - margin.right - margin.left,
    //     height = 360 - margin.top - margin.bottom;

    var ww = d3.select(".wrapper").node().offsetWidth;
    var margin = { top: 50, right: 20, bottom: 50, left: 150 },
        width = 1400 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;


    var x = d3.scaleLinear()
        .range([width, 0]);

    var y = d3.scaleLinear()
        .domain([100, 1])  // Adjust this based on your data
        .range([0, height]);


    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = d3.axisBottom(x)
        .ticks(6)
        .tickSize(10, 0);

    if (ww < 700) {
        var xAxis = d3.axisBottom(x)
            .ticks(5)
            .tickSize(10, 0);
    }

    var yAxis = d3.axisLeft(y);

    var line = d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(+d.year); })
        .y(function(d) { return y(+d.ranking); });

    var svg = d3.select("#at-large").append("svg")
        .attr("id", "travel-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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


    // var taylor = transports[0];
    // var plane = transports[1];
    // var train = transports[2];
    // var car = transports[3];

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
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 1.05 * height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis); // Add y-axis

    var city = svg.selectAll(".city")
        .data(artists)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "transline")
        .attr('fill', 'none')

        .attr("id", function(d) { return d.name; }) // ID of transport type
        .attr("d", function(d) {
            console.log(d)
            return line(d.values);
        }) //data of all Y values
        .attr("id", function (d) { return d.name; })
        .attr("d", function (d) { return line(d.values); });

    var taylorSwiftLine = d3.select("#Taylor-Swift.transline");

    city.selectAll(".transline")
        .on("click", function(d) {
            // Remove the bold styling from all lines
            d3.selectAll(".transline").classed("selected-line", false);

            // Apply the bold styling to the clicked line
            d3.select(this).classed("selected-line", true);
        });

    var handleLine = svg.append("rect")
        .attr("class", "line")
        .attr("height", (height + 20))
        .attr("transform", "translate(0,-5)")
        .attr("width", 2)
        .attr("fill", "#FFF");

    var handle = svg.append("svg:image")
        .attr("xlink:href", "https://cdn-goeuro.com/static_content/web/Design/ball_indicator.svg") //christmas ball handle
        .attr("width", 34)
        .attr("height", 34)
        .attr("transform", "translate(-15," + (height + 15) + ")");

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

    // hoverRect
    //     .on('mousemove', mouseMove)
    //     .on('mouseout', mouseOut)
    //     .on('touchmove', mouseMove)
    //     .on('touchend', mouseOut);

    //** Init Tooltip
    // var toolTip = d3.select("#at-large #travel-chart").append('div')
    //     .attr('class', 'chart-tooltip');


    function mouseMove(event) {
        var mouse = d3.pointer(event),
            mouseX = mouse[0],
            mouseY = mouse[1],
            value = Math.round(x.invert(mouseX)),
            valMap = value - 1; //map day - 1 for proper match (since array indexing starts at 0)
        if (value > 0) {
            var dayTaylor = data[valMap].taylor;
            var dayTrain = data[valMap].train;
            var dayPlane = data[valMap].plane;
            var dayCar = data[valMap].car;
        }

        //** Display tool tip
        toolTip
            .style('visibility', 'visible')
            .style("left", (20 + mouseX + "px"))
            .style("top", (mouseY + "px"))
            .html(value + " December 2015<br/>Buses: <span class='textB'></span><br/>Trains: <span class='textT'></span><br/>Planes: <span class='textP'></span><br/>Cars: <span class='textC'></span>");

        handle
            .attr("x", (mouseX + "px"));

        handleText
            .attr("x", (mouseX + "px"))
            .html(value);

        handleLine
            .attr("x", (mouseX + "px"));

        //Don't smush tooltip on right edge:
        var leftLimit = width - 180;
        if (mouseX >= leftLimit) {
            toolTip.style("left",
                (mouseX - 140 + "px"));
        }

        //get daily values and print
        d3.select(".textB").text(dayTaylor.toLocaleString());
        d3.select(".textP").text(dayPlane.toLocaleString());
        d3.select(".textT").text(dayTrain.toLocaleString());
        d3.select(".textC").text(dayCar.toLocaleString());
    }

    function mouseOut() {
        toolTip.style('visibility', 'hidden');
        var totalBus = 0,
            totalTrain = 0,
            totalPlane = 0,
            totalCar = 0; //reset values
    }

    // function mouseMove(event) {
    //     var mouse = d3.pointer(event),
    //         mouseX = mouse[0],
    //         mouseY = mouse[1],
    //         value = Math.round(x.invert(mouseX)),
    //         valMap = value - 1; //map day - 1 for proper match (since array indexing starts at 0)
    //     if (value > 0) {
    //         // var dayTaylorSwift = data[valMap][TaylorSwift];
    //         // if (value > 0) {
    //         //     var dayMorganWallen = data[valMap][MorganWallen];
    //         //     var daySZA = data[valMap][SZA];
    //         //     var dayTaylorSwift = data[valMap][TaylorSwift];
    //         //     var dayDrake = data[valMap][Drake];
    //         //     var dayLukeCombs = data[valMap][LukeCombs];
    //         //     var dayMileyCyrus = data[valMap][MileyCyrus];
    //         //     var dayZachBryan = data[valMap][ZachBryan];
    //         //     var daySavage = data[valMap][Savage];
    //         //     var dayWeeknd = data[valMap][Weeknd];
    //         //     var dayBailey = data[valMap][Bailey];
    //         //     var dayOlivia = data[valMap][Olivia];
    //         //     var dayTravis = data[valMap][Travis];
    //         //     var dayIce = data[valMap][Ice];
    //         //     var dayLilUzi = data[valMap][LilUzi];
    //         //     var dayChrisBrown = data[valMap][ChrisBrown];
    //         //     var dayPostMalone = data[valMap][PostMalone];
    //         //     var dayNickiMinaj = data[valMap][NickiMinaj];
    //         //     var dayJellyRoll = data[valMap][JellyRoll];
    //         // }
    //     }
    //
    //     //** Display tool tip
    //     toolTip
    //         .style('visibility', 'visible')
    //         .style("left", (20 + mouseX + "px"))
    //         .style("top", (mouseY + "px"))
    //         .html(value + " December 2015<br/>Buses: <span class='textB'></span><br/>Trains: <span class='textT'></span><br/>Planes: <span class='textP'></span><br/>Cars: <span class='textC'></span>");
    //
    //     handle
    //         .attr("x", (mouseX + "px"));
    //
    //     handleText
    //         .attr("x", (mouseX + "px"))
    //         .html(value);
    //
    //     handleLine
    //         .attr("x", (mouseX + "px"));
    //
    //     //Don't smush tooltip on right edge:
    //     var leftLimit = width - 180;
    //     if (mouseX >= leftLimit) {
    //         toolTip.style("left",
    //             (mouseX - 140 + "px"));
    //     }
    //
    //     // //get daily values and print
    //     d3.select(".textB").text(dayTaylorSwift.toLocaleString());
    //     // d3.select(".textP").text(daySZA.toLocaleString());
    //     // d3.select(".textT").text(dayTrain.toLocaleString());
    //     // d3.select(".textC").text(dayCar.toLocaleString());
    // }
    //
    // function mouseOut() {
    //     toolTip.style('visibility', 'hidden');
    //     var totalBus = 0,
    //         totalTrain = 0,
    //         totalPlane = 0,
    //         totalCar = 0; //reset values
    // }

});

