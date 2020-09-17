
/****************************
FUNCTION TO PLOT ALL CHARTS
*****************************/

function makePlot(id){
    //get data from samples.jason file
    d3.json("./data/samples.json").then((data)=>{
        console.log(data);

        //variable to store washing frequency
        var wfreq =data.metadata.map(d => d.wfreq);
        console.log (`Washing frequecy ${wfreq}`);

        //filter by id
        var samples=data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);

//BAR CHART
        //get top 10 sample_values
        var sample_top= samples.sample_values.slice(0,10).reverse();
        console.log(`Sample Values: ${sample_top}`);

        // get top 10 otu ids 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        // map otu id with OTU added 
        var OTU_id = OTU_top.map(d => "OTU " + d);
        console.log(`OTU IDS: ${OTU_id}`);

        // get the top 10 labels 
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log(`LABELS: ${labels}`);

        //create trace for the bar chart
        var trace = {
            x: sample_top,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(72, 93, 151)'},
            type:"bar",
            orientation: "h",
        };
        // create data variable for bar chart
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
    
        //create the bar chart
        Plotly.newPlot("bar", data, layout);


//BUBBLE CHART
         // create trace for the bubble chart
         var trace_b = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: 'Earth'
            },
            text: samples.otu_labels
  
        };
  
        // set the layout for the bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // creating data variable 
        var data_b = [trace_b];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data_b, layout_b); 

// BONUS - GAUGE CHART
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Belly Button Washing Frequency(scrubs per week)` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color:"rgb(214, 230, 227)" },
                    { range: [2, 4], color: "rgb(187, 216, 211)" },
                    { range: [4, 6], color: "rgb(156, 199, 192)" },
                    { range: [6, 8], color: "rgb(117, 172, 163)" },
                    { range: [8, 9], color: "rgb(31, 100, 90)" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 600, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);

      });
  }  

/********************************************** 
FUNCTION TO GET DATA for DEMOGRAPHIC INFO
***********************************************/

function getData(id) {
    // read the json file to get data
    d3.json("./data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");


        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
        });
    });
}


/********************************************** 
FUNCTION FOR CHANGE EVENT
***********************************************/
function optionChanged(id) {
    makePlot(id);
    getData(id);
}

/********************************************** 
FUNCTION FOR INITIAL DATA RENDERING
***********************************************/

function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("./data/samples.json").then((data)=> {
        console.log(data);


        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        makePlot(data.names[0]);
        getData(data.names[0]);
    });
}


init();

                                                         