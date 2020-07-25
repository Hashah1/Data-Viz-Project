class BarChartData {
    constructor() {
        this.urbanMode = true
        this.year = '2018'
        this.data = []
    }

    toggleMode() {
        this.urbanMode = !this.urbanMode
    }
    getMode(){
        return this.urbanMode
    }
}

const obj = new BarChartData()

// Extract Data
async function init() {
    console.log("In init()")
    const urbanURL = "https://raw.githubusercontent.com/Hashah1/data-viz-project/master/PercentageAccessUrban.csv"
    // Grab Data from the URLs
    const urbanData = await d3.csv(urbanURL) 
    console.log("Default chart uses urban data from 2018")
    console.log("Urban: ", urbanData)
    obj.data = urbanData
    createBarChart(obj.data)
    
}

function createBarChart(data, year) {
    d3.selectAll("svg").remove() // Remove previous svg.
    // Create SVG Canvas
    const margin = 60;
    const width = 1200 - 2 * margin;
    const height = 800 - 2 * margin;
    
    const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", 'svg')
    // text label for the x and y axis
    svg.append("text")             
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", 200)
    .attr("y", height - margin)
    .text("Geographical Locations")

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 15)
    .attr("x", -400)
    .attr("dy", ".20em")
    .attr("transform", "rotate(-90)")
    .text("Percentage of access to electricity");
    
    // Create Chart
    const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
    
    // Retrieve Data for year (input year)
    valsForBar = processData(data, year)
    console.log("Dev: ", valsForBar)

    // Create Y Scale
    const yScale = d3.scaleLinear()
    .range([500, 0])
    .domain([0, 100]); // 0 - 100 since dealing with %ages.

    chart.append('g')
    .call(d3.axisLeft(yScale));

    // Create X Scale
    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(valsForBar.map((d) => d[0]))
    .padding(0.2)
    
    chart.append('g')
    .attr('transform', `translate(0, ${500})`)
    .call(d3.axisBottom(xScale));

    // tooltip
    var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none")

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.3em")
    .style("font-weight", "bold")

    // Create BArs
    if (obj.getMode()){ // Urban data is colored blue
        console.log("Getting urban")

        chart.selectAll('rect')
        .data(valsForBar)
        .enter()
        .append('rect')
        // .transition()
        .attr('x', function(d) {return xScale(d[0])})
        .attr('y', function(d) {return yScale(d[1])})
        .attr('height',function(d) {return 500 - yScale(d[1])})
        .attr('width', xScale.bandwidth())
        .attr("fill", "steelblue")
        .on("mouseover", function () {
            tooltip.style("display", null)
        })
        .on("mouseout", function(){
            tooltip.style("display", "none")
         })
        .on("mousemove", function(d) {
            var xPos = d3.mouse(this)[0] - 100
            var yPos = yScale(d[1])
            tooltip.attr("transform", "translate(" + xPos + ", " + yPos + ")")
            var tooltipDisplay = "Access to Electricity: " + d[1] + "%"
            tooltip.select("text").text(tooltipDisplay)
        })
        
        // Change Text
        d3.select("#toggleButton").text("Get Rural")
    } else {
        console.log("Getting Rural data")
        chart.selectAll('rect')
        .data(valsForBar)
        .enter()
        .append('rect')
        .transition()
        .attr('x', function(d) {return xScale(d[0])})
        .attr('y', function(d) {return yScale(d[1])})
        .attr('height',function(d) {return 500 - yScale(d[1])})
        .attr('width', xScale.bandwidth())
        .attr("fill", "orange")
        // Change Text
        d3.select("#toggleButton").text("Get Urban")
    }
    
    
}

async function toggleMode() {
    console.log("Clicked, toggling.",)
    // Get toggled data based off current mode.
    // If we are on urban mode, grab rural data, else urban
    var url = obj.getMode()? "https://raw.githubusercontent.com/Hashah1/data-viz-project/master/PercentageAccessRural.csv": "https://raw.githubusercontent.com/Hashah1/data-viz-project/master/PercentageAccessUrban.csv"
    // Assign the data
    obj.data = data = await d3.csv(url)
    // Toggle mode accordingly to match the data
    obj.toggleMode()
    // Get data based off mode.
    createBarChart(obj.data, obj.year)
}

async function handleYear() {
    console.log("Handling year.")
    obj.year = document.getElementById("quantity").value
    if ( parseInt(obj.year) < 1990 || parseInt(obj.year) > 2018) {
        console.log("inValid data")
        return
    }
    createBarChart(obj.data, obj.year)
}

function processData(dataset, year='2018') {
    data = {}
    // Retrieve data based on the year from the dataset
    for (var i = 0; i < dataset.length; i ++) { 
        var record = dataset[i]
        var countryName = record['Country Name']
        if (countryName == 'United States' || countryName == 'South Asia' || countryName == 'Middle East & North Africa' || countryName == 'North America' || countryName == 'European Union' || countryName == 'Europe & Central Asia'){
            data[countryName] = record[year]
        }
    }

    // Extract all percentages
    percentages = Object.keys(data).map(function(key){
        return data[key];
    });
    // Extract all country names
    const countryNames = Object.keys(data)

    // Create final set of data for the bars
    var valsForBar = []
    for (var i = 0; i < percentages.length; i++) {
        country = countryNames[i]
        percent = percentages[i]
        var newlist = [country, percent]
        valsForBar.push(newlist)
        newlist = []
    }
    return valsForBar
}