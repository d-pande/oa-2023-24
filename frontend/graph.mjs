const graphDiv = document.getElementById("graph");

var layout = {
    title: {
        text: 'Top 10,000 Movies from IMDB by Year',
        yref: 'paper',
        automargin: true,
    },
    showlegend: false,
    xaxis: {title: 'Movie Year'},
    yaxis: {title: '# of Top Movies'}
  };

fetch(
    "http://localhost:3000/api" //use "http://localhost:3000" if running sample express backend locally, or replace with your own backend endpoint url
    // "https://oa-2023-24-backend.onrender.com" //use "http://localhost:3000" if running sample express backend locally, or replace with your own backend endpoint url

    ).then(async res => {
        let a  =  await res.json()
        // console.log(a)
    Plotly.newPlot( graphDiv, [a], layout);  //res.json() is being returned from index.js
})