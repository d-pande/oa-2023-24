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

// Create a read stream to parse the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    var year = row['year'];

    // if it has '(', only keep last 4 chars
    if (year.includes('(')) {
        year = year.slice(-4);
    }

    if( !(year in yearCounts) ) {
        yearCounts[year] = 1;
    } else {
        yearCounts[year]++;
    }
    
  })
  .on('end', () => {
    // runs after parsing is finished
    // console.log(yearCounts);
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
    // origin: "http://localhost:5500"
    origin: "https://dssd-oa-v24z.onrender.com"
}))

app.get("/", (req, res) => {
    
    res.send({
        ...graphData  //... moves attributes from data to res obj
    }).status(200)
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port} 🚀`))