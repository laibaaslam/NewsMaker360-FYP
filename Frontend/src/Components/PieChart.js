import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import '../../src/index.css' // Import the CSS file

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PC extends Component {
    componentDidMount() {
        const chartContainer = document.getElementById('chartContainer');
        setTimeout(() => {
            chartContainer.classList.add('ripple');
        }, 4000); // Add ripple effect after 1 second
    }

    render() {
        const options = {
            exportEnabled: false,
            animationEnabled: true,
            animationDuration: 7000, // Set the animation duration to 7 seconds
            backgroundColor: "transparent", // Set the background color to transparent
            legend: {
                enabled: false // Hide the legend
            },
            data: [{
                type: "pie",
                startAngle: 75,
                toolTipContent: "<h3>{label}</h3>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 18,
                indexLabel: "{label} - {y}%",
                dataPoints: [
                    { y: 18, label: "English", color: "#FF6384" }, // Custom color
                    { y: 49, label: "Urdu", color: "#FFA500" },    // Custom color
                    { y: 9, label: "Pashto", color: "#FE1E56" },   // Custom color
                    { y: 5, label: "Others", color: "#8EE9D1" },   // Custom color
                    { y: 19, label: "Punjabi", color: "#9966FF" }  // Custom color
                ]
            }]
        };

        return (
            <div id="chartContainer" className="chart-container">
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default PC;
