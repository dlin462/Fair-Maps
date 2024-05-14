import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EcologicalInference = ({ state, election, ethnicity }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/ecoInference/${state}/${ethnicity}/${election}`)
            .then(response => {
                console.log('Response from server:', response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [state, election, ethnicity]);

    const extractValues = (index) => {
        return data[index]?.raceData || [];
    };

    const extractOtherValues = (index) => {
        return data[index]?.complementData || [];
    };

    const extractConfid = (index) => {
        return data[index]?.confidInterval || [];
    };

    const extractKDE = (index) => {
        return data[index]?.kdePolar || [];
    };

    const imagePath = `/choropleth_${state}_${ethnicity}_${data[0]?.candidate}.png`;
    const imagePath2 = `/choropleth_${state}_${ethnicity}_${data[1]?.candidate}.png`;

    const confidInterval = extractConfid(0); // Assuming 0 is the index you want to use for confidence interval

    const confidShape = {
        type: 'rect',
        x0: confidInterval[0], // Lower limit of confidence interval
        x1: confidInterval[1], // Upper limit of confidence interval
        y0: 0,
        y1: 300,
        fillcolor: 'grey',
        opacity: 0.3,
        line: {
            width: 0
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', marginLeft:'20px' }}>
                <img src={imagePath} alt={`${state} ${ethnicity}`} style={{ width: '25%', height: 'auto' , objectFit: 'cover'}} />
                <Plot
                    data={[
                        {
                            x: extractValues(0),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'green',
                            },
                            name: ethnicity
                        },
                        {
                            x: extractOtherValues(0),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'orange',
                            },
                            name: 'Other'
                        },
                    ]}
                    layout={{
                        width: 475, 
                        height: 450,
                        title: `Probability of ${ethnicity} Population Voting For ${data[0]?.candidate || 'Candidate'}`,
                        xaxis: {
                            range: [0, 1],
                            title: `Support for ${data[0]?.candidate || 'Candidate'}`,
                        },
                        yaxis: {
                            range: [0, 300],
                            title: 'Count',
                        },
                        barmode: 'overlay',
                        bargap: 0.05,
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                    }}
                />
                <Plot
                    data={[
                        {
                            x: extractKDE(0),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'green',
                            },
                            name: ethnicity
                        },
                        // {
                        //     x: extractConfid(0),
                        //     type: 'histogram',
                        //     opacity: 0.6,
                        //     marker: {
                        //         color: 'orange',
                        //     },
                        //     name: 'Other'
                        // },
                    ]}
                    layout={{
                        width: 475, 
                        height: 450,
                        title: `Polarization KDE For ${data[0]?.candidate || 'Candidate'}`,
                        xaxis: {
                            range: [0, 1],
                            title: `(${ethnicity} - Other) Support For ${data[0]?.candidate || 'Candidate'}`,
                        },
                        yaxis: {
                            range: [0, 300],
                            title: 'Count',
                        },
                        barmode: 'overlay',
                        bargap: 0.05,
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                        shapes: [confidShape]
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <img src={imagePath2} alt={`${state} ${ethnicity}`} style={{ width: '25%', height: 'auto' , objectFit: 'cover'}} />
                <Plot
                    data={[
                        {
                            x: extractValues(1),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'green',
                            },
                            name: ethnicity
                        },
                        {
                            x: extractOtherValues(1),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'orange',
                            },
                            name: 'Other'
                        },
                    ]}
                    layout={{
                        width: 475, 
                        height: 450,
                        title: `Probability of ${ethnicity} Population Voting For ${data[1]?.candidate || 'Candidate'}`,
                        xaxis: {
                            range: [0, 1],
                            title: `Support for ${data[1]?.candidate || 'Candidate'}`,
                        },
                        yaxis: {
                            range: [0, 300],
                        title: 'Count',
                    },
                    barmode: 'overlay',
                    bargap: 0.05,
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                }}
            />
            <Plot
                    data={[
                        {
                            x: extractKDE(1),
                            type: 'histogram',
                            opacity: 0.6,
                            marker: {
                                color: 'green',
                            },
                            name: ethnicity
                        },
                        // {
                        //     x: extractConfid(0),
                        //     type: 'histogram',
                        //     opacity: 0.6,
                        //     marker: {
                        //         color: 'orange',
                        //     },
                        //     name: 'Other'
                        // },
                    ]}
                    layout={{
                        width: 475, 
                        height: 450,
                        title: `Polarization KDE For ${data[1]?.candidate || 'Candidate'}`,
                        xaxis: {
                            range: [0, 1],
                            title: `(${ethnicity} - Other) Support For ${data[1]?.candidate || 'Candidate'}`,
                        },
                        yaxis: {
                            range: [0, 300],
                            title: 'Count',
                        },
                        barmode: 'overlay',
                        bargap: 0.05,
                        plot_bgcolor: 'white',
                        paper_bgcolor: 'white',
                        shapes: [confidShape]
                    }}
                />
            </div>
        </div>
    );
};

export default EcologicalInference;
