document.addEventListener("DOMContentLoaded", function() {

    if (navigator.userAgent.search("MSIE") >= 0) {
        d3.selectAll(".transline").style("stroke-dasharray", "0px").style("stroke-dashoffset", "0px");
    } //IE can't animate stroke - needs this disabled.

    var ww = d3.select(".wrapper").node().offsetWidth;
    var margin = { top: 20, right: 20, bottom: 50, left: 20 },
        width = ww - margin.right - margin.left,
        height = 360 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([width, 0]);

    var y = d3.scaleLinear()
        .range([height, 0]);

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
        .y(function(d) { return y(+d.people); });

    var svg = d3.select("#at-large").append("svg")
        .attr("id", "travel-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var transports;

    var data = [
        {
            "year":2018,
            "Taylor":1,
            "Doja Cat":2,
            "train":22531,
            "car":288875
        },
        {
            "year":2019,
            "bus":62185,
            "plane":41402,
            "train":22617,
            "car":288146
        },
        {
            "year":2020,
            "bus":48744,
            "plane":29084,
            "train":18553,
            "car":231808
        },
        {
            "year":2021,
            "bus":59231,
            "plane":39349,
            "train":25046,
            "car":308349
        },
        {
            "year":2022,
            "bus":68832,
            "plane":67064,
            "train":27497,
            "car":355731
        },
        {
            "year":2023,
            "bus":145197,
            "plane":89647,
            "train":51124,
            "car":652208
        }
    ];

    color.domain(Object.keys(data[0]).filter(function(key) { return key !== "year"; }));

    data.forEach(function(d) {
        d.year = +d.year;
    });

    transports = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return { year: d.year, people: +d[name] };
            })
        };
    });

    var bus = transports[0];
    var plane = transports[1];
    var train = transports[2];
    var car = transports[3];

    x.domain(d3.extent(data, function(d) { return d.year; }))
        .range([0, width]);

    y.domain([
        d3.min(transports, function(c) { return d3.min(c.values, function(v) { return v.people; }); }),
        d3.max(transports, function(c) { return d3.max(c.values, function(v) { return v.people; }); })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 1.05 * height + ")")
        .call(xAxis);

    var city = svg.selectAll(".city")
        .data(transports)
        .enter().append("g")
        .attr("class", "city");

    var p1 = city.append("path") //Add the 3 coloured lines for transport type
        .attr("class", "transline")
        .attr('fill', 'none')
        .attr("id", function(d) { return d.name; }) // ID of transport type
        .attr("d", function(d) { return line(d.values); }); //data of all Y values

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

    //** Create a invisible rect for mouse tracking
    var hoverRect = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', "none")
        .style('pointer-events', 'all');

    hoverRect
        .on('mousemove', mouseMove)
        .on('mouseout', mouseOut)
        .on('touchmove', mouseMove)
        .on('touchend', mouseOut);

    //** Init Tooltip
    var toolTip = d3.select("#at-large #travel-chart").append('div')
        .attr('class', 'chart-tooltip');

    function mouseMove(event) {
        var mouse = d3.pointer(event),
            mouseX = mouse[0],
            mouseY = mouse[1],
            value = Math.round(x.invert(mouseX)),
            valMap = value - 1; //map day - 1 for proper match (since array indexing starts at 0)
        if (value > 0) {
            var dayBus = data[valMap].bus;
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
        d3.select(".textB").text(dayBus.toLocaleString());
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
});

