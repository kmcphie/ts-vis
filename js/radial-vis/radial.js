let width = 1400;
let height = 900;

let svg = d3.select("#radial-vis").append("svg")
	.attr("width", width)
	.attr("height", height);


let radialScale = d3.scaleLinear()
	.domain([0, 1])  // Adjust the domain based on the range of your features
	.range([0, 250]);
let ticks = [0.2, 0.4, 0.6, 0.8, 1.0];  // Adjust the ticks based on the domain

svg.selectAll("circle")
	.data(ticks)
	.join(
		enter => enter.append("circle")
			.attr("cx",  width / 2 + 200)
			.attr("cy", height / 2 )
			.attr("fill", "none")
			.attr("stroke", "gray")
			.attr("r", d => radialScale(d))
	);

svg.selectAll(".ticklabel")
	.data(ticks)
	.join(
		enter => enter.append("text")
			.attr("class", "ticklabel")
			.attr("fill", "white")
			.attr("x", width / 2 + 210)
			.attr("y", d => height / 2 - radialScale(d) + 10)
			.text(d => d.toFixed(2))  // Display as decimals
	);

function angleToCoordinate(angle, value) {
	let x = Math.cos(angle) * radialScale(value);
	let y = Math.sin(angle) * radialScale(value);
	return {"x": width / 2  + 200 + x, "y": height / 2 - y };
}

let features = ["Danceability", "Energy", "Acousticness", "Valence"];

d3.csv("data/Taylor_Swift_Spotify_Data1.csv").then(data => {
	let line = d3.line()
		.x(d => d.x)
		.y(d => d.y);

	const taylorColors = [
		"#C71585", "#A52A2A", "#CD853F", "#D2691E",
		"#F5DEB3", "#FFA07A", "#8A2BE2", "#FF4500", "#FF6347", "#FF1493", "#FFD700",
		"#FF8C00", "#8B008B", "#800080", "#4B0082", "#8B0000", "#B22222", "#DC143C",
		"#FF4E6E", "#FF0040", "#B3E0F2", "#9AD8EA", "#81D0E2", "#68C8DA", "#4FC0D2",
		"#36B8CA", "#1DADC2", "#0CA3BA", "#0092A7", "#007C8F",
		"#66C099",
		"#52B88C", "#3EA17E", "#2E8F6B", "#217B59", "#1A6747"
	];


	// console.log(data)
	//
	// let colorScale = d3.scaleOrdinal()
	// 	.domain(data.map(d => d.Playlist_ID))
	// 	.range(d3.schemeCategory10);

	function getPathCoordinates(data_point) {
		let coordinates = [];
		for (let i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
		}
		// console.log(coordinates);
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
				.attr("x1", width / 2 + 200)
				.attr("y1", height / 2 )
				.attr("x2", d => d.line_coord.x)
				.attr("y2", d => d.line_coord.y)
				.attr("stroke", "white")
		);

	// draw axis label for each group
	songGroups.selectAll(".axislabel")
		.data(featureData)
		.join(
			enter => enter.append("text")
				.attr("class", "axislabel")
				.attr("fill", "white")
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
					.attr("stroke", d => taylorColors[data.indexOf(d)])  // Use the index of the data point to get a color
					.attr("fill", d => taylorColors[data.indexOf(d)])   // Use the index of the data point to get a color
					.attr("stroke-opacity", 0)
					.attr("opacity", 0);

				return path;
			}
		);


	// console.log("hi")

	// Add a reset button click event listener
	document.getElementById("reset-button-1").addEventListener("click", function () {
		clearPreviousPaths();
		resetRectangles();
		d3.select("#info-box svg").selectAll("*").remove();
	});

	function resetRectangles() {
		// Reset the fill color of all rectangles to the original color
		svg.selectAll(".song-label rect")
			.attr("fill", "#ffffff");
	}

	const sanitizeId = (id) => id.replace(/[^\w-]/g, '_'); // Replace non-word characters with underscores

	const songLabels = songGroups.selectAll(".song-label")
		.data(data)
		.join(
			enter => {
				const group = enter.append("g")
					.attr("class", "song-label");

				// Add a sanitized id to the rectangle based on the Song_Name
				group.append("rect")
					.attr("id", d => "rect-" + sanitizeId(d.Song_Name))
					.attr("x", 80)
					.attr("y", (d, i) => i * 40 + 60)
					.attr("width", 460)
					.attr("height", 30)
					.attr("rx", 12)
					.attr("ry", 12)
					.attr("fill", "#ffffff");

				// Add a sanitized id to the text based on the Song_Name
				group.append("text")
					.attr("id", d => "text-" + sanitizeId(d.Song_Name))
					.attr("x", 90)
					.attr("y", (d, i) => i * 40 + 80)
					.text(d => d.Song_Name);

				group.on("click", (event, d) => {
					// Toggle opacity of the path
					const path = paths.filter(song => song === d);
					const currentOpacity = parseFloat(path.style("opacity"));
					const newOpacity = currentOpacity === 0.5 ? 0 : 0.5;
					path.attr("opacity", newOpacity);

					// Change the color of the corresponding rectangle
					const rect = group.select("rect#rect-" + sanitizeId(d.Song_Name));
					// rect.attr("fill", newOpacity === 0.5 ? colorScale(d.Playlist_ID) : "#ffd3da");
					rect.attr("fill", newOpacity === 0.5 ? taylorColors[data.indexOf(d)] : "#ffffff");


					// Update the information box with the selected paths
					const pathsForSong = songGroups.filter(song => song === d).selectAll("path");

					// Check if any paths are found
					if (!pathsForSong.empty()) {
						const selectedPaths = svg.selectAll(".song-group path").filter(function () {
							return parseFloat(d3.select(this).style("opacity")) === 0.5;
						}).data();
						updateInfoBox(selectedPaths);

						// Generate sentences about the vibe based on average values
						const vibeSentences = generateVibeSentences(selectedPaths);
						console.log(vibeSentences);
					} else {
						console.error("No paths found for the selected song group.", d);
					}
				});

			}
		);


	// Update the SVG container for the information box
	let infoBox = d3.select("#info-box").append("svg")
		.attr("width", "100%")
		.attr("height", "180px");

// Function to generate sentences about the vibe based on average values
	function generateVibeSentences(selectedPaths) {
		if (selectedPaths.length > 0) {
			const avgValence = d3.mean(selectedPaths, d => d.Valence);
			const avgEnergy = d3.mean(selectedPaths, d => d.Energy);
			const avgDanceability = d3.mean(selectedPaths, d => d.Danceability);
			const avgAcousticness = d3.mean(selectedPaths, d => d.Acousticness);

			// Example sentences, you can customize these based on your preferences
			const valenceSentence = `The selected songs exude a ${avgValence > 0.5 ? 'positive' : 'mellow'} valence,`;
			const energySentence = `a ${avgEnergy > 0.7 ? 'high energy vibe' : 'relaxed vibe'}, and are ${avgDanceability > 0.7 ? 'super danceable' : 'relatively danceable'}.`;

			return [valenceSentence, energySentence];
		} else {
			return ["No songs selected.", ""];
		}
	}

	function updateInfoBox(selectedPaths) {
		// Calculate average values for selected paths
		let avgValence = d3.mean(selectedPaths, d => d.Valence);
		let avgAcousticness = d3.mean(selectedPaths, d => d.Acousticness);
		let avgDanceability = d3.mean(selectedPaths, d => d.Danceability);
		let avgEnergy = d3.mean(selectedPaths, d => d.Energy);

		// Remove previous content in the information box
		infoBox.selectAll("*").remove();

		// Add text elements to display average values
		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 20)
			.text("Average Valence: " + avgValence.toFixed(2))
			.attr('fill', 'white');

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 45)
			.text("Average Acousticness: " + avgAcousticness.toFixed(2))
			.attr('fill', 'white');

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 70)
			.text("Average Danceability: " + avgDanceability.toFixed(2))
			.attr('fill', 'white');

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 95)
			.text("Average Energy: " + avgEnergy.toFixed(2))
			.attr('fill', 'white')

		// Generate sentences about the vibe based on average values
		const vibeSentences = generateVibeSentences(selectedPaths);

		infoBox.selectAll(".vibe-sentence")
			.data(vibeSentences)
			.enter()
			.append("text")
			.attr('fill', 'white')
			.attr("class", "vibe-sentence")
			.attr("x", 10)
			.attr("y", (d, i) => 140 + i * 25)
			.text(d => d);

	}

});