import { useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Chart from 'chart.js/auto';
// import Plot from 'react-plotly.js';
import axios from 'axios'

function MapComponent() {
    const mapContainerRef = useRef(null);

    const navigate = useNavigate();

    const { state } = useParams(); // Get the state parameter from the URL
    const [anchorEl, setAnchorEl] = React.useState(null);

    const chartContainerRefAssembly = useRef(null);
    const chartContainerRefPopulation = useRef(null);
    const chartContainerRefMinority = useRef(null);
    const chartContainerRefBarGraph = useRef(null);
    const chartRef = useRef(null);
    const [showPieChartAssembly, setShowPieChartAssembly] = useState(false);
    const [showPieChartPopulation, setShowPieChartPopulation] = useState(false);
    const [showLineGraph, setShowLineGraph] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const [showBarGraph, setShowBarGraph] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/map/${state}`)
            .then(response => {
                console.log("Server returned: ", response.data);
            })
            .catch(error => {
                console.log("error retreiving data from server: ", error)
            });
    }, [state])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(false);
        setShowLineGraph(false);
        setShowBarGraph(false);
        setShowMap(true);

        
    };

    // const stateCoordinates = {
    //     texas: [31.968599, -99.133209], // Coordinates for Texas (Leaflet uses [lat, lng] order) -110
    //     california: [36.778261, -119.417932], // Coordinates for California -130
    // };
    
    const [coordinates, setCoordinates] = useState({
        texas: [31.968599, -99.133209],
        california: [36.778261, -119.417932],
    });

    const handleStateChange = () => {
        if (state === 'texas') {
            handleNavigate('/map/california');
        }
        else {
            handleNavigate('/map/texas');
        }
    }

    const handleGoBack = () => {
        setShowPieChartAssembly(false);
        setShowLineGraph(false);
        setShowMap(true);
        setShowPieChartPopulation(false);
        setShowBarGraph(false);
    }

    const handleClickPieChartAssembly = () => {
        setShowLineGraph(false);
        setShowPieChartPopulation(false);
        setShowPieChartAssembly(true);
        setShowMap(false);
        setShowBarGraph(false);
    };

    const handleClickPieChartPopulation = () =>{
        setShowLineGraph(false);
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(true);
        setShowMap(false);
        setShowBarGraph(false);
    }

    const handleClickLineGraph = () =>{
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(false);
        setShowLineGraph(true);
        setShowMap(false);
        setShowBarGraph(false);
    }

    const handleClickBarGraph = () =>{
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(false);
        setShowLineGraph(false);
        setShowMap(false);
        setShowBarGraph(true);
    }

    const stateDistricts = {
        texas: '/texas_districts.json',
        california: '/california_districts.json'
    };

    const stateCounties = {
        texas: '/texas_counties.json',
        california: '/california_counties.json'
    };
    
    useEffect(() => {
        const ctx = chartContainerRefAssembly.current && chartContainerRefAssembly.current.getContext('2d');
    
        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }
    
            if (showPieChartAssembly) {
                let data;
                if(state === "texas"){
                    data = {
                        labels: ['WHITE', 'HISPANIC', 'BLACK', 'ASIAN', 'OTHER'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [62, 24, 9, 3, 2],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                }

                else{
                    data = {
                        labels: ['WHITE', 'LATINO', 'ASIAN', 'BLACK', 'NATIVE AMERICAN'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [49, 25, 15, 10, 1],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                }
    
                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `RACIAL DEMOGRAPHICS OF STATE ASSEMBLY OF ${state.toUpperCase()}`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }

                };
    
                chartRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: options,
                });
                
            }
        }
    }, [showPieChartAssembly]);


    useEffect(() => {
        const ctx = chartContainerRefPopulation.current && chartContainerRefPopulation.current.getContext('2d');
    
        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }
    
            if (showPieChartPopulation) {
                let data;
                if(state === "texas"){
                    data = {
                        labels: ['WHITE', 'HISPANIC', 'BLACK', 'ASIAN', 'OTHER'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [40, 40, 13, 6, 1],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                }
                
                else{
                    data = {
                        labels: ['WHITE', 'LATINO', 'ASIAN', 'BLACK', 'NATIVE AMERICAN'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [37, 39, 15, 5, 4],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                }
    
                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${state.toUpperCase()} POPULATION RACIAL DEMOGRAPHICS`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }

                };
    
                chartRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: options,
                });
                
            }
        }
    }, [showPieChartPopulation]);

    //line graph
    useEffect(() => {
        const ctx = chartContainerRefMinority.current && chartContainerRefMinority.current.getContext('2d');
    
        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }
    
            if (showLineGraph) {
                let data;
                const startYear = 1990;
                const endYear = 2018;
                const interval = 4;

                const labels = Array.from(
                    { length: Math.floor((endYear - startYear) / interval) + 1 },
                    (_, index) => startYear + index * interval
                );
                if(state === "texas"){
                    data = {
                    labels: labels,
                    datasets: [{
                        label: 'WHITE',
                        data: [51.3, 51, 48, 50, 52, 47, 45.8, 57.5],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    },
                    {
                        label: 'BLACK',
                        data: [42.5, 40, 41.8, 43, 42.5, 42.7, 40.6, 51.4],
                        fill: false,
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.1
                    },
                    {
                        label: 'ASIAN',
                        data: [40.2, 40, 34.5, 33.5, 34, 33.5, 26.9, 40.2],
                        fill: false,
                        borderColor: 'rgb(255, 205, 86)',
                        tension: 0.1
                    },
                    {
                        label: 'HISPANIC',
                        data: [36.0, 34.5, 33.8, 33.5, 34.2, 33.5, 27, 40.4],
                        fill: false,
                        borderColor: 'rgb(128, 128, 128)',
                        tension: 0.1
                    }
                ]
                    };
                }
                

                else{
                    data = {
                        labels: labels,
                        datasets: [{
                            label: 'WHITE',
                            data: [48, 52, 41, 52, 54, 49, 44, 51.5],
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'BLACK',
                            data: [42.0, 41, 41.2, 49, 42.0, 42.1, 42.6, 53.4],
                            fill: false,
                            borderColor: 'rgb(54, 162, 235)',
                            tension: 0.1
                        },
                        {
                            label: 'ASIAN',
                            data: [41.2, 40, 36.5, 33.5, 33, 33.5, 28.9, 45.2],
                            fill: false,
                            borderColor: 'rgb(255, 205, 86)',
                            tension: 0.1
                        },
                        {
                            label: 'HISPANIC',
                            data: [31.0, 37.5, 33.9, 43.5, 44.2, 43.5, 37, 41.4],
                            fill: false,
                            borderColor: 'rgb(128, 128, 128)',
                            tension: 0.1
                        }
                    ]
                        };
                    
                }
    
                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `VOTER TURNOUT FOR ${state.toUpperCase()}`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }

                };

                chartRef.current = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: options
                });
                
            }
        }
    }, [showLineGraph]);

    //bar graph
    useEffect(() => {
        const ctx = chartContainerRefBarGraph.current && chartContainerRefBarGraph.current.getContext('2d');
    
        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }
    
            if (showBarGraph) {
                let data;

                const labels = ["WHITE", "BLACK", "ASIAN", "HISPANIC", "OTHER"]
                if(state === "texas"){
                    data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Assembly',
                            data: [62, 9, 3, 24, 2],
                            backgroundColor: 'rgba(255, 205, 86, 0.6)',
                            borderColor: 'rgba(255, 205, 86, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Population',
                            data: [40, 13, 6, 40, 1],
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                ]
                    };
                }
                

                else{
                    data = {
                        labels: labels,
                        datasets: [
                        {
                            label: 'Assembly',
                            data: [49, 10, 15, 25, 1],
                            backgroundColor: 'rgba(255, 205, 86, 0.6)',
                            borderColor: 'rgba(255, 205, 86, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Voter Population',
                            data: [37, 5, 15, 39, 4],
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ]
                        };
                    
                }
    
                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `RACIAL GAP ASSESSMENT FOR ${state.toUpperCase()}`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }

                };

                chartRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                    options: options
                });
                
            }
        }
    }, [showBarGraph]);


    useEffect(() => {
        if (!showMap) {
            return;
        }
        // Initialize the map
        const map = L.map(mapContainerRef.current).setView(
            coordinates[state] || [40, -74.5], // Default coordinates if state not found
            6 // Adjust zoom level as needed
        );

        // Add a white background
        L.tileLayer('/Light_blue.png', {
            attribution: 'Light Blue Background',
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
                                weight: 2, 
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
                            weight: 0.1, 
                            fillOpacity: 0, 
                        },
                    }).addTo(map);
                });
        }

        return () => map.remove();
    }, [state, showMap, coordinates]);

    return (
        <div>
            <div ref={mapContainerRef} className="fullscreen-map" style={{ backgroundColor: 'lightblue' }} />
            <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                <div style={{margin: "50px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button variant="contained" color="primary" onClick={handleClick} >
                        Open Menu
                    </Button>
                    <div style={{fontSize: '40px', fontWeight:'bold'}}>{state === 'texas' ? 'TEXAS' : 'CALIFORNIA'}</div>
                    <Button variant="contained" color="primary" onClick={handleStateChange} >
                        Go To
                        {state === 'texas' ? ' California' : ' Texas'}
                    </Button>
                </div>
                <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>

                </div>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {state === 'texas' && [
                        <MenuItem key="california" onClick={handleGoBack}>
                            Go Back to Map
                        </MenuItem>,
                        <MenuItem key="racialDistributionAssembly" onClick={() => handleClickPieChartAssembly()}>
                            Racial Distribution Of Current State Assembly
                        </MenuItem>,
                        <MenuItem key="racialDistributionPopulation" onClick={() => handleClickPieChartPopulation()}>
                            Racial Distribution Of Current State Population
                        </MenuItem>,
                        <MenuItem key="Voter Turnout" onClick={() => handleClickLineGraph()}>
                            Voter Turnout
                        </MenuItem>,
                        <MenuItem key="Racial Gap" onClick={() => handleClickBarGraph()}>
                            Racial Gap Assessment
                        </MenuItem>,
                    ]}
                    {state === 'california' && [
                        <MenuItem key="texas" onClick={handleGoBack}>
                            Go Back to Map
                        </MenuItem>,
                        <MenuItem key="racialDistributionAssembly" onClick={() => handleClickPieChartAssembly()}>
                            Racial Distribution Of Current State Assembly
                        </MenuItem>,
                            <MenuItem key="racialDistributionPopulation" onClick={() => handleClickPieChartPopulation()}>
                            Racial Distribution Of Current State Population
                        </MenuItem>,
                        <MenuItem key="Voter Turnout" onClick={() => handleClickLineGraph()}>
                            Voter Turnout
                        </MenuItem>,
                        <MenuItem key="Racial Gap" onClick={() => handleClickBarGraph()}>
                            Racial Gap Assessment
                        </MenuItem>,
                    ]}
                    </Menu>
                    {showPieChartAssembly && (
                        <div>
                            <canvas ref={chartContainerRefAssembly} width={600} height={600}/>
                        </div>
                    )}
                    {showPieChartPopulation && (
                        <div>
                            <canvas ref={chartContainerRefPopulation} width={600} height={600}/>
                        </div>
                    )}
                    {showLineGraph && (
                        <div>
                            <canvas ref={chartContainerRefMinority} width={600} height={600}/>
                        </div>
                    )}
                    {showBarGraph && (
                        <div>
                            <canvas ref={chartContainerRefBarGraph} width={600} height={600}/>
                        </div>
                    )}
            </div>
        </div>
     );
}

export default MapComponent;