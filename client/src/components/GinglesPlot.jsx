import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { getNevadaPrecincts } from '../api/api';

const ScatterPlot = ({ data }) => {
//   const populationPercentages = data.map(entry => entry.percentPopulation);
//   const democratPercentages = data.map(entry => entry.percentDemocrat);
//   const republicanPercentages = data.map(entry => entry.percentRepublican);
//   const regions = data.map(entry => entry.region);
    const [plot, setPlot] = useState([]);
    const [currentState, setCurrentState] = useState('Nevada');

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
              const fetchedData = await getNevadaPrecincts(currentState); // Use imported function directly
              setPlot(fetchedData);
              console.log(fetchedData);
            } catch (error) {
              // Handle error
            }
          };
      
        fetchDataFromAPI();
    }, [currentState])
    
    const plotData = [
    {
        x: plot.percentPopulation,
        y: plot.percentDemocrat,
        mode: 'markers',
        type: 'scatter',
        name: 'Democrat',
        text: regions,
        marker: { color: 'blue' }
    },
    {
        x: plot.percentPopulation,
        y: plot.percentRepublican,
        mode: 'markers',
        type: 'scatter',
        name: 'Republican',
        text: regions,
        marker: { color: 'red' }
    }
    ];

    const layout = {
    title: 'Population vs Voting Preferences',
    xaxis: { title: 'Percentage of Population' },
    yaxis: { title: 'Percentage of Votes' },
    hovermode: 'closest'
    };

    return (
    <Plot
        data={plotData}
        layout={layout}
        style={{ width: '100%', height: '500px' }}
    />
    );
};

export default ScatterPlot;

