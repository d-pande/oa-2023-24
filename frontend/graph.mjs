const graphDiv = document.getElementById("graph");

var layout = {
    title: {
        text: 'Top 10,000 Movies from IMDB by Year',
        yref: 'paper',
        automargin: true,
    },
    showlegend: false,
    xaxis: {title: 'Year'},
    yaxis: {title: '# of Top Movies'}
  };

fetch(
    "https://dssd-oa-v24z.onrender.com" //use "http://localhost:3000" if running sample express backend locally, or replace with your own backend endpoint url
    // "http://localhost:3000"
    ).then(async res => {
        let data  =  await res.json() //can only run res.json() once
        console.log(data)
        // Create a new paragraph element
        const paragraph = document.createElement("p");

        // Set the text content of the paragraph
        paragraph.innerHTML = "<strong>Most Popular Genre:</strong> " + data.backendData[1].genre + " ("+data.backendData[1].genreCounter+" movies)"
                        + "<br> <strong>Highest Rated:</strong> " + data.backendData[1].highestRated + " ("+data.backendData[1].rating + ")"
                        + "<br> <strong>Longest Runtime:</strong> " + data.backendData[1].longest + " ("+data.backendData[1].runtime + " min)"
                        + "<br> <strong>Lowest Rated:</strong> " + data.backendData[1].lowestRated + " ("+data.backendData[1].lRating + ")";

        // Append the paragraph to the graphDiv element
        graphDiv.appendChild(paragraph);
        Plotly.newPlot( graphDiv, [data.backendData[0]], layout);  //res.json() is being returned from index.js
})