// // // set the dimensions and margins of the graph
// // const margin = {top: 10, right: 10, bottom: 10, left: 10},
// //     widthtree = 445 - margin.left - margin.right,
// //     heighttree = 445 - margin.top - margin.bottom;
// //
// // // append the svg object to the body of the page
// // const svgtree = d3.select(".tree-vis")
// //     .append("svg")
// //     .attr("width", widthtree + margin.left + margin.right)
// //     .attr("height", heighttree + margin.top + margin.bottom)
// //     .append("g")
// //     .attr("transform",
// //         `translate(${margin.left}, ${margin.top})`);
// //
// // // Read data
// // d3.csv('data/wins.csv').then(function(data) {
// //
// //     // stratify the data: reformatting for d3.js
// //     const root = d3.stratify()
// //         .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
// //         .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
// //         (data);
// //     root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity
// //
// //     // Then d3.treemap computes the position of each element of the hierarchy
// //     // The coordinates are added to the root object above
// //     d3.treemap()
// //         .size([widthtree, heighttree])
// //         .padding(4)
// //         (root)
// //
// //     // use this information to add rectangles:
// //     svgtree
// //         .selectAll("rect")
// //         .data(root.leaves())
// //         .join("rect")
// //         .attr('x', function (d) { return d.x0; })
// //         .attr('y', function (d) { return d.y0; })
// //         .attr('width', function (d) { return d.x1 - d.x0; })
// //         .attr('height', function (d) { return d.y1 - d.y0; })
// //         .style("stroke", "black")
// //         .style("fill", "#69b3a2");
// //
// //     // and to add the text labels
// //     svgtree
// //         .selectAll("text")
// //         .data(root.leaves())
// //         .join("text")
// //         .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
// //         .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
// //         .text(function(d){ return d.data.name})
// //         .attr("font-size", "15px")
// //         .attr("fill", "white")
// // })
//
// class TreeVis {
//
//     constructor(parentElement, winsData) {
//         this.parentElement = parentElement;
//         this.winsData = winsData;
//         // this.continentData = continentData;
//
//         this.initVis()
//
//         console.log("tree initiated")
//     }
//
//     initVis() {
//         let vis = this;
//
//         // margin convention with static height and responsive/variable width
//         vis.margin = {top: 20, right:20, bottom: 80, left: 20};
//         console.log('vis.parentElement:', vis.parentElement);
//
//         vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
//         vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
//
//         // // SVG drawing area
//         vis.svg = d3.select("#" + vis.parentElement).append("svg")
//             .attr("width", vis.width + vis.margin.left + vis.margin.right)
//             .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
//             .append("g")
//             .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
//
//
//         // Define colors
//         vis.colors = {
//             // 'Africa': '#FF5F15',
//             // 'Asia': '#179a13',
//             // 'Europe': '#3e76ec',
//             // 'North America': '#ff0000',
//             // 'Oceania': '#702963',
//             'gender': '#ffce01',
//         }
//
//
//         vis.legendGroup = vis.svg.append('g')
//             .attr('class',"legendgroup")
//             .attr('transform', `translate(${vis.width/2}, 10)`)
//
//         vis.rectGroup = vis.svg.append('g')
//             .attr('class',"rectgroup")
//             .attr('transform', `translate(0,${vis.height/12})`)
//
//         vis.wrangleData()
//     }
//
//
//
//     wrangleData() {
//         let vis = this;
//
//         // initialize necessary structure for treemap and d3.stratify()
//         vis.displayData = [
//             {artist: 'Origin', gender: '', win_count: ''},
//             {artist: 'Female', gender: 'Origin', win_count: ''},
//             {artist: 'Male', gender: 'Origin', win_count: ''},
//         ]
//
//         // loop through results and count by country, also map to continent
//         // vis.winsData.forEach(row => {
//         //         let nat = row.Nationality;
//         //         let countryObj = {};
//         //         let existing = vis.displayData.map(d => d.country);
//         //
//         //         if (!(existing.includes(nat))) {
//         //             countryObj['country'] = nat;
//         //             let sel = vis.continentData.find(d => d.Code === nat)
//         //             let cont = ''
//         //             if(sel===undefined)
//         //                 cont = 'N/A';
//         //             else
//         //                 cont = sel.Continent;
//         //             countryObj['continent'] = cont
//         //             countryObj['medal_count'] = 1;
//         //             vis.displayData.push(countryObj)
//         //         } else {
//         //             vis.displayData.find(d => d.country === nat).medal_count += 1;
//         //         }
//         //     }
//         // )
//
//         vis.displayData = [];
//
// // Loop through results
//         vis.winsData.forEach(row => {
//             let artist = row.artist;
//             let gender = row.gender;
//             let wins = row.wins;
//
//             // Find existing entry for the artist
//             let existingEntry = vis.displayData.find(entry => entry.artist === artist);
//
//             if (!existingEntry) {
//                 // If artist entry doesn't exist, create a new entry
//                 vis.displayData.push({
//                     artist: artist,
//                     gender: gender,
//                     wins: wins
//                 });
//             } else {
//                 // If artist entry exists, update the wins
//                 existingEntry.wins += wins;
//             }
//         });
//
//         console.log(vis.displayData)
//
//         vis.updateVis()
//     }
//
//
//
//     updateVis() {
//         let vis = this;
//
//         // credit to https://d3-graph-gallery.com/graph/treemap_basic.html
//         vis.root = d3.stratify()
//             .id(d=>d.artist)
//             .parentId(d=>d.gender)
//             (vis.displayData)
//             .sum(d => d.win_count);
//
//         d3.treemap()
//             .size([vis.width, vis.height])
//             .padding(3)
//             (vis.root)
//
//         vis.rects = vis.rectGroup.selectAll("rect")
//             .data(vis.root.leaves());
//         vis.rects.enter()
//             .append("rect")
//             .attr('class', 'tree-rect')
//             .merge(vis.rects)
//             .attr('width', d=>d.x1-d.x0)
//             .attr('height', d=>d.y1-d.y0)
//             .attr('x', d=>d.x0)
//             .attr('y', d=>d.y0)
//             .attr("stroke", "black")
//             .attr("fill", d=>vis.colors[d.data.gender])
//             .on('click', function(event, d) {
//                 if(d3.select(this).style('stroke-width') !== '2px') {
//                     vis.svg.selectAll('.tree-rect')
//                         .style('opacity', '0.4')
//                     d3.select(this) // change color or selected country
//                         .style('stroke-width', '2px')
//                         .style('fill', d => vis.colors[d.data.gender])
//                         .style('opacity', 1)
//                     selCountry = d.data.artist
//                     document.getElementById("resetbutton").disabled = false;
//                     // dashMedals.wrangleData()
//                     // dashBar1.wrangleData()
//                     // dashBar2.wrangleData()
//                 }
//                 else{
//                     resetToWorld();
//                 }
//             })
//         vis.rects.exit();
//
//         vis.labels = vis.rectGroup.selectAll("text")
//             .data(vis.root.leaves());
//         vis.labels.enter()
//             .append("text")
//             .attr('class', 'label tree-rect-label')
//             .merge(vis.labels)
//             .attr("x", d=>d.x0+10)
//             .attr("y", d=>d.y0+25)
//             .text(function(d){
//                 if(d.data.win_count > 18)
//                     return d.data.artist;
//             })
//             .attr('font-size', function(d){return Math.sqrt((Math.sqrt(d.data.win_count)))/3.5+"vw"})
//
//         vis.legendRects = vis.legendGroup.selectAll('.legend-rect')
//             .data(Object.keys(vis.colors))
//             .enter().append('rect')
//             .attr('class', 'legend-rect')
//             .attr('width', vis.width/50)
//             .attr('height',vis.width/50)
//             .attr('y', 0)
//             .attr('x', function(d,index){return -3.1*vis.width/7.5+index*vis.width/7})
//             .attr("fill", d=>vis.colors[d])
//             .attr('stroke', 'black');
//
//         vis.legendText = vis.legendGroup.selectAll('.legend-label')
//             .data(Object.keys(vis.colors))
//             .enter().append('text')
//             .attr('class', 'legend-label')
//             .attr('font-size', '0.9vw')
//             .attr('fill', 'white')
//             .attr('y', vis.width/75+2)
//             .attr('x', function(d,index){return -3.1*vis.width/7.5+index*vis.width/7+vis.width/40})
//             .text(d=>d)
//     }
//
//     resetColors() {
//         let vis = this;
//         vis.svg.selectAll('rect')
//             .style('stroke-width', '1px')
//             .style('opacity', 1)
//     }
// }
