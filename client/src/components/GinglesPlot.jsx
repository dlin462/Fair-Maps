import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ScatterPlot = () => {
    const { state, race } = useParams();
    const [ginglesData, setGinglesData] = useState([]);

    useEffect(() => {
      axios.get(`http://localhost:8080/gingles/${state}/${race}`)
          .then(response => {
              setGinglesData(response.data);
          })
          .catch(error => {
              console.error('Error fetching stateAssembly data:', error);
          });
    }, [race, state]);

    // console.log(ginglesData);


    return (
        <div style={{ display: 'flex' }}>
            {ginglesData.map((data, index) => (
                console.log(data),
                <div key={index} style={{ flex: '1' }}>
                    <Plot
                        data={[
                            {
                                x: data.xdata,
                                y: data.ydataDem,
                                opacity: 0.7,
                                mode: 'markers',
                                type: 'scatter',
                                name: `${data.race} ()`,
                                marker: { 
                                    color: 'lightskyblue',
                                    line: { 
                                        width: 1.5, 
                                        color: 'darkblue'
                                    }
                                 }
                            },
                            {
                                x: data.xdata,
                                y: data.ydataRep,
                                opacity: 0.7,
                                mode: 'markers',
                                type: 'scatter',
                                name: `${data.race} ()`,
                                marker: { 
                                    color: 'indianred',
                                    line: { 
                                        width: 1.5, 
                                        color: 'darkred'
                                    }
                                 }
                            },
                            {
                                x: data.xdata,
                                y: data.fitLineDem,
                                mode: 'lines',
                                type: 'scatter',
                                name: `${data.race} (Democrat Fit Line)`,
                                line: { color: 'blue' }
                            },
                            {
                                x: data.xdata,
                                y: data.fitLineRep,
                                mode: 'lines',
                                type: 'scatter',
                                name: `${data.race} (Republican Fit Line)`,
                                line: { color: 'red' }
                            }
                        ]}
                        layout={{
                            title: `${data.race} - Gingles Data`,
                            xaxis: { title: `Percent ${data.race}` },
                            yaxis: { title: 'Vote Share' },
                            hovermode: 'closest'
                        }}
                        style={{ width: '100%', height: '500px' }}
                    />
                </div>
            ))}
        </div>
    );
};
export default ScatterPlot;