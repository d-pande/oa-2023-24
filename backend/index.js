import express from "express"
import cors from "cors"

const app = express()

import fs from 'fs';
import csv from 'csv-parser';

// Specify the CSV file path and the word to count
const csvFilePath = '../movies.csv';
const wordToCount = 'example';

var yearCounts = {}; //stores year counts after being parsed from movies.csv
var graphData = {
    type: 'bar'
};  //arg for plotly graph
var stats = {
    runtime: 0,
    rating: 0,
    lRating: 10.0,
    genre: "",
    genreCounter: 0
};

var genreCounts = {};

let backendData = [graphData, stats]

// Create a read stream to parse the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    var title = row['title']

    // Counting years
    var year = row['year'];
    if (year.includes('(')) {
        year = year.slice(-4);
    }
    if( !(year in yearCounts) ) {
        yearCounts[year] = 1;
    } else {
        yearCounts[year]++;
    }

    // Counting runtime
    var runtime = parseInt(row['runtime'])
    if(stats.runtime < runtime) {
        stats.runtime = runtime;
        stats.longest = title;
    }    

    // Highest rated
    var rating = parseFloat(row['rating'])
    if(stats.rating < rating) {
        stats.rating = rating;
        stats.highestRated = title;
    }

    // Lowest rated
    var lRating = parseFloat(row['rating'])
    if(stats.lRating > lRating) {
        stats.lRating = lRating;
        stats.lowestRated = title;
    }

    // Genre
    var genre = row['genre'].split(',')
    for (var g in genre) {
        genre[g] = genre[g].trim()

        if( !(genre[g] in genreCounts) ) {
            genreCounts[genre[g]] = 1;
        } else {
            genreCounts[genre[g]]++;
        }
        
        if(genreCounts[genre[g]] > stats.genreCounter) {
            stats.genre = genre[g];
            stats.genreCounter = genreCounts[genre[g]]
        }
    }
    
    
  })
  .on('end', () => {
    // runs after parsing is finished
    // console.log(genreCounts);
    var keysArray = [];
    var valuesArray = [];

    for (const key in yearCounts) {
        if (yearCounts.hasOwnProperty(key)) {
            keysArray.push(key);
            valuesArray.push(yearCounts[key]);
        }
    }

    graphData['x'] = keysArray;
    graphData['y'] = valuesArray;
    // console.log(graphData);
});

app.use(cors({
    origin: "http://localhost:5500"
}))

app.get("/", (req, res) => {
    
    res.send({
        backendData  //... operator moves attributes from data to res obj
    }).status(200)
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port} 🚀`))