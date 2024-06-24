import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ScatterPlot = ({ state, ethnicity }) => {
    const [ginglesData, setGinglesData] = useState(null);

    useEffect(() => {
        axios.get(`FairMap.us-east-2.elasticbeanstalk.com/gingles/${state}/${ethnicity}`)
            .then(response => {
                setGinglesData(response.data);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, [state, ethnicity]);

    console.log(ginglesData);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {ginglesData && ginglesData.map((data, index) => (
                <div key={index} style={{ marginBottom: '40px' }}>
                    <Plot
                        data={[
                            {
                                x: data.xdata,
                                y: data.ydataDem,
                                opacity: 0.7,
                                mode: 'markers',
                                type: 'scatter',
                                name: `Democrat`,
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
                                name: `Republican`,
                                marker: {
                                    color: 'indianred',
                                    line: {
                                        width: 1.5,
                                        color: 'darkred'
                                    }
                                }
                            },
                            {
                                x: data.xfitData,
                                y: data.fitLineDem,
                                mode: 'lines',
                                type: 'scatter',
                                name: `Democrat`,
                                line: { color: 'blue' }
                            },
                            {
                                x: data.xfitData,
                                y: data.fitLineRep,
                                mode: 'lines',
                                type: 'scatter',
                                name: `Republican`,
                                line: { color: 'red' }
                            }
                        ]}
                        layout={{
                            title: data.electionType === 'President' ? `${data.race} - Presidential Data` : `${data.race} - United States Senate Data`,
                            xaxis: { title: `Percent ${data.race}`, range: [0, 1] },
                            yaxis: { title: 'Vote Share' },
                            hovermode: 'closest'
                        }}
                        style={{ width: '100%', height: '400px' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ScatterPlot;
