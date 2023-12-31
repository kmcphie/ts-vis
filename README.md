# Swift Soundscape
A data story about Taylor Swift's music and impact. Created for Harvard's CS 171. Joanna Bai, Sraavya Sambara, Katherine McPhie.

# Overview
This data story is a deep dive analysis into the discography of Taylor Swift, the greatest pop star of our time, and possibly of all time. From her career spanning nearly two decades and ten records (14 records if you include Swift’s latest re-recording project), this data story includes visualizations that display Swift’s artistry and identifies patterns and outliers in her catalog.

# Visualizations

### Line Chart
Compares Taylor Swift to other artists by looking at Billboard rankings.

### Heat Map
Examines how Taylor Swift stacks up to other artists by considering Grammy nominations.

### Globe Visualization
Analyzes Taylor Swifts tours and associated information (e.g. revenue).

### Map Visualization
Shows some real locations that Taylor Swift has referenced in her song lyrics.

### Bubble Chart
Provides an overview of common themes in Taylor Swift's music.

### Radial Chart
Gives the user a chance to compare different Taylor Swift songs across various categories.

# Libraries

## AOS Library
The AOS (Animate On Scroll) library simplifies the process of adding scroll-based animations to elements, allowing for the seamless presentation of information. This library has been integrated to enhance the user experience by providing smooth animations as the user scrolls through the content of the data story.

### How to Use AOS in Swift Soundscape
To leverage the AOS library, simply include the AOS script in the HTML file and add specific data attributes to the desired HTML elements. This allows for the customization of animation type, duration, and offset. For more information on how to implement AOS, refer to the official documentation: [AOS Documentation](https://michalsnik.github.io/aos/).

## Leaflet.js Library
The Leaflet.js library is a lightweight, open-source JavaScript library that enables the creation of interactive maps with a focus on simplicity, performance, and usability. This library was incorporated to integrate interactive and dynamic maps into the data story.

### How to Use Leaflet.js in Swift Soundscape
To integrate Leaflet.js, include the Leaflet.js library in the project and utilize its API to create and customize maps. Leaflet.js supports a wide range of features, including markers, popups, and various map layers, allowing for the creation of rich and dynamic visualizations. For more details on implementing Leaflet.js, consult the official documentation: [Leaflet.js Documentation](https://leafletjs.com/).

# Data

### Taylor Swift Genius Data
Spreadsheet with lyric data taken from [this Github](https://github.com/adashofdata/taylor_swift_data).
* index: for numbering purposes
* album: which Taylor Swift album the song is from
* song: which song the lyric is from
* lyric: lyric of the specified song and album

### Taylor Swift Set List Data
Spreadsheet with set lists from Taylor Swift’s tours taken from [this Github](https://github.com/adashofdata/taylor_swift_data).
* column: tour
* cell: title of song performed on the tour
* color: album

### Taylor Swift Spotify Data
Spreadsheet with song metadata taken from [this Github](https://github.com/adashofdata/taylor_swift_data).
* Playlist ID: for numbering purposes
* Album: which Taylor Swift album the song is from
* Song Name: name of the song
* Danceability: The higher the value, the easier it is to dance to this song
* Energy: The energy of a song (the higher the value, the more energetic the song
* Key: Encoding for what key the song is in
* Loudness: The higher the value, the louder the song
* Mode: The musical mode of the song
* Speechiness: The higher the value the more spoken word the song contains
* Acousticness: The higher the value the more acoustic the song is
* Instrumentalness: The higher the value the more instrumental the song is
* Liveness: The higher the value, the more likely the song is a live recording
* Valence: The higher the value, the more positive mood for the song
* Tempo: The tempo of the song in BPM (beats per minute)
* Duration_ms: The duration of the song
* Time Signature: The time signature of the song

### Taylor_Swift_Spotify_Data1.csv
Same as Taylor Swift Spotify Data but converted to csv format and filtered to be the top songs for the radial visualization.

### Taylor Swift Words Data
Spreadsheet with lyrics data broken down into words taken from [this Github](https://github.com/adashofdata/taylor_swift_data).
* Song Name: name of the song
* column: word mentioned in a song
* cell: number of times that word is mentioned in the song

### allSongData.csv
All information about Taylor Swift songs taken from [this Github](https://github.com/adashofdata/taylor_swift_data). 
Contains the same columns as the files above. 

### Taylor Swift Tour Data
Information about Taylor Swift’s specific performances on tour scraped from [Wikipedia](https://en.wikipedia.org/wiki/List_of_Taylor_Swift_live_performances).
* City: city where the performance took place
* Country: country where the performance took place
* Venue: venue where the performance took place
* Opening act(s): opening act(s) for the performance
* Attendance (tickets sold / available): number of people who bought tickets for the performance as compared to number of tickets available for the performance
* Revenue: revenue of the performance
* Tour: tour that the performance was associated with

### Tour_Info.csv
Information about Taylor Swift’s tours in general scraped from [Wikipedia](https://en.wikipedia.org/wiki/List_of_Taylor_Swift_live_performances).

### world-110m.json
GeoJSON encoding for the globe visualization taken from [topojson](https://github.com/topojson/world-atlas).

### states-albers-10m.json
GeoJSON encoding for the US map visualization taken from [topojson](https://github.com/topojson/us-atlas).

### uscities.csv
Data about US cities and their coordinates for the map visualization taken from [this website](https://simplemaps.com/data/us-cities).
* city: name of a city in the United States
* city_ascii: name of the same city without formatting
* state_id: abbreviation of the state the city is in
* state_name: full name of the state the city is in
* country_fips: the 5-digit FIPS code for the primary county
* county_name: 
* lat: latitude
* lng: longitude
* population: population
* density: the estimated population per square kilometer
* source: 
* military: 
* incorporated: TRUE if the place is a city/town. FALSE if the place is just a commonly known name for a populated area.
* timezone: the city's time zone in the tz database format
* ranking: an integer from 1-5 that captures the importance of a city (1 is most important, 5 least important)
* zips: a string containing all five-digit zip codes in the city/town, delimited by a space
* id: a 10-digit unique id generated by SimpleMaps

### lyricThemes.csv
Themes present in Taylor Swift’s songs taken from [this Reddit thread](https://www.reddit.com/r/TaylorSwift/comments/11zl2wr/set_lists_from_all_of_taylors_tours_including_the/).
* theme: a theme in one of Taylor Swift’s songs
* description: short description about what things are considered part of the theme

### themeCount.csv
Same as lyricThemes.csv but with an additional column counting up the themes.
* item_count: count of the number of times that theme appears across Taylor Swift’s songs

### albumThemeCount.csv
Same as themeCount.csv but broken down by album.

### place_lyrics.json
Places Taylor Swift mentions in her songs, taken from [this article](https://www.duchessofneverland.com/home/taylor-swift-song-locations).
* index: for numbering purposes
* song: song that mentions the place
* album: album the song was on that mentions the place
* location: specific place mentioned
* gen_location: location on a more general level (i.e. city)
* lyric: specific lyric within the song that references the place

### billboard.json
Information about Billboard rankings taken from [this site](https://www.billboard.com/charts/year-end/2021/hot-100-artists/).
* year: year of the ranking
* artist name (string) with ranking (integer)

### grammy.csv
Information about Grammy nominations taken from [this site](https://www.kaggle.com/code/jagannathrk/the-grammy-arwards-analysis).
* year: year of the nomination
* category: nomination category
* nominee: song that was nominated
* workers: artists or collaborators on the song
* winner: boolean value TRUE if the song won and FALSE if not

### grammyAwards.csv
Information about Grammy winners taken from [this site](https://www.kaggle.com/code/jagannathrk/the-grammy-arwards-analysis).
* Year: year of the award
* Category: award category
* Album/Song: album or song that received the award
* Workers: collaborators or producers on the album or song
* Artist: song’s artist
* Winner: boolean value TRUE if the album or song won and FALSE if not 

### wins.json
Same as grammyAwards.csv but converted to json format.
