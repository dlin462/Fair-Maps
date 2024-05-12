
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EcologicalInference = ({ state }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/ecoInference`)
            .then(response => {
                console.log('Response from server:', response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, []);

    const extractAsianValues = () => {
        if (data && data.length > 0) {
            return data.flatMap(item => item.asian);
        } else {
            return [];
        }
    };

    const extractOtherValues = () => {
        if (data && data.length > 0) {
            return data.flatMap(item => item.other);
        } else {
            return [];
        }
    };

    return (
        <div>
            <Plot
                data={[
                    {
                        x: extractAsianValues(),
                        type: 'histogram',
                        opacity: 0.6,
                        marker: {
                            color: 'green',
                        },
                        name: 'Asian'
                    },
                    {
                        x: extractOtherValues(),
                        type: 'histogram',
                        opacity: 0.6,
                        marker: {
                            color: 'orange',
                        },
                        name: 'non-Asian'
                    },
                ]}
                layout={{
                    width: 920, 
                    height: 900, 
                    title: 'Probability of an Ethnic Group for a Specific Candidate',
                    xaxis: {
                        range: [0, 1
                        ],
                        title: 'Support for Biden',
                    },
                    yaxis: {
                        range: [0, 300],
                        title: 'count',
                    },
                    barmode: 'overlay',
                    bargap: 0.05,
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                }}
            />
        </div>
    );
};

export default EcologicalInference;