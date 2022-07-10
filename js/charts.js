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
    var sampleArrays = data.samples;
    //console.log(sampleArrays);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredsampleArray= sampleArrays.filter(sampleObj=> sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredsampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(numericIds=> "OTU " + numericIds).reverse();
    var top10_otu_labels = otu_labels.slice(0, 10).reverse();
    var top10_sample_values = sample_values.slice(0, 10).reverse();

    //Bar Chart
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: top10_sample_values,
      y: yticks,
      text: top10_otu_labels,
      type: "bar",
      orientation: "h", 

    };

    var trace = [barData];
    // 9. Create the layout for the bar chart. 
    // How to make titles bold https://stackoverflow.com/questions/46512682/how-to-set-the-bold-font-style-in-plotly
    var barLayout = {
      title:"<b>Top 10 Bacteria Cultures Found</b>",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b:30
      },
      font: { color: "black", family: "Arial" } 

     };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barLayout);


    // Bubble chart
    //Colorscale: https://plotly.com/javascript/colorscales/
    var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Portland"
      }
  
    }];

               
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title:"OTU ID"},    
      showlegend: false,
      height: 500,
      width: 1000,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      },
      font: { color: "black", family: "Arial" } 
    };
      
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    

    //Gauge Chart
    // Create a variable that holds the samples array. 
    var metadata= data.metadata;
    console.log(metadata)

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = metadata.filter(sampleObj=> sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
     metadataResults =filteredMetadata[0];   

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    //This has already been done
    
    // 3. Create a variable that holds the washing frequency.
    var wfreq_value = metadataResults.wfreq;   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq_value,
      title: {text: "Belly Button Washing Frequency <br> Scrubs Per Week", font: {size:16}},
      gauge: {
        axis: { 
            range: [0, 10], 
            tickwidth: 1, 
            tickcolor: "black",
            nticks: 6 
        },
        bar: { color: "gray" },
        bgcolor: "white",
        borderwidth: 4,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "rgb(215,48,39)"},
          { range: [2, 4], color: "rgb(253,174,97)" },
          { range: [4, 6], color: "rgb(171,217,233)" },
          { range: [6, 8], color: "rgb(116,173,209)"},
          { range: [8, 10], color: "rgb(49,54,149)" }]},
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {margin: {t:0, b: 0 },
    width:500,
    height:400,
    font: { color: "black", family: "Arial" } 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 
    
    });
  
}

