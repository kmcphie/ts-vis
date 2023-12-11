/* * * * * * * * * * * * * *
*      Dash Bar          *
* * * * * * * * * * * * * */

//Bars showing number of medals per year and event for selected country in dashboard
// Example of listening for the custom event
document.addEventListener('artistSelected', event => {
    selArtist = event.detail;
    console.log('Selected Artist in Bar Graph:', selArtist);

    winBar.updateData(selArtist);

    // Perform actions based on the selected artist, e.g., update bar graphs
});

class WinBar {

    constructor(parentElement, grammyData) {
        this.parentElement = parentElement;
        this.data = grammyData;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");
        this.selArtist = selArtist

        // console.log(this.selArtist)

        this.initVis()
    }

    initVis() {
        let vis = this;


        // margin convention with static height and responsive/variable width

        console.log(document.getElementById(vis.parentElement).getBoundingClientRect().width);

        vis.margin = {top: 250, right: 30, bottom: 250, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // add title
        vis.svg.append('g')
            .attr('class', 'plain-text bar-title')
            .append('text')
            .text('Click an artist to see their nominations by year')
            .attr('fill', 'white')
            .attr('transform', `translate(${vis.width / 2}, ${vis.height + 75})`)
            .attr('text-anchor', 'middle');


        // Create scales and axes
        // add x scale
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(vis.width/5000)
            .paddingOuter(vis.width/5000);

        // add y scale
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // add xaxis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        // add y axis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d3.format("d"));

        // create axis groups
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis axisWhite")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis axisWhite");

        // add tooltip area
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

    }

    updateData(selArtist) {
        this.selArtist = selArtist;
        this.svg.select('.bar-title text')
            .text(`Total Grammy Nominations of ${selArtist}`);
        this.wrangleData();
    }


    // Collect data for number of medals by year and event for country
    wrangleData() {
        let vis = this;

        // Filter data for the selected artist
        vis.filtData = vis.data.filter(row => row.Artist === vis.selArtist);

        vis.displayData = [];
        vis.filtData.forEach(row => {
            let val = row.Year; // Assuming 'Year' is the column for the year, change it accordingly

            let valObj = {};
            let existing = vis.displayData.find(d => d.year === val);

            if (!existing) {
                valObj.year = val;
                valObj.count = 1
                // valObj.won_count = row.Winner === 'TRUE' ? 1 : 0; // Check if the entry is a winner
                // valObj.won_count = row.Winner === 'FALSE' ? 1 : 0;
                vis.displayData.push(valObj);
            } else {
                existing.count += 1
                // existing.won_count += row.Winner === 'TRUE' ? 1 : 0; // Check if the entry is a winner
            }
        });

        console.log(vis.displayData)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update domains
        vis.y.domain([0, d3.max(vis.displayData, d => d.count)]);
        vis.x.domain(d3.range(2000, 2020).map(String));

        console.log(vis.displayData)

        // Add bars using enter, update, exit methods
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.displayData, d => d.year);

        vis.bars.exit().remove();

        vis.bars.enter().append("rect")
            .attr("class", "bar")
            .merge(vis.bars)
            .attr("fill", "white")
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style('fill', '#F08080FF');
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .html(`<p><strong>${d.year}</strong></p>
                    <p> Wins: ${d.count}</p>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .style('fill', '#fff')
                    .style("opacity", 1);

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .duration(1000)
            .attr("x", d => vis.x(d.year))
            .attr("y", d => vis.y(d.count))
            .attr("width", vis.x.bandwidth())
            // .attr("height", d => Math.max(0, vis.height - vis.y(d.won_count)))
            .attr("height", d => {
                const height = vis.height - vis.y(d.count);
                console.log(`Height for ${d.year}: ${height}`);
                return Math.max(0, height);
            })

        // Call axis functions with the new domain
        vis.xAxisGroup
            .transition()
            .duration(1000)
            .call(vis.xAxis)
            .selectAll('text')
            .attr('x', '-0.5em')
            .attr('y', '0.2em')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-45)')
            .attr('fill', 'white');

        vis.yAxisGroup
            .transition()
            .duration(1000)
            .call(vis.yAxis);
    }
}