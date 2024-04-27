import React from 'react';
import Button from '@mui/material/Button';

const Header = ({ state, legend, handleClick }) => {
    return (
        <div style={{ height: '50px', backgroundColor: 'lightgray', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ marginLeft: '20px', fontSize: '24px', fontWeight: 'bold' }}>{state === 'nevada' ? 'NEVADA' : 'MISSISSIPPI'}</div>
            <div className="legend">
                {legend}
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