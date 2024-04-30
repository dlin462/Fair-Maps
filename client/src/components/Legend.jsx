import React from 'react';
import chroma from 'chroma-js';

const HeatmapLegend = ({}) => {
    const colorScale = chroma.scale(['white', 'red']).domain([0, 1]);
    const legendItems = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]; 
    const legendContent = (
        <div className="legend-container" style={{ display: 'flex', alignItems: 'center' }}>
            {legendItems.map((item, index) => (
                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <span className="legend-color-box" style={{ backgroundColor: colorScale(item).hex(), width: '20px', height: '20px', display: 'inline-block', marginRight: '5px' }}></span>
                    <span className="legend-label" style={{ fontSize: "1.2em" }}>{Math.round(item * 100)}%</span>
                </div>
            ))}
        </div>
    );

    return legendContent;
};

export default HeatmapLegend;