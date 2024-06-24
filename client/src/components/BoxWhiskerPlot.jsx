import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Box = ({ state, ethnicity }) => {


    const imagePath = `/Box_${ethnicity}_${state}.png`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
             <img src={imagePath} alt={`${state} ${ethnicity}`} style={{ width: '100%', height: '750px', objectFit: 'contain' }} />
        </div>
    );
};

export default Box;
