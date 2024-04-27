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
// import chroma from 'chroma-js';

function MapComponent() {
    const mapContainerRef = useRef(null);

    const navigate = useNavigate();

    const { state } = useParams(); // Get the state parameter from the URL
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE1Heatmap, setAnchorElHeatmap] = React.useState(null);

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
    const [ethnicity, setEthnicity] = useState(null);
    const [legend, setLegend] = useState(null);
    const coordinates = {
        nevada: [39.876019, -117.224121],
        mississippi: [32.3547, -89.3985],
    };

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

    const handleClickHeatMap = (event) => {
        event.preventDefault();
        setAnchorElHeatmap(event.currentTarget);
        if(anchorE1Heatmap){
            setAnchorElHeatmap(null);
        }
    };

    const handleCloseHeatMap = () => {
        setAnchorElHeatmap(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateTable = () => {
        setShowStateAssemblyTable(!showStateAssemblyTable);
        handleClose();
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

    const handleStateChange = () => {
        if (state === 'nevada') {
            handleNavigate('/map/mississippi');
        }
        else {
            handleNavigate('/map/nevada');
        }
    }

    const handleChartDisplay = (showPieChartAssembly, showPieChartPopulation, showLineGraph, showBarGraph) => {
        setShowPieChartAssembly(showPieChartAssembly);
        setShowPieChartPopulation(showPieChartPopulation);
        setShowLineGraph(showLineGraph);
        setShowBarGraph(showBarGraph);
        setShowMap(!(showPieChartAssembly || showPieChartPopulation || showLineGraph || showBarGraph));
        setAnchorEl(false);
        setAnchorElHeatmap(false);
    }
    
    const handleGoBack = () => {
        handleChartDisplay(false, false, false, false);
        setEthnicity(null);
    }
    
    const handleClickPieChartAssembly = () => {
        setLegend(null);
        handleChartDisplay(true, false, false, false);
    };
    
    const handleClickPieChartPopulation = () =>{
        setLegend(null);
        handleChartDisplay(false, true, false, false);
    }
    
    const handleClickLineGraph = () =>{
        setLegend(null);
        handleChartDisplay(false, false, true, false);
    }
    
    const handleClickBarGraph = () =>{
        setLegend(null);
        handleChartDisplay(false, false, false, true);
    }

    const handleEthnicityOptionClick = (ethnicity) => {
        setAnchorEl(false);
        setEthnicity(ethnicity);
    };

    const stateDistricts = {
        nevada: '/nv_state_district_2022.geojson',
        mississippi: '/ms_State_Assembly_2022.geojson'
    };

    const statePrecincts = {
        nevada: '/nv_precinct_demographic.geojson',
        mississippi: '/ms_prec_demographic.geojson'
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
                if (state === "nevada") {
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
                } else {
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
                if (state === "nevada") {
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
                } else {
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
                if (state === "nevada") {
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
                        }]
                    };
                } else {
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
                        }]
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
                } else{
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

        if (stateDistricts[state] && (statePrecincts[state] && !ethnicity) ) {
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
                            const properties = feature.properties;
                            // console.log(properties.ID);
                        }
                    }).addTo(map);
                });
                setLegend(null);
            fetch(statePrecincts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: {
                            color: 'white',
                            weight: 0.5, 
                            fillOpacity: 0,

                        },
                    }).addTo(map);
                });
        }

        if (statePrecincts[state] && ethnicity) {
            fetch(statePrecincts[state])
                .then(response => response.json())
                .then(geojson => {

                    const maxEthnicityValue = Math.max(
                        ...geojson.features.map(feature => feature.properties[ethnicity.toUpperCase()])
                    );

                    const colorScale = chroma.scale(['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']).domain([0, maxEthnicityValue]);
                    const legendScale = chroma.scale(['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']).domain([0, 1]);
                    const legendItems = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]; 
                    const legendColorScales = legendItems.map(value => legendScale(value).hex());

                    const legendContent = (
                        <div className="legend-container" style={{ display: 'flex', alignItems: 'center' }}>
                            {legendItems.map((item, index) => (
                                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <span className="legend-color-box" style={{ backgroundColor: legendColorScales[index], width: '20px', height: '20px', display: 'inline-block', marginRight: '5px' }}></span>
                                    <span className="legend-label" style={{ fontSize: "1.2em" }}>{Math.round(item * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    );

                    setLegend(legendContent);

                    L.geoJSON(geojson, {
                        style: feature => ({
                            color: 'black',
                            weight: 0.5, 
                            fillOpacity: 0.7,
                            fillColor: colorScale(feature.properties[ethnicity.toUpperCase()]).hex(),

                        }),
                        //set ethnicity value back to null
                        onEachFeature: (feature, layer) => {
                            const properties = feature.properties;
                            const ethnicityValue = properties[ethnicity.toUpperCase()];
                            const totalPopulation = properties.TOTPOP;
                        }

                        }
                    ).addTo(map);
                });
        }
    
        return () => map.remove();
    }, [state, showMap, ethnicity, showStateAssemblyTable]);

    return (
        <div>
            
            <div style={{ height: '50px', backgroundColor: 'lightgray', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ marginLeft: '20px', fontSize: '24px', fontWeight: 'bold' }}>{state === 'nevada' ? 'NEVADA' : 'MISSISSIPPI'}</div>
                <div className="legend">
                        {legend}
                    </div>
                <div style = {{marginRight: '10px'}}>
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Open Menu
                    </Button>
                </div>
            </div>
            
            <div ref={mapContainerRef} className="fullscreen-map" style={{ width: showStateAssemblyTable ? '50%' : '100%', float: 'left', display: 'flex' }}>            
                <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>

                    <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>
                    </div>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem key="california" onClick={handleGoBack}>
                            Go Back to Map
                        </MenuItem>
                        <MenuItem key="" onClick={handleStateChange}>
                            Go To
                            {state === 'nevada' ? ' Mississippi' : ' Nevada'}
                        </MenuItem>
                        <MenuItem key="stateInformation" onClick={() => handleStateTable()}>
                            State Information
                        </MenuItem>
                        <MenuItem key="heatMap" onClick={handleClickHeatMap}>
                            Heat Map
                            <Menu anchorEl={anchorE1Heatmap} open={Boolean(anchorE1Heatmap)} onClose={handleCloseHeatMap} PaperProps={{ style: { transform: 'translateX(-385%)',  },}}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}>
                            <MenuItem onClick={() => handleEthnicityOptionClick('WHITE')}>White</MenuItem>
                            <MenuItem onClick={() => handleEthnicityOptionClick('BLACK')}>Black</MenuItem>
                            <MenuItem onClick={() => handleEthnicityOptionClick('ASIAN')}>Asian</MenuItem>
                            <MenuItem onClick={() => handleEthnicityOptionClick('HISP')}>Hispanic</MenuItem>
                            </Menu>
                        </MenuItem>
                        
                        <MenuItem key="racialDistributionAssembly" onClick={() => handleClickPieChartAssembly()}>
                            Racial Distribution Of Current State Assembly
                        </MenuItem>
                        <MenuItem key="racialDistributionPopulation" onClick={() => handleClickPieChartPopulation()}>
                            Racial Distribution Of Current State Population
                        </MenuItem>
                        <MenuItem key="voterTurnout" onClick={() => handleClickLineGraph()}>
                            Voter Turnout
                        </MenuItem>
                        <MenuItem key="racialGap" onClick={() => handleClickBarGraph()}>
                            Racial Gap Assessment
                        </MenuItem>
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
            {showStateAssemblyTable && (
                <div className="state-assembly-table" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0' }}>
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
                </div>
            )}
        </div>
    );
    
}

export default MapComponent;