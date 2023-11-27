let width = 1500;
let height = 1000;
let maxVisiblePaths = 3;

let svg = d3.select("#radial-vis").append("svg")
	.attr("width", width )
	.attr("height", height);



let radialScale = d3.scaleLinear()
	.domain([0, 1])  // Adjust the domain based on the range of your features
	.range([0, 250]);
let ticks = [0.2, 0.4, 0.6, 0.8, 1.0];  // Adjust the ticks based on the domain

svg.selectAll("circle")
	.data(ticks)
	.join(
		enter => enter.append("circle")
			.attr("cx",  width / 2 + 150)
			.attr("cy", height / 2 - 140)
			.attr("fill", "none")
			.attr("stroke", "gray")
			.attr("r", d => radialScale(d))
	);

svg.selectAll(".ticklabel")
	.data(ticks)
	.join(
		enter => enter.append("text")
			.attr("class", "ticklabel")
			.attr("x", width / 2 + 150)
			.attr("y", d => height / 2 - radialScale(d) - 140)
			.text(d => d.toFixed(2))  // Display as decimals
	);

function angleToCoordinate(angle, value) {
	let x = Math.cos(angle) * radialScale(value);
	let y = Math.sin(angle) * radialScale(value);
	return {"x": width / 2  + 150 + x, "y": height / 2 - y - 140};
}

let features = ["Danceability", "Energy", "Acousticness", "Valence"];

d3.csv("data/Taylor_Swift_Spotify_Data1.csv").then(data => {
	let line = d3.line()
		.x(d => d.x)
		.y(d => d.y);

	console.log(data)

	let colorScale = d3.scaleOrdinal()
		.domain(data.map(d => d.Playlist_ID))
		.range(d3.schemeCategory10);

	function getPathCoordinates(data_point) {
		let coordinates = [];
		for (let i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
		}
		console.log(coordinates);
		return coordinates;
	}

	let featureData = features.map((f, i) => {
		let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
		return {
			"name": f,
			"angle": angle,
			"line_coord": angleToCoordinate(angle, 1),  // Assuming max value is 1
			"label_coord": angleToCoordinate(angle, 1.2)  // Adjust label position
		};
	});

	function clearPreviousPaths() {
		svg.selectAll(".song-group path")
			.attr("opacity", 0)
			.attr("stroke-opacity", 0);
	}

	// Draw a group for each song
	let songGroups = svg.selectAll(".song-group")
		.data(data)
		.join(
			enter => enter.append("g")
				.attr("class", "song-group")
		);

	// draw axis line for each group
	songGroups.selectAll(".line")
		.data(featureData)
		.join(
			enter => enter.append("line")
				.attr("class", "line")
				.attr("x1", width / 2 + 150)
				.attr("y1", height / 2 - 140)
				.attr("x2", d => d.line_coord.x)
				.attr("y2", d => d.line_coord.y)
				.attr("stroke", "black")
		);

	// draw axis label for each group
	songGroups.selectAll(".axislabel")
		.data(featureData)
		.join(
			enter => enter.append("text")
				.attr("class", "axislabel")
				.attr("x", d => d.label_coord.x)
				.attr("y", d => d.label_coord.y)
				.text(d => d.name)
		);

	clearPreviousPaths();

	// draw the path element for each group
	const paths = songGroups.selectAll("path")
		.data(d => [d])  // Use an array to bind data for a single element
		.join(
			enter => {
				const path = enter.append("path")
					.attr("d", d => line(getPathCoordinates(d)))
					.attr("stroke-width", 3)
					.attr("stroke", d => colorScale(d.Playlist_ID))
					.attr("fill", d => colorScale(d.Playlist_ID))
					.attr("stroke-opacity", 0)
					.attr("opacity", 0);

				// Append title for tooltip to the path
				path.append("title")
					.text(d => d.Song_Name);

				return path;
			}
		);

		console.log("hi")
	const songLabels = songGroups.selectAll(".song-label")
		.data(data)  // Use the entire data array
		.join(
			enter => {
				const group = enter.append("g")
					.attr("class", "song-label");

				// Add an id to the rectangle based on the Song_Name
				group.append("rect")
					.attr("id", d => "rect")
					.attr("x", 140)  // Adjust the x-coordinate for label placement
					.attr("y", (d, i) => i * 30 + 15)  // Center vertically around the chart and adjust vertical spacing
					.attr("width", 370)  // Adjust the width of the rectangle
					.attr("height", 25)  // Adjust the height of the rectangle
					.attr("fill", "#ffd3da");

				// Add an id to the text based on the Song_Name
				group.append("text")
					.attr("id", d => "text")
					.attr("x", 149)  // Adjust the x-coordinate for label placement inside the rectangle
					.attr("y", (d, i) => i * 30 + 33)  // Center vertically around the chart and adjust vertical spacing
					.text(d => d.Song_Name);

				group.on("click", (event, d) => {
					// When a label is clicked, toggle the visibility of the corresponding path
					const path = paths.filter(song => song === d);
					const currentOpacity = parseFloat(path.style("opacity"));
					const newOpacity = currentOpacity === 0.5 ? 0 : 0.5;
					path.attr("opacity", newOpacity);

					const rect = group.select("rect[data-song='" + d.Song_Name + "']");
					const text = group.select("text");

					// rect.attr("fill", newOpacity === 0.5 ? colorScale(d.Playlist_ID) : "lightgray")
					// 	.attr("stroke", newOpacity === 0.5 ? "yellow" : "none")
					// 	.attr("stroke-width", newOpacity === 0.5 ? 2 : 0)
					// 	.attr("data-song", newOpacity === 0.5 ? d.Song_Name : null);
					//
					// text.attr("fill", newOpacity === 0.5 ? colorScale(d.Playlist_ID) : "black");

					// Clear previous paths if the number of visible paths exceeds the maximum
					const visiblePathCount = svg.selectAll(".song-group path[opacity='0.5']").size();
					if (visiblePathCount > maxVisiblePaths) {
						clearPreviousPaths();
					}

				});

				// Add tooltip to the rectangles
				group.on("mouseover", function (event, d) {
					// Select the corresponding path
					const path = paths.filter(song => song === d);

					// Display the tooltip with the song name
					path.select("title").style("visibility", "visible");
				});

				group.on("mouseout", function () {
					// Hide the tooltip when the mouse leaves the rectangle
					paths.select("title").style("visibility", "hidden");
				});

				return group;
			}
		);

});