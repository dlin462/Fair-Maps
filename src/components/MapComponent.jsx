import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function MapComponent() {
    const mapContainerRef = useRef(null);

    const navigate = useNavigate();

    const { state } = useParams(); // Get the state parameter from the URL
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
    };

    const stateCoordinates = {
        texas: [31.968599, -99.133209], // Coordinates for Texas (Leaflet uses [lat, lng] order)
        california: [36.778261, -119.417932], // Coordinates for California
    };

    const stateDistricts = {
        texas: '/texas_districts.json',
        california: '/california_districts.json'
    };

    const stateCounties = {
        texas: '/texas_counties.json',
        california: '/california_counties.json'
    };

    useEffect(() => {
        // Initialize the map
        const map = L.map(mapContainerRef.current).setView(
            stateCoordinates[state] || [40, -74.5], // Default coordinates if state not found
            6 // Adjust zoom level as needed
        );

        // Add a white background
        L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAmklEQVR42mP8/wcAAwAB/ADlYn/DSwAAAABJRU5ErkJggg==', {
            attribution: 'White Background',
        }).addTo(map);

        const shadesOfRed = ['#FF5733', '#FF3300', '#FF6666', '#FF0000', '#CC0000', '#990000'];
        let colorIndex = 0;

        // Add a border layer for the state districts
        if (stateDistricts[state]) {
            fetch(stateDistricts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: feature => {
            
                            const currentColor = shadesOfRed[colorIndex];
                            colorIndex = (colorIndex + 1) % shadesOfRed.length;

                            return {
                                color: 'red', 
                                weight: 1, 
                                fillColor: currentColor, 
                                fillOpacity: 0.5,
                            };
                        },
                    }).addTo(map);
                });
        }

        // Add a border layer for the state counties
        if (stateCounties[state]) {
            fetch(stateCounties[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: {
                            color: 'blue', 
                            weight: 0.6, 
                            fillOpacity: 0.1, 
                        },
                    }).addTo(map);
                });
        }

        return () => map.remove();
    }, [state]);

    return (
        <div>
            <div ref={mapContainerRef} className="fullscreen-map" />
            <div>
                <Button style= {{margin: "50px"}} variant="contained" color="primary" onClick={handleClick}>
                    Open Menu
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {state === 'texas' && [
                        <MenuItem key="california" onClick={() => handleNavigate('/map/california')}>
                        Go To California
                        </MenuItem>,
                        <MenuItem key="racialDistribution" onClick={() => handleNavigate('/map/racial-distribution')}>
                        Racial Distribution Of Current State Assembly
                        </MenuItem>,
                    ]}
                    {state === 'california' && [
                        <MenuItem key="texas" onClick={() => handleNavigate('/map/texas')}>
                        Go To Texas
                        </MenuItem>,
                        <MenuItem key="racialDistribution" onClick={() => handleNavigate('/map/racial-distribution')}>
                        Racial Distribution Of Current State Assembly
                        </MenuItem>,
                    ]}
                    </Menu>
            </div>
        </div>
     );
}

export default MapComponent;