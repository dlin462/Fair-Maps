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
    const [showStateAssemblyTable, setShowStateAssemblyTable] = useState(false);
    const [showEthnicity, setShowEthnicity] = useState(false);
    const [count, setCount] = useState(0);

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

    const handleStateTable = () => {
        setShowStateAssemblyTable(!showStateAssemblyTable);
    };

    const handleEthnicity = () => {
        setCount(count + 1);
        console.log(count);
        setShowEthnicity(!showEthnicity);
    };

    const ethnicities = ['WHITE', 'BLACK', 'ASIAN', 'HISPANIC'];

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(false);
        setShowLineGraph(false);
        setShowBarGraph(false);
        setShowMap(true);

        
    };
    
    const [coordinates, setCoordinates] = useState({
        nevada: [39.876019, -117.224121],
        mississippi: [32.3547, -89.3985],
    });

    const handleStateChange = () => {
        if (state === 'nevada') {
            handleNavigate('/map/mississippi');
        }
        else {
            handleNavigate('/map/nevada');
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

    const handleEthnicityOptionClick = (ethnicity) => {
        setShowEthnicity(false);
        createHeatmap(ethnicity);
    };

    const stateDistricts = {
        nevada: '/nv_state_district_2022.geojson',
        mississippi: '/ms_State_Assembly_2022.geojson'
    };

    const statePrecincts = {
        nevada: '/nv_precinct_demographic.geojson',
        mississippi: '/prec_demographic_data.geojson'
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
                if(state === "nevada"){
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
                if(state === "nevada"){
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
                if(state === "nevada"){
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
                if(state === "nevada"){
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

        const map = L.map(mapContainerRef.current).setView(
            coordinates[state] || [40, -74.5],
            6 
        );

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        let colorIndex = 0;
        const districtColors = [
            '#3c8fc6', '#92d68f', '#459d3a', '#e37d7d', '#e35c5c',
            '#e1c150', '#e1a83e', '#b9b0e4', '#9487cb', '#e6e6b3',
            '#a6d2ff', '#3c8fc6', '#92d68f', '#459d3a', '#e37d7d',
            '#e35c5c', '#e1c150', '#e1a83e', '#b9b0e4', '#9487cb',
            '#e6e6b3', '#ffbb4c', '#9487cb', '#a6d2ff', '#3c8fc6'
        ];

        function getNextColor() {
            const color = districtColors[colorIndex];
            colorIndex = (colorIndex + 1) % districtColors.length;
            return color;
        }

        if (stateDistricts[state]) {
            fetch(stateDistricts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: feature => ({
                            color: 'white', 
                            weight: 1,
                            fillColor: getNextColor(), 
                            fillOpacity: 1,
                        }),

                        onEachFeature: (feature, layer) => {
                            // Access properties of each feature
                            const properties = feature.properties;
                            console.log(properties.ID);

                            const customIcon = L.divIcon({
                                className: 'custom-icon',
                                html: `<div>${properties.ID}</div>`,
                            });
                            
                            L.marker(layer.getBounds().getCenter(), {
                                icon: customIcon,
                            }).addTo(map);
                        }
                        
                    }).addTo(map);
                });
        }

        if (statePrecincts[state]) {
            fetch(statePrecincts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: {
                            color: 'white',
                            weight: 0.5, 
                            fillOpacity: 0,

                        },
                        onEachFeature: (feature, layer) => {
                            const white = feature.properties.WHITE;
                            const black = feature.properties.BLACK;
                            const asian = feature.properties.ASIAN;
                            const hisp = feature.properties.HISP;
                            
                        }

                    }).addTo(map);
                });
        }
    
        return () => map.remove();
    }, [state, showMap, coordinates]);

    const createHeatmap = (ethnicity) => {

       
        
        // const color = [
        //     '#3c8fc6'
        // ];

        // if (stateDistricts[state]) {
        //     fetch(stateDistricts[state])
        //         .then(response => response.json())
        //         .then(geojson => {
        //             L.geoJSON(geojson, {
        //                 style: feature => ({
        //                     color: 'black', 
        //                     weight: 1,
        //                     fillOpacity: 0,
        //                 }),           
        //             }).addTo(map);
        //         });
        // }

        // if (statePrecincts[state]) {
        //     fetch(statePrecincts[state])
        //         .then(response => response.json())
        //         .then(geojson => {
        //             L.geoJSON(geojson, {
        //                 style: {
        //                     color: 'white',
        //                     weight: 0.5, 
        //                     fillOpacity: 0,

        //                 },

        //             }).addTo(map);
        //         });
        // }
    }

    return (
        <div>
            <div ref={mapContainerRef} className="fullscreen-map" />
            <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                <div style={{margin: "50px", display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button variant="contained" color="primary" onClick={handleClick} >
                        Open Menu
                    </Button>
                    <div style={{fontSize: '40px', fontWeight:'bold'}}>{state === 'nevada' ? 'NEVADA' : 'MISSISSIPPI'}</div>
                    <Button variant="contained" color="primary" onClick={handleStateChange} >
                        Go To
                        {state === 'nevada' ? ' Mississippi' : ' Nevada'}
                    </Button>
                </div>
                <div className="content-container">
                    <div style={{ margin: "50px", display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={handleStateTable}>
                            State Information
                        </Button>
                    </div>
                    
                    {showStateAssemblyTable && (
                        <div className='table-container'>
                            <table>
                                <tbody>
                                    {Array.from({ length: 6 }, (_, rowIndex) => (
                                        <tr key={`row-${rowIndex}`}>
                                            {Array.from({ length: 2 }, (_, colIndex) => (
                                                <td key={`cell-${rowIndex}-${colIndex}`}>
                                                    Row {rowIndex + 1}, Column {colIndex + 1}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

               <div style={{ margin: "50px", display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={handleEthnicity}>
                        Heat Map
                    </Button>
                    {showEthnicity && (
                        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                            <div>
                                <button onClick={() => handleEthnicityOptionClick('WHITE')}>White</button>
                            </div>
                            <div>
                                <button onClick={() => handleEthnicityOptionClick('BLACK')}>Black</button>
                            </div>
                            <div>
                                <button onClick={() => handleEthnicityOptionClick('ASIAN')}>Asian</button>
                            </div>
                            <div>
                                <button onClick={() => handleEthnicityOptionClick('HISPANIC')}>Hispanic</button>
                            </div>
                        </div>
                    )}
                </div>



                <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>

                </div>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {state === 'nevada' && [
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
                    {state === 'mississippi' && [
                        <MenuItem key="nevada" onClick={handleGoBack}>
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