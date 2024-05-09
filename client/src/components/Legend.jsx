import React from 'react';
import chroma from 'chroma-js';

const HeatmapLegend = ({}) => {
    const colorScale = chroma.scale(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']).domain([0.125, 0.25, 0.375, 0.5]);
    const legendItems = ['0-12.5%', '12.6-25%', '25.1-37.5%', '37.6-50%', '50-100%']; 
    const legendContent = (
        <div className="legend-container" style={{ display: 'flex', alignItems: 'center' }}>
            {legendItems.map((item, index) => (
                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
                    <span className="legend-color-box" style={{ backgroundColor: colorScale((index + 1) * 0.125).hex(), width: '20px', height: '20px', display: 'inline-block', marginRight: '10px' }}></span>
                    <span className="legend-label" style={{ fontSize: "1.2em", color: 'white' }}>{item}</span>
                </div>
            ))}
        </div>
    );

    return legendContent;
};

export default HeatmapLegend;