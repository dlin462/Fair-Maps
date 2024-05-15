import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Box = ({ state, ethnicity }) => {
    const [boxData, setBoxData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/boxWhisker/${state}/${ethnicity}`)
            .then(response => setBoxData(response.data))
            .catch(error => console.error('Error fetching box data:', error));
    }, [state, ethnicity]);

    const plotData = useMemo(() => boxData.map(district => ({
        type: 'box',
        name: `District ${district.districtId}`,
        y: district.data,
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: 0,
        boxmean: 'sd',
        marker: { color: 'blue' },
    })), [boxData]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {boxData.length > 0 ? (
                <Plot
                    data={plotData}
                    layout={{ width: 800, height: 600, title: `Box & Whiskers Plot for ${ethnicity} in ${state}` }}
                />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Box;
