import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Box = ({ state, ethnicity }) => {
    // const [boxData, setBoxData] = useState([]);

    // useEffect(() => {
    //     axios.get(`http://localhost:8080/boxWhisker/${state}/${ethnicity}`)
    //         .then(response => setBoxData(response.data))
    //         .catch(error => console.error('Error fetching box data:', error));
    // }, [state, ethnicity]);

    // const plotData = useMemo(() => boxData.map(district => ({
    //     type: 'box',
    //     name: `District ${district.districtId}`,
    //     y: district.data,
    //     boxpoints: 'all',
    //     jitter: 0.5,
    //     pointpos: 0,
    //     boxmean: 'sd',
    //     marker: { color: 'blue' },
    // })), [boxData]);

    const imagePath = `/Box_${ethnicity}_${state}.png`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
             <img src={imagePath} alt={`${state} ${ethnicity}`} style={{ width: '100%', height: '750px', objectFit: 'contain' }} />
        </div>
    );
};

export default Box;
