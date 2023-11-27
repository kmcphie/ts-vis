let width = 1500;
let height = 800;
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

				return path;
			}
		);


	console.log("hi")

	// Add a reset button click event listener
	document.getElementById("reset-button").addEventListener("click", function () {
		clearPreviousPaths();
		resetRectangles();
	});

	function resetRectangles() {
		// Reset the fill color of all rectangles to the original color
		svg.selectAll(".song-label rect")
			.attr("fill", "#ffd3da");
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
					.attr("x", 140)
					.attr("y", (d, i) => i * 30 + 15)
					.attr("width", 370)
					.attr("height", 25)
					.attr("fill", "#ffd3da");

				// Add a sanitized id to the text based on the Song_Name
				group.append("text")
					.attr("id", d => "text-" + sanitizeId(d.Song_Name))
					.attr("x", 149)
					.attr("y", (d, i) => i * 30 + 33)
					.text(d => d.Song_Name);

				group.on("click", (event, d) => {
					// Toggle opacity of the path
					const path = paths.filter(song => song === d);
					const currentOpacity = parseFloat(path.style("opacity"));
					const newOpacity = currentOpacity === 0.5 ? 0 : 0.5;
					path.attr("opacity", newOpacity);

					// Change the color of the corresponding rectangle
					const rect = group.select("rect#rect-" + sanitizeId(d.Song_Name));
					rect.attr("fill", newOpacity === 0.5 ? colorScale(d.Playlist_ID) : "#ffd3da");

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
		.attr("width", "100%");

// Add a group to the information box for better organization
	let infoBoxGroup = infoBox.append("g")
		.attr("transform", "translate(10, 10)");

// Now you can append text and other elements to the infoBoxGroup
	infoBoxGroup.append("text")
		.attr("id", "infoBoxHeading")
		.attr("x", 0)
		.attr("y", 20);

// Function to generate sentences about the vibe based on average values
	function generateVibeSentences(selectedPaths) {
		if (selectedPaths.length > 0) {
			const avgValence = d3.mean(selectedPaths, d => d.Valence);
			const avgEnergy = d3.mean(selectedPaths, d => d.Energy);
			const avgDanceability = d3.mean(selectedPaths, d => d.Danceability);
			const avgAcousticness = d3.mean(selectedPaths, d => d.Acousticness);

			// Example sentences, you can customize these based on your preferences
			const valenceSentence = `The selected songs exude a ${avgValence > 0.5 ? 'positive' : 'mellow'} valence.`;
			const energySentence = `With an average energy level of ${avgEnergy.toFixed(2)}, these songs offer ${avgEnergy > 0.5 ? 'high energy' : 'a relaxed vibe'}.`;

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
			.text("Average Valence: " + avgValence.toFixed(2));

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 40)
			.text("Average Acousticness: " + avgAcousticness.toFixed(2));

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 60)
			.text("Average Danceability: " + avgDanceability.toFixed(2));

		infoBox.append("text")
			.attr("x", 10)
			.attr("y", 80)
			.text("Average Energy: " + avgEnergy.toFixed(2));

		// Generate sentences about the vibe based on average values
		const vibeSentences = generateVibeSentences(selectedPaths);

		// Add text elements for vibe sentences
		infoBox.selectAll(".vibe-sentence")
			.data(vibeSentences)
			.enter()
			.append("text")
			.attr("class", "vibe-sentence")
			.attr("x", 10)
			.attr("y", (d, i) => 100 + i * 20)
			.text(d => d);

	}

});