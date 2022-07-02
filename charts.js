function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.

    var result = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ar_otu_ids = result.otu_ids;
    var ar_otu_labels = result.otu_labels;
    var ar_sample_values = result.sample_values; 

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sorted_otu_ids=ar_otu_ids.sort((a,b) => ar_sample_values[ar_otu_ids.indexOf(a)] - ar_sample_values[ar_otu_ids.indexOf(b)]).slice(-10);
    var sorted_otu_labels=ar_otu_labels.sort((a,b) => ar_sample_values[ar_otu_labels.indexOf(a)] - ar_sample_values[ar_otu_labels.indexOf(b)]).slice(-10);
    var sorted_values=ar_sample_values.sort((a,b) => a - b).slice(-10);
    sorted_otu_ids = sorted_otu_ids.map(i => 'OTU ' + i);
    console.log(sorted_otu_ids);
    
       // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sorted_values,
      y: sorted_otu_ids,
      text: sorted_otu_labels,
      type: "bar",  
      orientation: "h"     

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: ""},
        yaxis: {title: ""}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);
  


// Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: ar_otu_ids,
        y: ar_sample_values,
        text: ar_otu_labels,
        mode: 'markers',
        marker: {
            color: ar_otu_ids,
            size: ar_sample_values
          }              
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        yaxis: {title: ""}
       };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;
  var resultArray_meta = metadata.filter(sampleObj => sampleObj.id == sample);

  


    // 2. Create a variable that holds the first sample in the metadata array.
    var result_meta = resultArray_meta[0];
 
    // 3. Create a variable that holds the washing frequency.
    var wfreq = result_meta.wfreq;



 // 4. Create the trace for the gauge chart.
 
    var gaugeData = [
                 {
                    value: wfreq,
                    title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 10] },
                        bar: { color: "black" },
                        steps: [
                            { range: [0, 2], color: "red" },
                            { range: [2, 4], color: "orange" },
                            { range: [4, 6], color: "yellow" },
                            { range: [6, 8], color: "lightgreen" },
                            { range: [8, 10], color: "green" }
                          ],
                        }
            }
        ];
      

// 5. Create the layout for the gauge chart.
var glayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot('gauge', gaugeData, glayout);

});
}
