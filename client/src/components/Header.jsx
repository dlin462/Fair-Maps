import React from 'react';
import Button from '@mui/material/Button';
import HeatmapLegend from './Legend';

const Header = ({ state, ethnicity, handleClick }) => {
    return (
        <div style={{ height: '60px', backgroundColor: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ marginLeft: '20px', color:'white', fontSize: '40px', fontWeight: 'bold' }}>{state === 'Nevada' ? 'NEVADA' : 'MISSISSIPPI'}</div>
            <div className="legend">
                {ethnicity && <HeatmapLegend />}
            </div>
            <div style={{ marginRight: '10px' }}>
                <Button variant="contained" color="primary" onClick={handleClick}>
                    Open Menu
                </Button>
            </div>
        </div>
    );
};

export default Header;