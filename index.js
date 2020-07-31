class BarChartData {
    constructor() {
        this.urbanMode = true
        this.year = '2018'
        this.urbanData = []
        this.ruralData = []
    }

    toggleMode() {
        this.urbanMode = !this.urbanMode
    }
}

const obj = new BarChartData()
d3.select('body').text
// Extract Data
async function init() {
    console.log("In init()")
    const urbanURL = "https://raw.githubusercontent.com/Hashah1/data-viz-project/master/PercentageAccessUrban.csv"
    // Grab Data from the URLs
    const urbanData = await d3.csv(urbanURL) 

    const ruralURL = "https://raw.githubusercontent.com/Hashah1/data-viz-project/master/PercentageAccessRural.csv"
    // Grab Data from the URLs
    const ruralData = await d3.csv(ruralURL) 
    // obj.data = urbanData
    obj.urbanData = urbanData
    obj.ruralData = ruralData
    createBarChart(obj.urbanData)
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

    // Text label for the x and y axis
    svg.append("text")             
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", 200)
    .attr("y", height - margin)
    .style("font-size",20)
    .text("Geographical Locations")

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 15)
    .attr("x", -400)
    .attr("dy", ".20em")
    .attr("transform", "rotate(-90)")
    .style("font-size",20 )
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
    .domain([0, 100]) // 0 - 100 since dealing with %ages.
    
    // Intervals for tick values
    var yDom = [0, 5, 10, 15, 20, 25, 30, 35, 40,
        45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
        
    ]
    chart.append('g')
    .call(
        d3.axisLeft(yScale)
        .tickValues(yDom)
    )
    

    // Create X Scale
    const xScale = d3.scaleBand()
    .range([0, width - margin])
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

    // Create Bars
    if (obj.urbanMode){ // Urban data is colored blue
        console.log("Getting urban")
        ruralLocalData = processData(obj.ruralData, year)
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
        .on("mousemove", function(d,i) {
            var xPos = d3.mouse(this)[0] - 100
            var yPos = yScale(d[1])
            
            tooltip.attr("transform", "translate(" + xPos + ", " + yPos + ")")
            var other = " Rural: " + parseFloat(ruralLocalData[i][1]).toFixed(2) + "%"
            var tooltipDisplay = "Urban: " + parseFloat(d[1]).toFixed(2) + other
            tooltip.select("text").text(tooltipDisplay)

        })
        
        // Change Text
        d3.select("#toggleButton").text("Get Rural")
    } else {
        console.log("Getting Rural data")
        urbanLocalData = processData(obj.urbanData, year)
        chart.selectAll('rect')
        .data(valsForBar)
        .enter()
        .append('rect')
        // .transition()
        .attr('x', function(d) {return xScale(d[0])})
        .attr('y', function(d) {return yScale(d[1])})
        .attr('height',function(d) {return 500 - yScale(d[1])})
        .attr('width', xScale.bandwidth())
        .attr("fill", "orange")
        .on("mouseover", function () {
            tooltip.style("display", null)
        })
        .on("mouseout", function(){
            tooltip.style("display", "none")
         })
        .on("mousemove", function(d, i) {
            var xPos = d3.mouse(this)[0] - 100
            var yPos = yScale(d[1])
            tooltip.attr("transform", "translate(" + xPos + ", " + yPos + ")")
            var other = " Urban: " + parseFloat(urbanLocalData[i][1]).toFixed(2) + "%"
            var tooltipDisplay = "Rural: " + parseFloat(d[1]).toFixed(2) + "%" + other
            tooltip.select("text").text(tooltipDisplay)
        })
        // Change Text
        d3.select("#toggleButton").text("Get Urban")
    }
    
    
}

async function toggleMode() {
    console.log("Clicked, toggling.",)
    // Get data based off mode.
    if (obj.urbanMode) {
        obj.toggleMode()
        createBarChart(obj.ruralData, obj.year)
    }
    else {
        obj.toggleMode()
        createBarChart(obj.urbanData, obj.year)
    }
    
}

async function handleYear() {
    console.log("Handling year.")
    // console.log("TEs", document.getElementById("quantity").value === )
    if (document.getElementById("quantity").value === "") {
        console.log("empty year entered.", parseInt(document.getElementById("quantity").value))
        return
    }
    obj.year = document.getElementById("quantity").value
    if ( parseInt(obj.year) < 1990 || parseInt(obj.year) > 2018) {
        console.log("inValid data")
        return
    }
    if (obj.urbanMode) {

        createBarChart(obj.urbanData, obj.year)
    }
    else {

        createBarChart(obj.ruralData, obj.year)
    }
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