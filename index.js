// Create SVG Canvas
const w = 800
const h = 500
const svg = d3.select("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("align", "center")
    .style("border", "1px solid black")

console.log
// Extract Data
async function init() {
    // const urbanData = await d3.csv('PercentageAccessUrban.csv')
    const data = await d3.csv('https//flunky.github.io/data.csv');
    console.log("here", data)
    // const urbanData = await d3.csv()
    // const ruralData = await d3.csv('https://github.com/Hashah1/data-viz-project/blob/master/PercentageAccessRural.csv')
    // console.log(data)
    // console.log(ruralData)
}
// Create Bars

// Axis, scales