/* * * * * * * * * * * * * *
*      Tree Vis          *
* * * * * * * * * * * * * */
// based on https://d3-graph-gallery.com/graph/treemap_basic.html

//Shows countries sized based on number of medals earned
class TreeVis {

    constructor(parentElement, resultsData, continentData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right:20, bottom: 80, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Define colors
        vis.colors = {
            'Africa': '#FF5F15',
            'Asia': '#179a13',
            'Europe': '#3e76ec',
            'North America': '#ff0000',
            'Oceania': '#702963',
            'South America': '#ffce01',
        }


        vis.legendGroup = vis.svg.append('g')
            .attr('class',"legendgroup")
            .attr('transform', `translate(${vis.width/2}, 10)`)

        vis.rectGroup = vis.svg.append('g')
            .attr('class',"rectgroup")
            .attr('transform', `translate(0,${vis.height/12})`)

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        // initialize necessary structure for treemap and d3.stratify()
        vis.displayData = [
            {country: 'Origin', continent: '', medal_count: ''},
            {country: 'Europe', continent: 'Origin', medal_count: ''},
            {country: 'North America', continent: 'Origin', medal_count: ''},
            {country: 'Africa', continent: 'Origin', medal_count: ''},
            {country: 'Oceania', continent: 'Origin', medal_count: ''},
            {country: 'Asia', continent: 'Origin', medal_count: ''},
            {country: 'South America', continent: 'Origin', medal_count: ''},
        ]

        // loop through results and count by country, also map to continent
        vis.resultsData.forEach(row => {
                let nat = row.Nationality;
                let countryObj = {};
                let existing = vis.displayData.map(d => d.country);

                if (!(existing.includes(nat))) {
                    countryObj['country'] = nat;
                    let sel = vis.continentData.find(d => d.Code === nat)
                    let cont = ''
                    if(sel===undefined)
                        cont = 'N/A';
                    else
                        cont = sel.Continent;
                    countryObj['continent'] = cont
                    countryObj['medal_count'] = 1;
                    vis.displayData.push(countryObj)
                } else {
                    vis.displayData.find(d => d.country === nat).medal_count += 1;
                }
            }
        )


        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // credit to https://d3-graph-gallery.com/graph/treemap_basic.html
        vis.root = d3.stratify()
            .id(d=>d.country)
            .parentId(d=>d.continent)
            (vis.displayData)
            .sum(d => d.medal_count);

        d3.treemap()
            .size([vis.width, vis.height])
            .padding(3)
            (vis.root)

        vis.rects = vis.rectGroup.selectAll("rect")
            .data(vis.root.leaves());
        vis.rects.enter()
            .append("rect")
            .attr('class', 'tree-rect')
            .merge(vis.rects)
            .attr('width', d=>d.x1-d.x0)
            .attr('height', d=>d.y1-d.y0)
            .attr('x', d=>d.x0)
            .attr('y', d=>d.y0)
            .attr("stroke", "black")
            .attr("fill", d=>vis.colors[d.data.continent])
            .on('click', function(event, d) {
                if(d3.select(this).style('stroke-width') !== '2px') {
                    vis.svg.selectAll('.tree-rect')
                        .style('opacity', '0.4')
                    d3.select(this) // change color or selected country
                        .style('stroke-width', '2px')
                        .style('fill', d => vis.colors[d.data.continent])
                        .style('opacity', 1)
                    selCountry = d.data.country
                    document.getElementById("resetbutton").disabled = false;
                    dashMedals.wrangleData()
                    dashBar1.wrangleData()
                    dashBar2.wrangleData()
                }
                else{
                    resetToWorld();
                }
            })
        vis.rects.exit();

        vis.labels = vis.rectGroup.selectAll("text")
            .data(vis.root.leaves());
        vis.labels.enter()
            .append("text")
            .attr('class', 'label tree-rect-label')
            .merge(vis.labels)
            .attr("x", d=>d.x0+10)
            .attr("y", d=>d.y0+25)
            .text(function(d){
                if(d.data.medal_count > 18)
                    return d.data.country;
            })
            .attr('font-size', function(d){return Math.sqrt((Math.sqrt(d.data.medal_count)))/3.5+"vw"})

        vis.legendRects = vis.legendGroup.selectAll('.legend-rect')
            .data(Object.keys(vis.colors))
            .enter().append('rect')
            .attr('class', 'legend-rect')
            .attr('width', vis.width/50)
            .attr('height',vis.width/50)
            .attr('y', 0)
            .attr('x', function(d,index){return -3.1*vis.width/7.5+index*vis.width/7})
            .attr("fill", d=>vis.colors[d])
            .attr('stroke', 'black');

        vis.legendText = vis.legendGroup.selectAll('.legend-label')
            .data(Object.keys(vis.colors))
            .enter().append('text')
            .attr('class', 'legend-label')
            .attr('font-size', '0.9vw')
            .attr('fill', 'white')
            .attr('y', vis.width/75+2)
            .attr('x', function(d,index){return -3.1*vis.width/7.5+index*vis.width/7+vis.width/40})
            .text(d=>d)
    }

    resetColors() {
        let vis = this;
        vis.svg.selectAll('rect')
            .style('stroke-width', '1px')
            .style('opacity', 1)
    }
}