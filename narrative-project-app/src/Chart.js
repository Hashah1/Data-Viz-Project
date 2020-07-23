import React, { Component, createRef } from 'react'
import * as d3 from 'd3'
class Chart extends Component {
    async componentDidMount() {
        console.log("here")
        this.ref = createRef()
        
        const urbanData = await d3.csv('https://raw.githubusercontent.com/Hashah1/data-viz-project/master/narrative-project-app/src/PercentageAccessToElectricity_urban.csv')
        const ruralData = await d3.csv('https://raw.githubusercontent.com/Hashah1/data-viz-project/master/narrative-project-app/src/PercentageAccessToElectricity_rural.csv')
        urbanData.forEach(d=>{
            console.log(d)
        })
        // this.drawBarChart(data)
    }
    drawBarChart(data)  {
        // Get data from CSV File.
        const w = 1000
        const h = 1000
        const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("margin-left", 500)
        .style("margin-right", 500)
        .style("margin-top", 50)
        .style("margin-bottom", 50)
        
        .style("border", "1px solid black")
                        
        
        }
    render() { return <div></div> }
}
export default Chart