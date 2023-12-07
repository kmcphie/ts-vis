/* * * * * * * * * * * * * *
*         MapVis           *
* * * * * * * * * * * * * */

class MapVis {
    constructor(parentElement, tourData, geoData, cityData) {
        this.parentElement = parentElement;
        this.tourData = tourData;
        this.geoData = geoData;
        this.cityData = cityData;

        this.wrangleData();
        this.initVis();
        this.updateVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // adjust map position
        vis.map = vis.svg.append("g")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // add tooltip
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // projection
        vis.projection = d3.geoAlbersUsa()
            .translate([487.5, 305])
            .scale(1300);

        // color scale for which tour
        vis.colorScale = d3.scaleOrdinal()
            .domain([...new Set(vis.displayData.flatMap(d => d.tours))])
            .range(d => d === 'multiple' ? 'green' : d3.schemeCategory10);

        // radius scale for number of tours
        vis.radiusScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(vis.cityInfo), d => d.numTours)])
            .range([6, 20]);

        // load cities
        vis.cityGroup = vis.svg.append("g").attr("class", "city-group");
        vis.cities = vis.cityGroup.selectAll(".city")
            .data(vis.displayData)
            .enter().append("circle")
            .attr('class', 'city')
            .attr("cx", d => {
                const cityData = vis.cityData.find(c => c.city === d.City);
                let x = 0;
                if (cityData) {
                    let coordinates = [vis.cityInfo[cityData.city].longitude, vis.cityInfo[cityData.city].latitude];
                    let [x, y] = vis.projection(coordinates);
                    return x;
                } else {
                    return -5;
                }
            })
            .attr("cy", d => {
                const cityData = vis.cityData.find(c => c.city === d.City);
                let y = 0;
                if (cityData) {
                    let coordinates = [vis.cityInfo[cityData.city].longitude, vis.cityInfo[cityData.city].latitude];
                    let [x, y] = vis.projection(coordinates);
                    return y;
                } else {
                    return -5;
                }
            })
            .style("fill", d => vis.colorScale(d.tours))
            .attr("pointer-events", "visible");

        vis.path = d3.geoPath();

        // Load states GeoJSON data
        d3.json("data/states-albers-10m.json").then(function (statesData) {
            // Draw states
            vis.stateGroup = vis.svg.insert("g", ".city-group").attr("class", "state-group");
            vis.states = vis.stateGroup.selectAll(".state")
                .data(topojson.feature(statesData, statesData.objects.states).features)
                .enter()
                .append("path")
                .attr("class", "state")
                .attr("d", vis.path)
                .attr("stroke", "black")
                .attr("fill", "transparent")
                .attr("stroke-width", 1);
        });
    }

    wrangleData() {
        let vis = this;

        // data structure with information for each city
        vis.cityInfo = {};

        // Filter the tourData to include only tours in the United States
        vis.displayData = vis.tourData.filter(d => d.Country === 'United States');

        // Count the number of tours for each U.S. city
        vis.displayData.forEach(d => {
            const cityName = d.City;
            const cityData = vis.cityData.find(c => c.city === cityName);
            if (cityData) {
                if (vis.cityInfo[cityName]) {
                    vis.cityInfo[cityName].numTours++;
                    vis.cityInfo[cityName].tours.push(d.Tour)
                } else {
                    vis.cityInfo[cityName] = {
                        name: cityName,
                        numTours: 1, // Initialize the count
                        latitude: parseFloat(cityData.lat),
                        longitude: parseFloat(cityData.lng),
                        tours: [d.Tour]
                    };
                }
            }
        });

        console.log(vis.cityInfo);
    }

    updateVis() {
        let vis = this;

        // Color and radius size based on tour info
        vis.cities.style("fill", d => {
            const mostFrequentTour = getMostFrequentTour(vis.cityInfo[d.City].tours);
            return mostFrequentTour === 'multiple' ? 'gray' : getColorForTour(mostFrequentTour);
        });
        function getMostFrequentTour(tours) {
            if (!Array.isArray(tours) || tours.length === 0) {
                return 'No tours available';
            }

            const tourCounts = {};
            tours.forEach(tour => {
                tourCounts[tour] = (tourCounts[tour] || 0) + 1;
            });

            let maxCount = 0;
            let mostFrequentTour = 'No tours available';

            Object.keys(tourCounts).forEach(tour => {
                if (tourCounts[tour] > maxCount) {
                    maxCount = tourCounts[tour];
                    mostFrequentTour = tour;
                }
            });

            return mostFrequentTour;
        }
        function getColorForTour(tour) {
            switch (tour) {
                case 'The_Red_Tour':
                    return "#9D1111";
                case 'Speak_Now_World_Tour':
                    return "#41337A";
                case 'The_1989_World_Tour':
                    return "#88D9E6";
                case 'Fearless_Tour':
                    return '#FFE381';
                case 'Reputation_Stadium_Tour':
                    return "#191919";
                default:
                    return "#59656F";
            }
        }
        vis.cities.attr("r", d => vis.radiusScale(vis.cityInfo[d.City].numTours));

        // Display information about tour in tooltip
        vis.cities.on("mouseover", function (event, d) {
            d3.select(this)
                .attr("r", d => vis.radiusScale(vis.cityInfo[d.City].numTours) + 3);

            const cityName = d.City;
            const numTours = vis.cityInfo[cityName] ? vis.cityInfo[cityName].numTours : 0;
            const tours = vis.cityInfo[cityName] ? vis.cityInfo[cityName].tours : [];
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                    <h3>${cityName}<h3>
                    <h4> Number of Tours: ${numTours}</h4>
                    <h4> Tours:
                    ${Array.isArray(tours) ?
                    (tours.length > 0 ?
                        `<ul>${tours.map(t => `<li>${t}</li>`).join('')}</ul>` :
                        'No tours available') :
                    `<p>${tours}</p>`}
                    </h4>
                </div>`);
        })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("r", d => vis.radiusScale(vis.cityInfo[d.City].numTours))
                    .style("fill", d => {
                        const mostFrequentTour = getMostFrequentTour(vis.cityInfo[d.City].tours);
                        return mostFrequentTour === 'multiple' ? 'gray' : getColorForTour(mostFrequentTour);
                    });


                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }
}